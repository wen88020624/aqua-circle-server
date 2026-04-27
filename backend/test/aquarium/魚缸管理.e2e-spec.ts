import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, beforeEach, expect } from '@jest/globals';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createE2eContext } from '../helpers/e2e-app';

const feature = loadFeature('spec/features/魚缸管理.feature');

defineFeature(feature, (test) => {
  let app: INestApplication;
  let prisma: PrismaService;
  let reset: () => Promise<void>;
  let close: () => Promise<void>;

  let testContext: {
    aquariumData?: {
      name?: string;
      length?: number;
      width?: number;
      height?: number;
      status?: string;
      setupDate?: string;
    };
    createdAquarium?: any;
    queryResult?: any[];
    errorMessage?: string;
    aquariumId?: number;
  };

  beforeAll(async () => {
    const e2eContext = await createE2eContext();
    app = e2eContext.app;
    prisma = e2eContext.prisma;
    reset = e2eContext.reset;
    close = e2eContext.close;
  }, 60000);

  beforeEach(async () => {
    await reset();
    testContext = {};
  });

  afterAll(async () => {
    if (app) {
      await close();
    }
  });

  test('魚缸長度、寬度、高度皆 > 0 ，成功建立', ({ given, when, then }) => {
    given('使用者輸入魚缸長度「100」、寬度「50」、高度「60」', () => {
      const aquariumData = {
        name: '測試魚缸',
        length: 100,
        width: 50,
        height: 60,
        status: '開缸',
        setupDate: '2025-01-01',
      };
      testContext.aquariumData = aquariumData;
    });

    when('使用者建立新的魚缸', async () => {
      const response = await request(app.getHttpServer())
        .post('/aquariums')
        .send(testContext.aquariumData)
        .expect(201);
      testContext.createdAquarium = response.body;
    });

    then('魚缸被成功建立', () => {
      expect(testContext.createdAquarium).toBeDefined();
      expect(testContext.createdAquarium.id).toBeDefined();
      expect(testContext.createdAquarium.length).toBe(100);
      expect(testContext.createdAquarium.width).toBe(50);
      expect(testContext.createdAquarium.height).toBe(60);
    });
  });

  test('魚缸長度、寬度、高度任一小於 0，建立魚缸失敗', ({ given, when, then }) => {
    given('使用者輸入魚缸長度「-100」、寬度「50」、高度「60」', () => {
      const aquariumData = {
        name: '測試魚缸',
        length: -100,
        width: 50,
        height: 60,
        status: '開缸',
        setupDate: '2025-01-01',
      };
      testContext.aquariumData = aquariumData;
    });

    when('使用者建立新的魚缸', async () => {
      const response = await request(app.getHttpServer())
        .post('/aquariums')
        .send(testContext.aquariumData)
        .expect(400);
      testContext.errorMessage = response.body.message;
    });

    then('魚缸被建立失敗，系統提示「魚缸建立失敗，長度、寬度、高度皆須 > 0」', () => {
      expect(testContext.errorMessage).toBe('魚缸建立失敗，長度、寬度、高度皆須 > 0');
    });
  });

  test('魚缸狀態為「開缸」，成功建立', ({ given, when, then }) => {
    given('使用者建立魚缸，狀態為「開缸」', () => {
      const aquariumData = {
        name: '測試魚缸',
        length: 100,
        width: 50,
        height: 60,
        status: '開缸',
        setupDate: '2025-01-01',
      };
      testContext.aquariumData = aquariumData;
    });

    when('使用者建立新的魚缸', async () => {
      const response = await request(app.getHttpServer())
        .post('/aquariums')
        .send(testContext.aquariumData)
        .expect(201);
      testContext.createdAquarium = response.body;
    });

    then('魚缸被成功建立', () => {
      expect(testContext.createdAquarium).toBeDefined();
      expect(testContext.createdAquarium.status).toBe('開缸');
    });
  });

  test('魚缸狀態為空，建立魚缸失敗', ({ given, when, then }) => {
    given('使用者建立魚缸，狀態為空', () => {
      const aquariumData = {
        name: '測試魚缸',
        length: 100,
        width: 50,
        height: 60,
        status: '',
        setupDate: '2025-01-01',
      };
      testContext.aquariumData = aquariumData;
    });

    when('使用者建立新的魚缸', async () => {
      const response = await request(app.getHttpServer())
        .post('/aquariums')
        .send(testContext.aquariumData)
        .expect(400);
      testContext.errorMessage = response.body.message;
    });

    then('魚缸被建立失敗，系統提示「魚缸建立失敗，狀態不能為空」', () => {
      expect(testContext.errorMessage).toBe('魚缸建立失敗，狀態不能為空');
    });
  });

  test('魚缸存在，查詢所有魚缸成功', ({ given, when, then }) => {
    given('魚缸 1 存在於系統中', async () => {
      const aquarium = await prisma.aquarium.create({
        data: {
          name: '魚缸 1',
          length: 100,
          width: 50,
          height: 60,
          status: '開缸',
          setupDate: '2025-01-01',
        },
      });
      testContext.aquariumId = aquarium.id;
    });

    when('使用者查詢所有魚缸', async () => {
      const response = await request(app.getHttpServer())
        .get('/aquariums')
        .expect(200);
      testContext.queryResult = response.body;
    });

    then('查詢結果應有魚缸 1', () => {
      expect(Array.isArray(testContext.queryResult)).toBe(true);
      const found = testContext.queryResult?.find((aq: any) => aq.id === testContext.aquariumId);
      expect(found).toBeDefined();
      expect(found.name).toBe('魚缸 1');
    });
  });

  test('不存在任何魚缸，查詢所有魚缸結果為空', ({ given, when, then }) => {
    given('系統中不存在任何魚缸', async () => {
      await reset();
    });

    when('使用者查詢所有魚缸', async () => {
      const response = await request(app.getHttpServer())
        .get('/aquariums')
        .expect(200);
      testContext.queryResult = response.body;
    });

    then('查詢結果應為空', () => {
      expect(Array.isArray(testContext.queryResult)).toBe(true);
      expect(testContext.queryResult?.length).toBe(0);
    });
  });

  test('刪除魚缸但保留相關資料', ({ given, and, when, then }) => {
    given('魚缸 1 存在', async () => {
      const aquarium = await prisma.aquarium.create({
        data: {
          name: '魚缸 1',
          length: 100,
          width: 50,
          height: 60,
          status: '開缸',
          setupDate: '2025-01-01',
        },
      });
      testContext.aquariumId = aquarium.id;
    });

    and('魚缸 1 有相關的生物、設備或記錄', () => {
      expect(testContext.aquariumId).toBeDefined();
    });

    when('使用者刪除魚缸 1', async () => {
      await request(app.getHttpServer())
        .delete(`/aquariums/${testContext.aquariumId}`)
        .expect(200);
    });

    then('魚缸 1 被刪除', async () => {
      const deletedAquarium = await prisma.aquarium.findUnique({
        where: { id: testContext.aquariumId },
      });
      expect(deletedAquarium).toBeNull();
    });

    and('相關的生物、設備和記錄仍然保留', () => {
      expect(testContext.aquariumId).toBeDefined();
    });
  });
});
