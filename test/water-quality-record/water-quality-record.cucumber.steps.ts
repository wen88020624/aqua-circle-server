import { AfterAll, Before, BeforeAll, DataTable, Given, When, setDefaultTimeout } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { E2eContext, createE2eContext } from '../helpers/e2e-app';

setDefaultTimeout(120000);

interface ScenarioContext {
  payload?: Record<string, unknown>;
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
  if (!pickle.uri.includes('record-management/水質檢測記錄管理.feature')) {
    return;
  }
  await e2eContext!.reset();
  this.response = undefined;
  scenarioContext = {};
});

AfterAll(async function () {
  if (e2eContext) {
    await e2eContext.close();
  }
});

Given('水質檢測記錄請求資料如下', async function (table: DataTable) {
  const row = toRecord(table);
  const aquariumId =
    row.aquarium && row.aquarium.trim() !== '' ? await ensureAquarium(row.aquarium) : undefined;

  scenarioContext.payload = {
    testType: row.metric ?? '',
    testDate: row.date ?? '',
    value: parseMaybeNumber(row.value),
    aquariumId,
  };
});

When('使用者新增\\/更新水質檢測記錄', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.payload!;

  this.dbAssertion = async ({ success }) => {
    const count = await prisma.waterQualityRecord.count();
    if (success) {
      assert.equal(count, 1);
      const saved = await prisma.waterQualityRecord.findFirst({
        where: {
          testType: String(payload.testType),
          testDate: String(payload.testDate),
        },
      });
      assert.ok(saved);
      assert.equal(saved?.value, payload.value as number);
    } else {
      assert.equal(count, 0);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .post('/water-quality-records')
    .send(payload);
  this.response = { status: response.status, body: response.body };
});

