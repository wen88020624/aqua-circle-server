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
  createPayload?: Record<string, unknown>;
  updatePayload?: Record<string, unknown>;
  equipmentIds: Map<string, number>;
  queryResult?: any[];
}

let e2eContext: E2eContext | null = null;
let prisma: PrismaService;
let scenarioContext: ScenarioContext;

function toRecord(table: DataTable): Record<string, string> {
  return (table.hashes()[0] ?? {}) as Record<string, string>;
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
  if (!pickle.uri.includes('resource-management/設備管理.feature')) {
    return;
  }
  await e2eContext!.reset();
  this.response = undefined;
  scenarioContext = {
    equipmentIds: new Map<string, number>(),
  };
  await ensureAquarium('主缸');
});

AfterAll(async function () {
  if (e2eContext) {
    await e2eContext.close();
  }
});

Given('設備請求資料如下', async function (table: DataTable) {
  const row = toRecord(table);
  const aquariumId = await ensureAquarium(row.aquarium || '主缸');
  scenarioContext.createPayload = {
    name: row.name ?? '',
    tag: row.tag ?? '',
    status: row.status ?? '',
    price: row.amount === undefined ? undefined : Number(row.amount),
    aquariumId,
  };
});

Given('系統初始設備資料如下', async function (table: DataTable) {
  await prisma.equipment.deleteMany();
  scenarioContext.equipmentIds.clear();

  const aquariumId = await ensureAquarium('主缸');
  const rows = table.hashes() as Array<Record<string, string>>;
  let nextId = 1;
  for (const row of rows) {
    if (!row.name) {
      continue;
    }
    const created = await prisma.equipment.create({
      data: {
        id: nextId++,
        name: row.name,
        tag: row.tag,
        status: row.status,
        price: Number(row.amount),
        aquariumId,
      },
    });
    scenarioContext.equipmentIds.set(created.name, created.id);
  }
});

Given('設備更新資料如下', async function (table: DataTable) {
  const row = toRecord(table);
  const aquariumId = await ensureAquarium(row.aquarium || '主缸');
  scenarioContext.updatePayload = {
    name: row.name ?? '',
    tag: row.tag ?? '',
    status: row.status ?? '',
    price: Number(row.amount),
    aquariumId,
  };
});

When('使用者新增\\/更新設備', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.createPayload!;

  this.dbAssertion = async ({ success }) => {
    const saved = await prisma.equipment.findFirst({ where: { name: String(payload.name ?? '') } });
    if (success) {
      assert.ok(saved);
      assert.equal(saved?.tag, String(payload.tag ?? ''));
      assert.equal(saved?.status, String(payload.status ?? ''));
      assert.equal(saved?.price, payload.price ?? null);
      assert.equal(saved?.aquariumId, payload.aquariumId);
    } else {
      assert.equal(saved, null);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .post('/equipments')
    .send(payload);
  this.response = { status: response.status, body: response.body };
});

When('使用者更新名稱為「燈具」的設備', async function () {
  assert.ok(e2eContext);
  const payload = scenarioContext.updatePayload!;
  const targetId = scenarioContext.equipmentIds.get('燈具') ?? 1;

  this.dbAssertion = async ({ success }) => {
    const saved = await prisma.equipment.findUnique({ where: { id: targetId } });
    if (success) {
      assert.ok(saved);
      assert.equal(saved?.name, String(payload.name ?? ''));
      assert.equal(saved?.tag, String(payload.tag ?? ''));
      assert.equal(saved?.status, String(payload.status ?? ''));
      assert.equal(saved?.price, payload.price ?? null);
      assert.equal(saved?.aquariumId, payload.aquariumId);
    } else {
      assert.equal(saved, null);
    }
  };

  const response = await request(e2eContext.app.getHttpServer())
    .patch(`/equipments/${targetId}`)
    .send(payload);
  this.response = { status: response.status, body: response.body };
});

