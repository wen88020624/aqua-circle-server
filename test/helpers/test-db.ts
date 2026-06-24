import { execSync } from 'node:child_process';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaService } from '../../src/prisma/prisma.service';

let postgresContainer: StartedPostgreSqlContainer | null = null;
let isMigrated = false;

export type SeedHook = (prisma: PrismaService) => Promise<void>;

function shouldKeepTestDatabase(): boolean {
  const value = process.env.E2E_KEEP_DB?.trim().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

export async function startTestDatabase(): Promise<void> {
  if (postgresContainer) {
    return;
  }

  postgresContainer = await new PostgreSqlContainer('postgres:16-alpine')
    .withName('aqua_testcontainers')
    .withDatabase('aquacircle_test')
    .withUsername('postgres')
    .withPassword('postgres')
    .start();

  process.env.DATABASE_URL = postgresContainer.getConnectionUri();
  console.log(`[Testcontainers] PostgreSQL connection URI: ${process.env.DATABASE_URL}`);

  if (!isMigrated) {
    execSync('npx prisma migrate deploy', {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });
    isMigrated = true;
  }
}

export async function stopTestDatabase(): Promise<void> {
  if (!postgresContainer) {
    return;
  }

  if (shouldKeepTestDatabase()) {
    console.log('[Testcontainers] E2E_KEEP_DB=true, skip stopping test database container.');
    return;
  }

  await postgresContainer.stop();
  postgresContainer = null;
  isMigrated = false;
}

export async function resetDatabase(prisma: PrismaService, seedHook?: SeedHook): Promise<void> {
  const tables = await prisma.$queryRawUnsafe<Array<{ tablename: string }>>(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN ('_prisma_migrations');
  `);

  if (tables.length > 0) {
    const tableList = tables.map(({ tablename }) => `"${tablename}"`).join(', ');
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`);
  }

  if (seedHook) {
    await seedHook(prisma);
  }
}

export async function noOpSeed(): Promise<void> {
  return Promise.resolve();
}
