import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, beforeEach } from '@jest/globals';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createE2eContext } from '../helpers/e2e-app';
import { registerAquariumSteps } from './aquarium.steps';

const feature = loadFeature('spec/features/魚缸管理.feature');

defineFeature(feature, (test) => {
  let app: INestApplication;
  let prisma: PrismaService;
  let reset: () => Promise<void>;
  let close: () => Promise<void>;

  let testContext: {
    createPayload?: Record<string, unknown>;
    response?: {
      status: number;
      body: any;
    };
    queryResult?: any[];
    aquariumsByName: Map<string, number>;
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
    testContext = {
      aquariumsByName: new Map<string, number>(),
    };
  });

  afterAll(async () => {
    if (app) {
      await close();
    }
  });

  registerAquariumSteps(
    test,
    () => ({ app, prisma }),
    () => testContext,
  );
});
