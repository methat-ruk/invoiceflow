import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:3000';

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = new Set([frontendUrl, 'http://127.0.0.1:3000']);
      const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (allowedOrigins.has(origin) || isVercelPreview) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
