import { AfterAll, Before, BeforeAll, DataTable, Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { E2eContext, createE2eContext } from '../helpers/e2e-app';

setDefaultTimeout(120000);

interface ScenarioContext {
  createPayload?: Record<string, unknown>;
  updatePayload?: Record<string, unknown>;
  initialSupplyIds: Map<string, number>;
  queryResult?: any[];
}

let e2eContext: E2eContext | null = null;
let prisma: PrismaService;
let scenarioContext: ScenarioContext;

function toRecord(table: DataTable): Record<string, string> {
  return (table.hashes()[0] ?? {}) as Record<string, string>;
}

function parseMaybeNumber(value?: string): number | undefined {
  if (value === undefined || value === null || value.trim() === '') {
    return undefined;
  }
  return Number(value);
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

BeforeAll(async function () {
  e2eContext = await createE2eContext();
  prisma = e2eContext.prisma;
});

Before(async function ({ pickle }) {
  if (!pickle.uri.includes('resource-management/耗材管理.feature')) {
    return;
  }
  await e2eContext!.reset();
  this.response = undefined;
  scenarioContext = {
    initialSupplyIds: new Map<string, number>(),
  };
  await ensureAquarium('主缸');
});

AfterAll(async function () {
  if (e2eContext) {
    await e2eContext.close();
  }
});

Given('耗材請求資料如下', async function (table: DataTable) {
  const row = toRecord(table);
  const aquariumId = await ensureAquarium(row.aquarium || '主缸');
  scenarioContext.createPayload = {
    name: row.name ?? '',
    tag: row.tag ?? '',
    quantity: Number(row.quantity),
    price: parseMaybeNumber(row.amount),
    status: row.status ?? '',
    aquariumId,
  };
});

Given('系統初始耗材資料如下', async function (table: DataTable) {
  const rows = table.hashes() as Array<Record<string, string>>;
  if (!scenarioContext) {
    scenarioContext = { initialSupplyIds: new Map<string, number>() };
  }
  scenarioContext.initialSupplyIds.clear();

  for (const row of rows) {
    if (!row.name) {
      continue;
    }
    const status = row.status ?? '正常';
    const quantity = row.quantity !== undefined ? Number(row.quantity) : 10;
    const price = row.amount !== undefined ? parseMaybeNumber(row.amount) : undefined;
    const expiryDate = status === '過期' ? '2020-01-01' : undefined;

    const aquariumId =
      row.aquarium && row.aquarium.trim() !== '' ? await ensureAquarium(row.aquarium) : undefined;

    const created = await prisma.supply.create({
      data: {
        name: row.name,
        tag: row.tag,
        quantity,
        status,
        price,
        expiryDate,
        aquariumId,
      },
    });
    scenarioContext.initialSupplyIds.set(created.name, created.id);
  }
});

Given('耗材更新資料如下', async function (table: DataTable) {
  const row = toRecord(table);
  const aquariumId = await ensureAquarium(row.aquarium || '主缸');
  scenarioContext.updatePayload = {
    name: row.name ?? '',
    tag: row.tag ?? '',
    quantity: parseMaybeNumber(row.quantity) ?? 0,
    price: parseMaybeNumber(row.amount),
    status: row.status ?? '',
    aquariumId,
  };
});

When('使用者新增耗材', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.createPayload!;
  const expectedStatus = Number(payload.quantity) > 0 ? '使用中' : '用完';

  this.dbAssertion = async ({ success, status }) => {
    const name = String(payload.name ?? '');
    const saved = await prisma.supply.findFirst({ where: { name } });
    const count = await prisma.supply.count();

    if (success) {
      assert.equal(count, 1);
      assert.ok(saved);
      assert.equal(saved?.tag, String(payload.tag ?? ''));
      assert.equal(saved?.quantity, Number(payload.quantity));
      assert.equal(saved?.price, payload.price ?? null);
      assert.equal(saved?.aquariumId, payload.aquariumId);
      assert.equal(saved?.status, status ?? expectedStatus);
    } else {
      assert.equal(count, 0);
      assert.equal(saved, null);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .post('/supplies')
    .send(payload);
  this.response = { status: response.status, body: response.body };
});

When('使用者新增\\/更新耗材', async function () {
  // 對此 controller 只有 POST(create)，feature 使用「新增/更新」統一表述
  assert.ok(e2eContext);
  const payload = scenarioContext.createPayload!;
  const expectedStatus = Number(payload.quantity) > 0 ? '使用中' : '用完';

  this.dbAssertion = async ({ success, status }) => {
    const name = String(payload.name ?? '');
    const saved = await prisma.supply.findFirst({ where: { name } });
    const count = await prisma.supply.count();

    if (success) {
      assert.equal(count, 1);
      assert.ok(saved);
      assert.equal(saved?.tag, String(payload.tag ?? ''));
      assert.equal(saved?.quantity, Number(payload.quantity));
      assert.equal(saved?.price, payload.price ?? null);
      assert.equal(saved?.aquariumId, payload.aquariumId);
      assert.equal(saved?.status, status ?? expectedStatus);
    } else {
      assert.equal(count, 0);
      assert.equal(saved, null);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .post('/supplies')
    .send(payload);
  this.response = { status: response.status, body: response.body };
});

When('使用者更新耗材', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.updatePayload!;

  // 這組 scenario 沒有提供「系統初始耗材」，所以先建立一筆可被更新的耗材（固定 id=1）
  await prisma.supply.deleteMany();
  await prisma.supply.create({
    data: {
      id: 1,
      name: String(payload.name ?? '飼料'),
      tag: '飼料',
      quantity: 1,
      status: '使用中',
      price: 0,
      aquariumId: payload.aquariumId as number,
    },
  });

  const targetId = 1;
  const expectedStatus = Number(payload.quantity) > 0 ? '使用中' : payload.quantity === 0 ? '用完' : '使用中';

  this.dbAssertion = async ({ success, status, message }) => {
    const saved = await prisma.supply.findUnique({ where: { id: targetId } });
    if (success) {
      assert.ok(saved);
      assert.equal(saved?.name, String(payload.name ?? ''));
      assert.equal(saved?.tag, String(payload.tag ?? ''));
      assert.equal(saved?.quantity, Number(payload.quantity));
      assert.equal(saved?.aquariumId, payload.aquariumId);
      assert.equal(saved?.price, payload.price ?? null);
      assert.equal(saved?.status, status ?? expectedStatus);
    } else {
      assert.ok(saved);
      // 失敗時應維持既有值（更新會在驗證階段失敗，未寫入）
      assert.equal(saved?.tag, '飼料');
      assert.equal(saved?.quantity, 1);
      assert.equal(saved?.status, '使用中');
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .patch(`/supplies/${targetId}`)
    .send({
      name: payload.name,
      tag: payload.tag,
      quantity: payload.quantity,
      price: payload.price,
      status: payload.status,
      aquariumId: payload.aquariumId,
    });
  this.response = { status: response.status, body: response.body };
});

When('使用者更新名稱為「飼料」的耗材', async function () {
  assert.ok(e2eContext);
  const update = scenarioContext.updatePayload!;

  let targetId = scenarioContext.initialSupplyIds.get('飼料');
  if (!targetId) {
    // 用不存在 id=1 觸發 NotFoundException
    targetId = 1;
  }

  this.dbAssertion = async ({ success, status, message }) => {
    const saved = await prisma.supply.findUnique({ where: { id: targetId! } });
    if (success) {
      assert.ok(saved);
      assert.equal(saved?.name, '飼料');
      if (update.tag !== undefined) {
        assert.equal(saved?.tag, String(update.tag));
      }
      if (update.quantity !== undefined) {
        assert.equal(saved?.quantity, Number(update.quantity));
      }
      assert.equal(saved?.aquariumId, update.aquariumId);
      assert.equal(saved?.price, update.price ?? null);
      if (status) {
        assert.equal(saved?.status, status);
      }
    } else {
      assert.equal(saved, null);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .patch(`/supplies/${targetId}`)
    .send({
      name: update.name,
      tag: update.tag,
      quantity: update.quantity,
      price: update.price,
      status: update.status,
      aquariumId: update.aquariumId,
    });
  this.response = { status: response.status, body: response.body };
});

When('使用者更新名稱為「飼料」的耗材狀態為「丟棄」', async function () {
  assert.ok(e2eContext);

  const targetId = scenarioContext.initialSupplyIds.get('飼料') ?? 1;

  this.dbAssertion = async ({ success, status }) => {
    const saved = await prisma.supply.findUnique({ where: { id: targetId } });
    if (success) {
      assert.ok(saved);
      assert.equal(saved?.status, status ?? '丟棄');
    } else {
      assert.equal(saved, null);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .patch(`/supplies/${targetId}`)
    .send({ status: '丟棄' });
  this.response = { status: response.status, body: response.body };
});

Then(/^耗材狀態應為「(.+)」$/, async function (this: any, expectedStatus: string) {
  const payload = scenarioContext.createPayload ?? scenarioContext.updatePayload;
  const name = String(payload?.name ?? '飼料');
  const saved = await prisma.supply.findFirst({ where: { name } });
  assert.ok(saved);
  assert.equal(saved?.status, expectedStatus);
});

When('使用者查詢所有耗材', async function () {
  assert.ok(e2eContext);
  const response = await request(e2eContext.app.getHttpServer()).get('/supplies');
  scenarioContext.queryResult = response.body;
  this.response = { status: response.status, body: response.body };
});

Then('查詢結果為空', function () {
  const arr = scenarioContext.queryResult;
  assert.ok(Array.isArray(arr));
  assert.equal(arr.length, 0);
});

