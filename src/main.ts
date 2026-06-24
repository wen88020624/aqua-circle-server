import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  
  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger API 文檔: http://localhost:${port}/api`);
}
bootstrap();

