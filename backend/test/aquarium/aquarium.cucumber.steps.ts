import { DataTable, Given, When, Then, BeforeAll, Before, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { E2eContext, createE2eContext } from '../helpers/e2e-app';

interface ScenarioContext {
  createPayload?: Record<string, unknown>;
  response?: {
    status: number;
    body: any;
  };
  queryResult?: any[];
  aquariumsByName: Map<string, number>;
}

let e2eContext: E2eContext | null = null;
let prisma: PrismaService;
let scenarioContext: ScenarioContext;

setDefaultTimeout(120000);

function toRecord(table: DataTable): Record<string, string> {
  return (table.hashes()[0] ?? {}) as Record<string, string>;
}

function toRecords(table: DataTable): Array<Record<string, string>> {
  return table.hashes() as Array<Record<string, string>>;
}

function asNumber(value?: string): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return Number(value);
}

function asMaybeString(value?: string): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return value;
}

function assignCreatePayloadFromTable(table: DataTable): void {
  const row = toRecord(table);
  scenarioContext.createPayload = {
    name: row.name,
    length: asNumber(row.length),
    width: asNumber(row.width),
    height: asNumber(row.height),
    status: row.status ?? '',
    setupDate: row.setupDate,
    notes: asMaybeString(row.notes),
  };
}

function assertHttpResponse(table: DataTable): void {
  const row = toRecord(table);
  assert.equal(scenarioContext.response?.status, Number(row.statusCode));
  if (row.message !== undefined) {
    assert.equal(scenarioContext.response?.body?.message, row.message);
  }
}

BeforeAll(async function () {
  e2eContext = await createE2eContext();
  prisma = e2eContext.prisma;
});

Before(async function () {
  if (!e2eContext) {
    throw new Error('E2E context not initialized');
  }
  await e2eContext.reset();
  scenarioContext = {
    aquariumsByName: new Map<string, number>(),
  };
});

AfterAll(async function () {
  if (e2eContext) {
    await e2eContext.close();
  }
});

Given('建立魚缸請求資料如下', function (table: DataTable) {
  assignCreatePayloadFromTable(table);
});

When('使用者建立新的魚缸', async function () {
  if (!e2eContext) {
    throw new Error('E2E context not initialized');
  }
  const response = await request(e2eContext.app.getHttpServer())
    .post('/aquariums')
    .send(scenarioContext.createPayload);
  scenarioContext.response = { status: response.status, body: response.body };
});

Then('HTTP 回應應為', function (table: DataTable) {
  assertHttpResponse(table);
});

Then('資料庫中的魚缸資料應為', async function (table: DataTable) {
  const row = toRecord(table);
  const saved = await prisma.aquarium.findFirst({
    where: { name: row.name },
  });
  assert.ok(saved);
  assert.equal(saved.length, Number(row.length));
  assert.equal(saved.width, Number(row.width));
  assert.equal(saved.height, Number(row.height));
  assert.equal(saved.status, row.status);
  assert.equal(saved.setupDate, row.setupDate);
});

Then(/^資料庫中應不存在名稱為「(.+)」的魚缸$/, async function (name: string) {
  const found = await prisma.aquarium.findFirst({
    where: { name },
  });
  assert.equal(found, null);
});

Given('系統初始魚缸資料如下', async function (table: DataTable) {
  const rows = toRecords(table);
  for (const row of rows) {
    const aquarium = await prisma.aquarium.create({
      data: {
        name: row.name,
        length: Number(row.length),
        width: Number(row.width),
        height: Number(row.height),
        status: row.status,
        setupDate: row.setupDate,
        notes: asMaybeString(row.notes),
      },
    });
    scenarioContext.aquariumsByName.set(aquarium.name, aquarium.id);
  }
});

When('使用者查詢所有魚缸', async function () {
  if (!e2eContext) {
    throw new Error('E2E context not initialized');
  }
  const response = await request(e2eContext.app.getHttpServer()).get('/aquariums');
  scenarioContext.response = { status: response.status, body: response.body };
  scenarioContext.queryResult = response.body;
});

Then('查詢結果應包含魚缸', function (table: DataTable) {
  const row = toRecord(table);
  const found = scenarioContext.queryResult?.find((item) => item.name === row.name);
  assert.ok(found);
  assert.equal(found.length, Number(row.length));
  assert.equal(found.width, Number(row.width));
  assert.equal(found.height, Number(row.height));
  assert.equal(found.status, row.status);
});

Given('系統中不存在任何魚缸', async function () {
  await prisma.aquarium.deleteMany();
});

Then('查詢結果應為空陣列', function () {
  assert.equal(Array.isArray(scenarioContext.queryResult), true);
  assert.equal(scenarioContext.queryResult?.length, 0);
});

Given('魚缸「魚缸 1」有以下關聯資料', async function (table: DataTable) {
  const aquariumId = scenarioContext.aquariumsByName.get('魚缸 1');
  assert.ok(aquariumId);
  const rows = toRecords(table);

  for (const row of rows) {
    if (row.relationType === 'organism') {
      await prisma.organism.create({
        data: {
          name: row.name,
          tag: row.tag,
          aquariumId: aquariumId!,
        },
      });
    }
    if (row.relationType === 'equipment') {
      await prisma.equipment.create({
        data: {
          name: row.name,
          tag: row.tag,
          status: '使用中',
          aquariumId,
        },
      });
    }
    if (row.relationType === 'waterChange') {
      await prisma.waterChange.create({
        data: {
          date: row.date,
          waterAmount: 0.5,
          aquariumId: aquariumId!,
        },
      });
    }
  }
});

When('使用者刪除名稱為「魚缸 1」的魚缸', async function () {
  if (!e2eContext) {
    throw new Error('E2E context not initialized');
  }
  const aquariumId = scenarioContext.aquariumsByName.get('魚缸 1');
  assert.ok(aquariumId);
  const response = await request(e2eContext.app.getHttpServer()).delete(`/aquariums/${aquariumId}`);
  scenarioContext.response = { status: response.status, body: response.body };
});

Then('關聯資料應保留如下', async function (table: DataTable) {
  const rows = toRecords(table);

  for (const row of rows) {
    const expectedCount = Number(row.expectedCount);
    if (row.relationType === 'organism') {
      const count = await prisma.organism.count({
        where: { name: '小丑魚' },
      });
      assert.equal(count, expectedCount);
    }
    if (row.relationType === 'equipment') {
      const count = await prisma.equipment.count({
        where: { name: '圓筒過濾器' },
      });
      assert.equal(count, expectedCount);
    }
    if (row.relationType === 'waterChange') {
      const count = await prisma.waterChange.count({
        where: { date: '2025-01-02' },
      });
      assert.equal(count, expectedCount);
    }
  }
});
