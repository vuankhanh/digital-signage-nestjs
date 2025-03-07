import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const staticPath = configService.get('folder.album');

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useStaticAssets(staticPath, {
    prefix: '/static/',
  });
  
  const port = AppModule.port || 3003;
  console.log(`App is running on port ${port}`);
  await app.listen(port);
}
bootstrap();