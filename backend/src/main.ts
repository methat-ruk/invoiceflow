import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = (
    process.env['CORS_ORIGIN'] ??
    process.env['FRONTEND_URL'] ??
    'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.setGlobalPrefix('api');

  const corsOrigin: CustomOrigin = (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin) || origin === 'http://127.0.0.1:3000') {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  };

  app.enableCors({
    origin: corsOrigin,
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
