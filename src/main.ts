import { createServer } from 'net';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

async function findAvailablePort(
  startPort: number,
  maxAttempts = 100,
): Promise<number> {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(
    `No available port in range ${startPort}-${startPort + maxAttempts - 1}`,
  );
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  
  // 啟用 CORS
  app.enableCors({
    origin: true, // 允許所有來源（開發環境）
    credentials: true,
  });
  
  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('AquaCircle API')
    .setDescription('AquaCircle 魚缸管理系統 API 文檔')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const preferredPort = Number(process.env.APP_PORT) || 3000;
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.warn(
      `Port ${preferredPort} is in use, using available port ${port} instead.`,
    );
  }
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger API 文檔: http://localhost:${port}/api`);
}
bootstrap();

