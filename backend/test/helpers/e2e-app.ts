import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { noOpSeed, resetDatabase, SeedHook, startTestDatabase, stopTestDatabase } from './test-db';

export interface E2eContext {
  app: INestApplication;
  prisma: PrismaService;
  reset: () => Promise<void>;
  close: () => Promise<void>;
}

export async function createE2eContext(seedHook: SeedHook = noOpSeed): Promise<E2eContext> {
  await startTestDatabase();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const prisma = moduleFixture.get<PrismaService>(PrismaService);
  await app.init();

  const reset = async () => {
    await resetDatabase(prisma, seedHook);
  };

  await reset();

  return {
    app,
    prisma,
    reset,
    close: async () => {
      await app.close();
      // await stopTestDatabase();
    },
  };
}
