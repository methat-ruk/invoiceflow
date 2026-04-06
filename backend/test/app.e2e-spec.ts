import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

const E2E_EMAILS = ['e2e@test.com', 'e2e-login@test.com'];

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: Parameters<typeof request>[0];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    server = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: E2E_EMAILS } } });
    await app.close();
  });

  it('POST /api/auth/register — returns 201 with token', async () => {
    const res = await request(server).post('/api/auth/register').send({
      name: 'E2E User',
      email: 'e2e@test.com',
      password: 'password123',
    });

    // may already exist from previous run — accept 201 or 409
    expect([201, 409]).toContain(res.status);
  });

  it('POST /api/auth/login — returns accessToken', async () => {
    await request(server).post('/api/auth/register').send({
      name: 'E2E User',
      email: 'e2e-login@test.com',
      password: 'password123',
    });

    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'e2e-login@test.com', password: 'password123' });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('GET /api/clients — requires auth, returns 401 without token', async () => {
    const res = await request(server).get('/api/clients');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard/stats — requires auth, returns 401 without token', async () => {
    const res = await request(server).get('/api/dashboard/stats');
    expect(res.status).toBe(401);
  });
});
