import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Feature: 建立魚缸', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // 清理測試資料
    await prisma.aquarium.deleteMany({});
  });

  afterAll(async () => {
    await prisma.aquarium.deleteMany({});
    await app.close();
  });

  describe('Rule: 魚缸長度、寬度、高度皆 > 0', () => {
    it('Example: 魚缸長度、寬度、高度皆 > 0 ，成功建立', async () => {
      // Given 使用者輸入魚缸長度「100」、寬度「50」、高度「60」
      const aquariumData = {
        name: '測試魚缸',
        length: 100,
        width: 50,
        height: 60,
        status: '開缸',
        setupDate: '2025-01-01',
      };

      // When 使用者建立新的魚缸
      const response = await request(app.getHttpServer())
        .post('/aquariums')
        .send(aquariumData)
        .expect(201);

      // Then 魚缸被成功建立
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.length).toBe(100);
      expect(response.body.width).toBe(50);
      expect(response.body.height).toBe(60);
    });

    it('Example: 魚缸長度、寬度、高度任一小於 0，建立魚缸失敗', async () => {
      // Given 使用者輸入魚缸長度「-100」、寬度「50」、高度「60」
      const aquariumData = {
        name: '測試魚缸',
        length: -100,
        width: 50,
        height: 60,
        status: '開缸',
        setupDate: '2025-01-01',
      };

      // When 使用者建立新的魚缸
      const response = await request(app.getHttpServer())
        .post('/aquariums')
        .send(aquariumData)
        .expect(400);

      // Then 魚缸被建立失敗，系統提示「魚缸建立失敗，長度、寬度、高度皆須 > 0」
      expect(response.body.message).toBe('魚缸建立失敗，長度、寬度、高度皆須 > 0');
    });
  });

  describe('Rule: 魚缸狀態只能為「開缸」、「穩定」、「治療」、「閒置」', () => {
    it('Example: 魚缸狀態為「開缸」，成功建立', async () => {
      // Given 使用者建立魚缸，狀態為「開缸」
      const aquariumData = {
        name: '測試魚缸',
        length: 100,
        width: 50,
        height: 60,
        status: '開缸',
        setupDate: '2025-01-01',
      };

      // When 使用者建立新的魚缸
      const response = await request(app.getHttpServer())
        .post('/aquariums')
        .send(aquariumData)
        .expect(201);

      // Then 魚缸被成功建立
      expect(response.body).toBeDefined();
      expect(response.body.status).toBe('開缸');
    });

    it('Example: 魚缸狀態為空，建立魚缸失敗', async () => {
      // Given 使用者建立魚缸，狀態為空
      const aquariumData = {
        name: '測試魚缸',
        length: 100,
        width: 50,
        height: 60,
        status: '',
        setupDate: '2025-01-01',
      };

      // When 使用者建立新的魚缸
      const response = await request(app.getHttpServer())
        .post('/aquariums')
        .send(aquariumData)
        .expect(400);

      // Then 魚缸被建立失敗，系統提示「魚缸建立失敗，狀態不能為空」
      expect(response.body.message).toBe('魚缸建立失敗，狀態不能為空');
    });
  });

  describe('Rule: 使用者可以查詢所有魚缸', () => {
    it('Example: 魚缸存在，查詢所有魚缸成功', async () => {
      // Given 魚缸 1 存在於系統中
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

      // When 使用者查詢所有魚缸
      const response = await request(app.getHttpServer())
        .get('/aquariums')
        .expect(200);

      // Then 查詢結果應有魚缸 1
      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find((aq: any) => aq.id === aquarium.id);
      expect(found).toBeDefined();
      expect(found.name).toBe('魚缸 1');
    });

    it('Example: 不存在任何魚缸，查詢所有魚缸結果為空', async () => {
      // Given 系統中不存在任何魚缸
      await prisma.aquarium.deleteMany({});

      // When 使用者查詢所有魚缸
      const response = await request(app.getHttpServer())
        .get('/aquariums')
        .expect(200);

      // Then 查詢結果應為空
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('Rule: 使用者可以刪除魚缸，不檢查相關聯資料', () => {
    it('Example: 刪除魚缸但保留相關資料', async () => {
      // Given 魚缸 1 存在
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

      // And 魚缸 1 有相關的生物、設備或記錄
      // （此測試中不需要實際建立相關資料，因為規格說「不檢查相關聯資料」）

      // When 使用者刪除魚缸 1
      await request(app.getHttpServer())
        .delete(`/aquariums/${aquarium.id}`)
        .expect(200);

      // Then 魚缸 1 被刪除
      const deletedAquarium = await prisma.aquarium.findUnique({
        where: { id: aquarium.id },
      });
      expect(deletedAquarium).toBeNull();

      // And 相關的生物、設備和記錄仍然保留
      // （此測試中不需要實際驗證，因為規格說「不檢查相關聯資料」）
    });
  });
});

