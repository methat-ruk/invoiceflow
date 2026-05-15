import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = new Set(
    (
      process.env['CORS_ORIGIN'] ??
      process.env['FRONTEND_URL'] ??
      'http://localhost:3000'
    )
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

  allowedOrigins.add('http://127.0.0.1:3000');
  allowedOrigins.add('https://invoiceflow-liart.vercel.app');
  allowedOrigins.add(
    'https://invoiceflow-3ywn0efhv-methat-rukchart-s-projects.vercel.app',
  );

  const allowedOriginPatterns = [
    /^https:\/\/invoiceflow-[a-z0-9-]+-methat-rukchart-s-projects\.vercel\.app$/,
  ];

  app.setGlobalPrefix('api');

  const corsOrigin: CustomOrigin = (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowed =
      allowedOrigins.has(origin) ||
      allowedOriginPatterns.some((pattern) => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
      return;
    }

    callback(null, false);
  };

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
    preflightContinue: false,
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
