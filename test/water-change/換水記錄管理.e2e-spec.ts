import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

const feature = loadFeature('spec/features/換水記錄管理.feature');

defineFeature(feature, (test) => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testContext: {
    waterChangeData?: {
      date?: string;
      waterAmount?: number;
      notes?: string;
      aquariumId?: number;
    };
    createdWaterChange?: any;
    errorMessage?: string;
    aquariumId?: number;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.waterChange.deleteMany({});
    await prisma.aquarium.deleteMany({});
    testContext = {};
  });

  afterAll(async () => {
    await prisma.waterChange.deleteMany({});
    await prisma.aquarium.deleteMany({});
    await app.close();
  });

  test('新增/更新換水記錄的日期為「2025-01-01」，成功新增', ({ given, when, then }) => {
    given('使用者輸入換水記錄的日期為「2025-01-01」', async () => {
      // 先建立一個魚缸
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
      testContext.aquariumId = aquarium.id;

      testContext.waterChangeData = {
        date: '2025-01-01',
        waterAmount: 0.5,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新換水記錄', async () => {
      const response = await request(app.getHttpServer())
        .post('/water-changes')
        .send(testContext.waterChangeData);

      if (response.status === 201) {
        testContext.createdWaterChange = response.body;
      } else if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('換水記錄被成功新增/更新', () => {
      expect(testContext.createdWaterChange).toBeDefined();
      expect(testContext.createdWaterChange.id).toBeDefined();
      expect(testContext.createdWaterChange.date).toBe('2025-01-01');
    });
  });

  test('新增/更新換水記錄的日期為空，新增失敗', ({ given, when, then }) => {
    given('使用者輸入換水記錄的日期為空', async () => {
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
      testContext.aquariumId = aquarium.id;

      testContext.waterChangeData = {
        date: '',
        waterAmount: 0.5,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新換水記錄', async () => {
      const response = await request(app.getHttpServer())
        .post('/water-changes')
        .send(testContext.waterChangeData);

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('換水記錄未被新增/更新，系統提示「換水記錄的日期不可為空」', () => {
      expect(testContext.errorMessage).toBe('換水記錄的日期不可為空');
    });
  });

  test('新增/更新換水記錄的換水量為 0.5（1/2），成功新增', ({ given, when, then }) => {
    given('使用者輸入換水記錄的換水量為「0.5」', async () => {
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
      testContext.aquariumId = aquarium.id;

      testContext.waterChangeData = {
        date: '2025-01-01',
        waterAmount: 0.5,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新換水記錄', async () => {
      const response = await request(app.getHttpServer())
        .post('/water-changes')
        .send(testContext.waterChangeData);

      if (response.status === 201) {
        testContext.createdWaterChange = response.body;
      } else if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('換水記錄被成功新增/更新', () => {
      expect(testContext.createdWaterChange).toBeDefined();
      expect(testContext.createdWaterChange.waterAmount).toBe(0.5);
    });
  });

  test('新增/更新換水記錄的換水量為空，新增失敗', ({ given, when, then }) => {
    given('使用者輸入換水記錄的換水量為空', async () => {
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
      testContext.aquariumId = aquarium.id;

      testContext.waterChangeData = {
        date: '2025-01-01',
        waterAmount: undefined as any,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新換水記錄', async () => {
      const response = await request(app.getHttpServer())
        .post('/water-changes')
        .send(testContext.waterChangeData);

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('換水記錄未被新增/更新，系統提示「換水記錄的換水量不可為空」', () => {
      expect(testContext.errorMessage).toBe('換水記錄的換水量不可為空');
    });
  });

  test('新增/更新換水記錄的所屬魚缸為「主缸」，成功新增', ({ given, when, then }) => {
    given('使用者輸入換水記錄的所屬魚缸為「主缸」', async () => {
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
      testContext.aquariumId = aquarium.id;

      testContext.waterChangeData = {
        date: '2025-01-01',
        waterAmount: 0.5,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新換水記錄', async () => {
      const response = await request(app.getHttpServer())
        .post('/water-changes')
        .send(testContext.waterChangeData);

      if (response.status === 201) {
        testContext.createdWaterChange = response.body;
      } else if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('換水記錄被成功新增/更新', () => {
      expect(testContext.createdWaterChange).toBeDefined();
      expect(testContext.createdWaterChange.aquariumId).toBe(testContext.aquariumId);
    });
  });

  test('新增/更新換水記錄的所屬魚缸為空，新增失敗', ({ given, when, then }) => {
    given('使用者輸入換水記錄的所屬魚缸為空', async () => {
      testContext.waterChangeData = {
        date: '2025-01-01',
        waterAmount: 0.5,
        aquariumId: undefined as any,
      };
    });

    when('使用者新增/更新換水記錄', async () => {
      const response = await request(app.getHttpServer())
        .post('/water-changes')
        .send(testContext.waterChangeData);

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('換水記錄未被新增/更新，系統提示「換水記錄的所屬魚缸不可為空」', () => {
      expect(testContext.errorMessage).toBe('換水記錄的所屬魚缸不可為空');
    });
  });
});

