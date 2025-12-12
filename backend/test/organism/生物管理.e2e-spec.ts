import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

const feature = loadFeature('spec/features/生物管理.feature');

defineFeature(feature, (test) => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testContext: {
    organismData?: any;
    createdOrganism?: any;
    errorMessage?: string;
    aquariumId?: number;
    organismId?: number;
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
    await prisma.organism.deleteMany({});
    await prisma.aquarium.deleteMany({});
    testContext = {};
  });

  afterAll(async () => {
    await prisma.organism.deleteMany({});
    await prisma.aquarium.deleteMany({});
    await app.close();
  });

  test('新增/更新生物的名稱為「小丑魚」，成功新增', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為「小丑魚」', async () => {
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

      testContext.organismData = {
        name: '小丑魚',
        tag: '上層魚',
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status === 201) {
        testContext.createdOrganism = response.body;
      } else if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物被成功新增/更新', () => {
      expect(testContext.createdOrganism).toBeDefined();
      expect(testContext.createdOrganism.name).toBe('小丑魚');
    });
  });

  test('新增/更新生物的名稱為空，新增失敗', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為空', async () => {
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

      testContext.organismData = {
        name: '',
        tag: '上層魚',
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物未被新增/更新，系統提示「生物的名稱不可為空」', () => {
      expect(testContext.errorMessage).toBe('生物的名稱不可為空');
    });
  });

  test('新增/更新生物的tag為「上層魚」，成功新增', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為「小丑魚」，tag為「上層魚」', async () => {
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

      testContext.organismData = {
        name: '小丑魚',
        tag: '上層魚',
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status === 201) {
        testContext.createdOrganism = response.body;
      } else if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物被成功新增/更新', () => {
      expect(testContext.createdOrganism).toBeDefined();
      expect(testContext.createdOrganism.tag).toBe('上層魚');
    });
  });

  test('新增/更新生物的tag為空，新增失敗', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為「小丑魚」，tag為空', async () => {
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

      testContext.organismData = {
        name: '小丑魚',
        tag: '',
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物未被新增/更新，系統提示「生物的tag不可為空」', () => {
      expect(testContext.errorMessage).toBe('生物的tag不可為空');
    });
  });

  test('新增/更新生物的金額 >= 0，成功新增', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為「小丑魚」，金額「100」', async () => {
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

      testContext.organismData = {
        name: '小丑魚',
        tag: '上層魚',
        price: 100,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status === 201) {
        testContext.createdOrganism = response.body;
      } else if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物被成功新增/更新', () => {
      expect(testContext.createdOrganism).toBeDefined();
      expect(testContext.createdOrganism.price).toBe(100);
    });
  });

  test('新增/更新生物的金額 < 0，新增失敗', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為「小丑魚」，金額「-100」', async () => {
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

      testContext.organismData = {
        name: '小丑魚',
        tag: '上層魚',
        price: -100,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物未被新增/更新，系統提示「生物的金額必須 >= 0」', () => {
      expect(testContext.errorMessage).toBe('生物的金額必須 >= 0');
    });
  });

  test('新增/更新生物時，所屬魚缸存在於系統中，成功新增', ({ given, when, then }) => {
    given('魚缸「主缸」存在於系統中', async () => {
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
    });

    given('使用者輸入生物的名稱為「小丑魚」，所屬魚缸為「主缸」', () => {
      testContext.organismData = {
        name: '小丑魚',
        tag: '上層魚',
        aquariumId: testContext.aquariumId,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status === 201) {
        testContext.createdOrganism = response.body;
      } else if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物被成功新增/更新', () => {
      expect(testContext.createdOrganism).toBeDefined();
      expect(testContext.createdOrganism.aquariumId).toBe(testContext.aquariumId);
    });
  });

  test('新增/更新生物時，所屬魚缸不存在於系統中，新增失敗', ({ given, when, then }) => {
    given('魚缸「主缸」不存在於系統中', () => {
      // 不創建魚缸
    });

    given('使用者輸入生物的名稱為「小丑魚」，所屬魚缸為「主缸」', () => {
      testContext.organismData = {
        name: '小丑魚',
        tag: '上層魚',
        aquariumId: 99999, // 不存在的ID
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物未被新增/更新，系統提示「所屬魚缸不存在於系統中」', () => {
      expect(testContext.errorMessage).toBe('所屬魚缸不存在於系統中');
    });
  });

  test('新增/更新生物的長度 >= 0，成功新增', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為「小丑魚」，長度「100」', async () => {
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

      testContext.organismData = {
        name: '小丑魚',
        tag: '上層魚',
        length: 100,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status === 201) {
        testContext.createdOrganism = response.body;
      } else if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物被成功新增/更新', () => {
      expect(testContext.createdOrganism).toBeDefined();
      expect(testContext.createdOrganism.length).toBe(100);
    });
  });

  test('新增/更新生物的長度 < 0，新增失敗', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為「小丑魚」，長度「-100」', async () => {
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

      testContext.organismData = {
        name: '小丑魚',
        tag: '上層魚',
        length: -100,
        aquariumId: aquarium.id,
      };
    });

    when('使用者新增/更新生物', async () => {
      const response = await request(app.getHttpServer())
        .post('/organisms')
        .send(testContext.organismData);

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物未被新增/更新，系統提示「生物的長度必須 >= 0」', () => {
      expect(testContext.errorMessage).toBe('生物的長度必須 >= 0');
    });
  });

  test('更新生物，生物不存在於系統中，更新失敗', ({ when, then }) => {
    when('使用者更新不存在的生物', async () => {
      const response = await request(app.getHttpServer())
        .patch('/organisms/99999')
        .send({ name: '小丑魚', tag: '上層魚' });

      if (response.status >= 400) {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物未被更新，系統提示「生物不存在」', () => {
      expect(testContext.errorMessage).toBe('生物不存在');
    });
  });

  test('更新生物，生物存在，更新成功', ({ given, when, then }) => {
    given('使用者輸入生物的名稱為「小丑魚」，長度「100」', async () => {
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

      const organism = await prisma.organism.create({
        data: {
          name: '小丑魚',
          tag: '上層魚',
          aquariumId: aquarium.id,
        },
      });
      testContext.organismId = organism.id;

      testContext.organismData = {
        length: 100,
      };
    });

    when('使用者更新生物', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/organisms/${testContext.organismId}`)
        .send(testContext.organismData);

      if (response.status === 200) {
        testContext.createdOrganism = response.body;
      } else {
        testContext.errorMessage = response.body.message;
      }
    });

    then('生物被成功更新，生物的長度為「100」', () => {
      expect(testContext.createdOrganism).toBeDefined();
      expect(testContext.createdOrganism.length).toBe(100);
    });
  });
});

