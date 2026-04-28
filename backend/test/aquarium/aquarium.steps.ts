import { INestApplication } from '@nestjs/common';
import { expect } from '@jest/globals';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';

interface AquariumStepDeps {
  app: INestApplication;
  prisma: PrismaService;
}

interface ScenarioContext {
  createPayload?: Record<string, unknown>;
  response?: {
    status: number;
    body: any;
  };
  queryResult?: any[];
  aquariumsByName: Map<string, number>;
}

function toRecord(table: any): Record<string, string> {
  if (Array.isArray(table)) {
    return table[0] ?? {};
  }
  return {};
}

function toRecords(table: any): Array<Record<string, string>> {
  if (Array.isArray(table)) {
    return table;
  }
  return [];
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

function assignCreatePayloadFromTable(context: ScenarioContext, table: any): void {
  const row = toRecord(table);
  context.createPayload = {
    name: row.name,
    length: asNumber(row.length),
    width: asNumber(row.width),
    height: asNumber(row.height),
    status: row.status ?? '',
    setupDate: row.setupDate,
    notes: asMaybeString(row.notes),
  };
}

async function postCreateAquarium(deps: AquariumStepDeps, context: ScenarioContext): Promise<void> {
  const response = await request(deps.app.getHttpServer()).post('/aquariums').send(context.createPayload);
  context.response = { status: response.status, body: response.body };
}

function assertHttpResponse(context: ScenarioContext, table: any): void {
  const row = toRecord(table);
  expect(context.response?.status).toBe(Number(row.statusCode));
  if (row.message !== undefined) {
    expect(context.response?.body?.message).toBe(row.message);
  }
}

export function registerAquariumSteps(
  test: any,
  getDeps: () => AquariumStepDeps,
  getContext: () => ScenarioContext,
): void {
  test('魚缸長度、寬度、高度皆 > 0，成功建立', (steps: any) => {
    const { given, when, then, and } = steps;
    given('建立魚缸請求資料如下', (table: any) => {
      assignCreatePayloadFromTable(getContext(), table);
    });

    when('使用者建立新的魚缸', async () => {
      await postCreateAquarium(getDeps(), getContext());
    });

    then('HTTP 回應應為', (table: any) => {
      assertHttpResponse(getContext(), table);
    });

    and('資料庫中的魚缸資料應為', async (table: any) => {
      const row = toRecord(table);
      const saved = await getDeps().prisma.aquarium.findFirst({
        where: { name: row.name },
      });
      expect(saved).toBeTruthy();
      expect(saved?.length).toBe(Number(row.length));
      expect(saved?.width).toBe(Number(row.width));
      expect(saved?.height).toBe(Number(row.height));
      expect(saved?.status).toBe(row.status);
      expect(saved?.setupDate).toBe(row.setupDate);
    });
  });

  test('必填欄位與數值不合法時，建立魚缸失敗', (steps: any) => {
    const { given, when, then, and } = steps;
    given('建立魚缸請求資料如下', (table: any) => {
      assignCreatePayloadFromTable(getContext(), table);
    });

    when('使用者建立新的魚缸', async () => {
      await postCreateAquarium(getDeps(), getContext());
    });

    then('HTTP 回應應為', (table: any) => {
      assertHttpResponse(getContext(), table);
    });

    and(/^資料庫中應不存在名稱為「(.+)」的魚缸$/, async (name: string) => {
      const found = await getDeps().prisma.aquarium.findFirst({
        where: { name },
      });
      expect(found).toBeNull();
    });
  });

  test('魚缸存在，查詢所有魚缸成功', (steps: any) => {
    const { given, when, then, and } = steps;
    given('系統初始魚缸資料如下', async (table: any) => {
      const rows = toRecords(table);
      for (const row of rows) {
        const aquarium = await getDeps().prisma.aquarium.create({
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
        getContext().aquariumsByName.set(aquarium.name, aquarium.id);
      }
    });

    when('使用者查詢所有魚缸', async () => {
      const response = await request(getDeps().app.getHttpServer()).get('/aquariums');
      getContext().response = { status: response.status, body: response.body };
      getContext().queryResult = response.body;
    });

    then('HTTP 回應應為', (table: any) => {
      assertHttpResponse(getContext(), table);
    });

    and('查詢結果應包含魚缸', (table: any) => {
      const row = toRecord(table);
      const found = getContext().queryResult?.find((item) => item.name === row.name);
      expect(found).toBeTruthy();
      expect(found?.length).toBe(Number(row.length));
      expect(found?.width).toBe(Number(row.width));
      expect(found?.height).toBe(Number(row.height));
      expect(found?.status).toBe(row.status);
    });
  });

  test('不存在任何魚缸，查詢所有魚缸結果為空', (steps: any) => {
    const { given, when, then, and } = steps;
    given('系統中不存在任何魚缸', async () => {
      await getDeps().prisma.aquarium.deleteMany();
    });

    when('使用者查詢所有魚缸', async () => {
      const response = await request(getDeps().app.getHttpServer()).get('/aquariums');
      getContext().response = { status: response.status, body: response.body };
      getContext().queryResult = response.body;
    });

    then('HTTP 回應應為', (table: any) => {
      assertHttpResponse(getContext(), table);
    });

    and('查詢結果應為空陣列', () => {
      expect(Array.isArray(getContext().queryResult)).toBe(true);
      expect(getContext().queryResult).toHaveLength(0);
    });
  });

  test('刪除魚缸但保留相關資料', (steps: any) => {
    const { given, and, when, then } = steps;
    given('系統初始魚缸資料如下', async (table: any) => {
      const row = toRecord(table);
      const aquarium = await getDeps().prisma.aquarium.create({
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
      getContext().aquariumsByName.set(aquarium.name, aquarium.id);
    });

    and('魚缸「魚缸 1」有以下關聯資料', async (table: any) => {
      const aquariumId = getContext().aquariumsByName.get('魚缸 1');
      expect(aquariumId).toBeDefined();
      const rows = toRecords(table);
      for (const row of rows) {
        if (row.relationType === 'organism') {
          await getDeps().prisma.organism.create({
            data: {
              name: row.name,
              tag: row.tag,
              aquariumId: aquariumId!,
            },
          });
        }
        if (row.relationType === 'equipment') {
          await getDeps().prisma.equipment.create({
            data: {
              name: row.name,
              tag: row.tag,
              status: '使用中',
              aquariumId,
            },
          });
        }
        if (row.relationType === 'waterChange') {
          await getDeps().prisma.waterChange.create({
            data: {
              date: row.date,
              waterAmount: 0.5,
              aquariumId: aquariumId!,
            },
          });
        }
      }
    });

    when('使用者刪除名稱為「魚缸 1」的魚缸', async () => {
      const aquariumId = getContext().aquariumsByName.get('魚缸 1');
      expect(aquariumId).toBeDefined();
      const response = await request(getDeps().app.getHttpServer()).delete(`/aquariums/${aquariumId}`);
      getContext().response = { status: response.status, body: response.body };
    });

    then('HTTP 回應應為', (table: any) => {
      assertHttpResponse(getContext(), table);
    });

    and('資料庫中應不存在名稱為「魚缸 1」的魚缸', async () => {
      const deleted = await getDeps().prisma.aquarium.findFirst({
        where: { name: '魚缸 1' },
      });
      expect(deleted).toBeNull();
    });

    and('關聯資料應保留如下', async (table: any) => {
      const rows = toRecords(table);
      for (const row of rows) {
        const expectedCount = Number(row.expectedCount);
        if (row.relationType === 'organism') {
          const count = await getDeps().prisma.organism.count({
            where: { name: '小丑魚' },
          });
          expect(count).toBe(expectedCount);
        }
        if (row.relationType === 'equipment') {
          const count = await getDeps().prisma.equipment.count({
            where: { name: '圓筒過濾器' },
          });
          expect(count).toBe(expectedCount);
        }
        if (row.relationType === 'waterChange') {
          const count = await getDeps().prisma.waterChange.count({
            where: { date: '2025-01-02' },
          });
          expect(count).toBe(expectedCount);
        }
      }
    });
  });
}

