import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = Array.from(
    new Set(
      (process.env['FRONTEND_URL'] ?? 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        .concat('http://127.0.0.1:3000'),
    ),
  );

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  process.on('SIGTERM', () => {
    app
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });
  process.on('SIGINT', () => {
    app
      .close()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });

  await app.listen(process.env['PORT'] ?? 4000);
}
void bootstrap();
