import {
  AfterAll,
  Before,
  BeforeAll,
  DataTable,
  Given,
  When,
  Then,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { E2eContext, createE2eContext } from '../helpers/e2e-app';

setDefaultTimeout(120000);

interface ScenarioContext {
  createPayload?: {
    date: string;
    materialName: string;
    notes?: string;
    aquariumName: string;
  };

  queryResult?: any[];
  defaultSupplyId?: number; // initial supply used when seeding feeding records
}

let e2eContext: E2eContext | null = null;
let prisma: PrismaService;
let scenarioContext: ScenarioContext;

function toRecord(table: DataTable): Record<string, string> {
  return (table.hashes()[0] ?? {}) as Record<string, string>;
}

function asMaybeString(v?: string): string | undefined {
  if (v === undefined || v === null || v === '') {
    return undefined;
  }
  return v;
}

async function ensureAquarium(name: string): Promise<number> {
  const found = await prisma.aquarium.findFirst({ where: { name } });
  if (found) {
    return found.id;
  }
  const created = await prisma.aquarium.create({
    data: {
      name,
      length: 100,
      width: 50,
      height: 60,
      status: '開缸',
      setupDate: '2025-01-01',
    },
  });
  return created.id;
}

async function ensureSupply(args: {
  name: string;
  tag: string;
  status?: string;
  expiryDate?: string;
}): Promise<number> {
  const created = await prisma.supply.create({
    data: {
      name: args.name,
      tag: args.tag,
      quantity: 10,
      status: args.status ?? '正常',
      price: 0,
      expiryDate: args.expiryDate,
      aquariumId: null,
    },
  });
  return created.id;
}

BeforeAll(async function () {
  e2eContext = await createE2eContext();
  prisma = e2eContext.prisma;
});

Before(async function ({ pickle }) {
  if (!pickle.uri.includes('record-management/餵食記錄管理.feature')) {
    return;
  }
  await e2eContext!.reset();
  this.response = undefined;
  scenarioContext = {
    defaultSupplyId: undefined,
  };
});

AfterAll(async function () {
  if (e2eContext) {
    await e2eContext.close();
  }
});

Given('餵食記錄請求資料如下', async function (table: DataTable) {
  const row = toRecord(table);
  scenarioContext.createPayload = {
    date: row.date ?? '',
    materialName: row.material ?? '',
    notes: asMaybeString(row.notes),
    aquariumName: row.aquarium ?? '主缸',
  };
});

Given('系統初始餵食記錄資料如下', async function (table: DataTable) {
  // 這組 scenario 會在先建立餵食記錄後，再提供「可用耗材」用於更新，因此這裡提供 dummy supply
  const supplyId =
    scenarioContext.defaultSupplyId ??
    (await ensureSupply({ name: '紅蟲', tag: '飼料', status: '正常', expiryDate: undefined }));
  scenarioContext.defaultSupplyId = supplyId;
  const rows = table.hashes() as Array<Record<string, string>>;

  // 重新建立 feeding records，避免同一 scenario 中殘留資料
  await prisma.feedingRecord.deleteMany();

  for (const row of rows) {
    if (!row.id) {
      continue;
    }
    const aquariumId = await ensureAquarium(row.aquarium);
    await prisma.feedingRecord.create({
      data: {
        id: Number(row.id),
        date: row.date,
        supplyId: supplyId,
        notes: null,
        aquariumId,
      },
    });
  }
});

Given('系統中不存在任何餵食記錄', async function () {
  await prisma.feedingRecord.deleteMany();
});

Given('餵食記錄 1 存在', async function () {
  const aquariumId = await ensureAquarium('主缸');
  const supplyId = await ensureSupply({ name: '紅蟲', tag: '飼料', status: '正常', expiryDate: undefined });
  scenarioContext.defaultSupplyId = supplyId;
  await prisma.feedingRecord.deleteMany({ where: { id: 1 } });
  await prisma.feedingRecord.create({
    data: {
      id: 1,
      date: '2025-01-01',
      supplyId,
      notes: null,
      aquariumId,
    },
  });
});

Given('餵食記錄 1 不存在', async function () {
  await prisma.feedingRecord.deleteMany({ where: { id: 1 } });
});

When(
  /^使用者在魚缸「主缸」中新增餵食記錄，選擇耗材「(.+)」$/,
  async function (materialName: string) {
  assert.ok(e2eContext);
  const aquariumId = await ensureAquarium('主缸');
  const supply = await prisma.supply.findFirst({ where: { name: materialName } });
  assert.ok(supply, `找不到耗材「${materialName}」`);

  const payload = {
    date: '2025-01-01',
    consumableId: supply!.id,
    notes: undefined,
    aquariumId,
  };

  this.dbAssertion = async ({ success }) => {
    const count = await prisma.feedingRecord.count();
    if (success) {
      assert.equal(count, 1);
      const saved = await prisma.feedingRecord.findFirst({
        where: { date: payload.date, aquariumId: payload.aquariumId, supplyId: payload.consumableId },
      });
      assert.ok(saved);
    } else {
      assert.equal(count, 0);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .post('/feeding-records')
    .send(payload);
  this.response = { status: response.status, body: response.body };
  },
);

When('使用者新增餵食記錄', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.createPayload!;
  const aquariumId = await ensureAquarium(payload.aquariumName);
  const supply = await prisma.supply.findFirst({ where: { name: payload.materialName } });
  assert.ok(supply, `找不到耗材「${payload.materialName}」`);

  const requestBody = {
    date: payload.date,
    consumableId: supply!.id,
    notes: payload.notes,
    aquariumId,
  };

  this.dbAssertion = async ({ success }) => {
    const count = await prisma.feedingRecord.count();
    if (success) {
      assert.equal(count, 1);
      const saved = await prisma.feedingRecord.findFirst({
        where: {
          date: requestBody.date,
          aquariumId: requestBody.aquariumId,
          supplyId: requestBody.consumableId,
        },
      });
      assert.ok(saved);
      assert.equal(saved?.notes, requestBody.notes ?? null);
    } else {
      assert.equal(count, 0);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .post('/feeding-records')
    .send(requestBody);
  this.response = { status: response.status, body: response.body };
});

When(
  /^使用者更新餵食記錄 (\d+)，選擇耗材「(.+)」$/,
  async function (recordIdStr: string, materialName: string) {
    const recordId = Number(recordIdStr);
    assert.ok(e2eContext);
    const supply = await prisma.supply.findFirst({ where: { name: materialName } });
    assert.ok(supply, `找不到耗材「${materialName}」`);

    const newSupplyId = supply!.id;
    const originalSupplyId = scenarioContext.defaultSupplyId!;

    const updateBody = { consumableId: newSupplyId };

  this.dbAssertion = async ({ success, message }) => {
    const saved = await prisma.feedingRecord.findUnique({ where: { id: recordId } });
    if (success) {
      assert.ok(saved);
      assert.equal(saved?.supplyId, newSupplyId);
    } else {
      if (message === '餵食記錄不存在') {
        assert.equal(saved, null);
      } else {
        assert.ok(saved);
        assert.equal(saved?.supplyId, originalSupplyId);
      }
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .patch(`/feeding-records/${recordId}`)
    .send(updateBody);
  this.response = { status: response.status, body: response.body };
  },
);

When('使用者查詢所有餵食記錄', async function () {
  assert.ok(e2eContext);
  const response = await request(e2eContext.app.getHttpServer()).get('/feeding-records');
  scenarioContext.queryResult = response.body;
  (this as any).queryResult = response.body;
});

When('使用者查詢魚缸「主缸」中的餵食記錄', async function () {
  assert.ok(e2eContext);
  const aquariumId = await ensureAquarium('主缸');
  const response = await request(e2eContext.app.getHttpServer()).get(
    `/feeding-records?aquariumId=${aquariumId}`,
  );
  scenarioContext.queryResult = response.body;
  (this as any).queryResult = response.body;
});

When('使用者刪除餵食記錄 1', async function () {
  assert.ok(e2eContext);
  const response = await request(e2eContext.app.getHttpServer()).delete('/feeding-records/1');
  this.response = { status: response.status, body: response.body };
});

Then('查詢結果應包含餵食記錄', function (table: DataTable) {
  const ids = (table.hashes() as Array<Record<string, string>>).map((r) => Number(r.id));
  const list = scenarioContext.queryResult ?? [];
  const foundIds = new Set(list.map((x: any) => x.id));
  for (const id of ids) {
    assert.ok(foundIds.has(id), `缺少 id=${id} 的餵食記錄`);
  }
});

Then('查詢結果應為空', function () {
  const list = scenarioContext.queryResult ?? [];
  assert.ok(Array.isArray(list));
  assert.equal(list.length, 0);
});

Then('操作失敗', function () {
  assert.ok(this.response, '缺少操作結果，請先執行 When 步驟');
  assert.notEqual(this.response.status >= 200 && this.response.status < 300, true);
});

Then('餵食記錄 1 被刪除', async function () {
  const saved = await prisma.feedingRecord.findFirst({ where: { id: 1 } });
  assert.equal(saved, null);
});

Then('系統提示「餵食記錄不存在」', function () {
  assert.ok(this.response, '缺少操作結果，請先執行 When 步驟');
  assert.equal(this.response.body?.message, '餵食記錄不存在');
});

