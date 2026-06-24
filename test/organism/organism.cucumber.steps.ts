import { AfterAll, Before, BeforeAll, DataTable, Given, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { E2eContext, createE2eContext } from '../helpers/e2e-app';

interface ScenarioContext {
  payload?: Record<string, unknown>;
  organismIds: Map<string, number>;
}

let e2eContext: E2eContext | null = null;
let prisma: PrismaService;
let scenarioContext: ScenarioContext;

function tableRow(table: DataTable): Record<string, string> {
  return (table.hashes()[0] ?? {}) as Record<string, string>;
}

function normalizeMaybeNumber(value?: string): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return Number(value);
}

async function ensureAquarium(name: string): Promise<number> {
  const found = await prisma.aquarium.findFirst({
    where: { name },
  });
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
  if (!pickle.uri.includes('organism-management/生物管理.feature')) {
    return;
  }
  if (!e2eContext) {
    throw new Error('E2E context not initialized');
  }
  await e2eContext.reset();
  this.response = undefined;
  scenarioContext = {
    organismIds: new Map<string, number>(),
  };
  await ensureAquarium('主缸');
});

AfterAll(async function () {
  if (e2eContext) {
    await e2eContext.close();
  }
});

Given('生物請求資料如下', async function (table: DataTable) {
  const row = tableRow(table);
  const aquariumName = row.aquarium ?? '';
  const aquarium = aquariumName
    ? await prisma.aquarium.findFirst({ where: { name: aquariumName } })
    : null;

  scenarioContext.payload = {
    name: row.name ?? '',
    tag: row.tag ?? '',
    price: normalizeMaybeNumber(row.amount),
    length: normalizeMaybeNumber(row.length),
    aquariumId: aquarium?.id ?? 99999,
  };
});

Given('系統初始生物資料如下', async function (table: DataTable) {
  await prisma.organism.deleteMany();
  for (const row of table.hashes() as Array<Record<string, string>>) {
    if (!row.name) {
      continue;
    }
    const aquariumName = row.aquarium || '主缸';
    const aquariumId = await ensureAquarium(aquariumName);
    const organism = await prisma.organism.create({
      data: {
        name: row.name,
        tag: row.tag || '上層魚',
        price: normalizeMaybeNumber(row.amount),
        length: normalizeMaybeNumber(row.length),
        aquariumId,
      },
    });
    scenarioContext.organismIds.set(organism.name, organism.id);
  }
});

Given('生物更新資料如下', async function (table: DataTable) {
  const row = tableRow(table);
  const aquariumName = row.aquarium || '主缸';
  const aquariumId = await ensureAquarium(aquariumName);
  scenarioContext.payload = {
    name: row.name ?? '',
    tag: row.tag ?? '',
    price: normalizeMaybeNumber(row.amount),
    length: normalizeMaybeNumber(row.length),
    aquariumId,
  };
});

When('使用者新增\\/更新生物', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.payload;
  this.dbAssertion = async ({ success }) => {
    const name = String(payload?.name ?? '');
    const saved = await prisma.organism.findFirst({ where: { name } });
    if (success) {
      assert.ok(saved);
      assert.equal(saved?.tag, String(payload?.tag ?? ''));
      assert.equal(saved?.aquariumId, payload?.aquariumId);
      if (payload?.price !== undefined) {
        assert.equal(saved?.price, payload?.price);
      }
      if (payload?.length !== undefined) {
        assert.equal(saved?.length, payload?.length);
      }
    } else {
      assert.equal(saved, null);
    }
  };
  const response = await request(e2eContext.app.getHttpServer())
    .post('/organisms')
    .send(scenarioContext.payload);
  this.response = { status: response.status, body: response.body };
});

When('使用者更新名稱為「小丑魚」的生物', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.payload;
  this.dbAssertion = async ({ success }) => {
    const saved = await prisma.organism.findFirst({ where: { name: '小丑魚' } });
    if (success) {
      assert.ok(saved);
      assert.equal(saved?.tag, String(payload?.tag ?? ''));
      assert.equal(saved?.aquariumId, payload?.aquariumId);
      if (payload?.price !== undefined) {
        assert.equal(saved?.price, payload?.price);
      }
      if (payload?.length !== undefined) {
        assert.equal(saved?.length, payload?.length);
      }
    } else {
      assert.equal(saved, null);
    }
  };
  const organism = await prisma.organism.findFirst({
    where: { name: '小丑魚' },
  });

  if (!organism) {
    this.response = { status: 404, body: { message: '生物不存在' } };
    return;
  }

  const response = await request(e2eContext.app.getHttpServer())
    .patch(`/organisms/${organism.id}`)
    .send(scenarioContext.payload);
  this.response = { status: response.status, body: response.body };
});
