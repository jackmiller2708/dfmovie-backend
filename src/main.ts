import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: {origin: ['http://localhost:4200']}});
  const config = app.get(ConfigService);
  const port = config.get('port');
  await app.listen(port);
}

bootstrap();
