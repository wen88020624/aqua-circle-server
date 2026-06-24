import { AfterAll, Before, BeforeAll, DataTable, Given, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { E2eContext, createE2eContext } from '../helpers/e2e-app';

interface ScenarioContext {
  payload?: Record<string, unknown>;
  aquariumId?: number;
}

let e2eContext: E2eContext | null = null;
let prisma: PrismaService;
let scenarioContext: ScenarioContext;

function firstRow(table: DataTable): Record<string, string> {
  return (table.hashes()[0] ?? {}) as Record<string, string>;
}

function parseMaybeNumber(value?: string): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return Number(value);
}

BeforeAll(async function () {
  e2eContext = await createE2eContext();
  prisma = e2eContext.prisma;
});

Before(async function ({ pickle }) {
  if (!pickle.uri.includes('record-management/換水記錄管理.feature')) {
    return;
  }
  if (!e2eContext) {
    throw new Error('E2E context not initialized');
  }
  await e2eContext.reset();
  this.response = undefined;
  const aquarium = await prisma.aquarium.create({
    data: {
      name: '主缸',
      length: 100,
      width: 50,
      height: 60,
      status: '開缸',
      setupDate: '2025-01-01',
    },
  });
  scenarioContext = {
    aquariumId: aquarium.id,
  };
});

AfterAll(async function () {
  if (e2eContext) {
    await e2eContext.close();
  }
});

Given('換水記錄請求資料如下', function (table: DataTable) {
  const row = firstRow(table);
  const aquarium =
    row.aquarium && row.aquarium.trim() !== ''
      ? scenarioContext.aquariumId
      : undefined;

  scenarioContext.payload = {
    date: row.date ?? '',
    waterChangeRatio: parseMaybeNumber(row.ratio),
    aquariumId: aquarium,
    notes: row.notes,
  };
});

When('使用者新增\\/更新換水記錄', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.payload;
  this.dbAssertion = async ({ success }) => {
    const count = await prisma.waterChange.count();
    if (success) {
      assert.equal(count, 1);
      const saved = await prisma.waterChange.findFirst({
        where: {
          date: String(payload?.date ?? ''),
          aquariumId: payload?.aquariumId as number,
        },
      });
      assert.ok(saved);
      assert.equal(saved?.waterAmount, payload?.waterChangeRatio as number);
      assert.equal(saved?.notes, (payload?.notes as string | undefined) ?? null);
    } else {
      assert.equal(count, 0);
    }
  };
  const response = await request(e2eContext.app.getHttpServer())
    .post('/water-changes')
    .send(scenarioContext.payload);
  this.response = { status: response.status, body: response.body };
});
