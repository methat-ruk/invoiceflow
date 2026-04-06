import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('ClientsService (integration)', () => {
  let module: TestingModule;
  let service: ClientsService;
  let prisma: PrismaService;
  let testUserId: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
      providers: [ClientsService],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get<PrismaService>(PrismaService);

    const user = await prisma.user.create({
      data: {
        email: 'test-clients@test.com',
        password: 'hashed',
        name: 'Test User',
      },
    });
    testUserId = user.id;
  });

  afterEach(async () => {
    await prisma.client.deleteMany({ where: { userId: testUserId } });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: testUserId } });
    await module.close();
  });

  it('create — saves client to db', async () => {
    const client = await service.create(testUserId, {
      name: 'Acme Corp',
      email: 'acme@example.com',
      phone: '081-000-0000',
    });
    expect(client.name).toBe('Acme Corp');
    expect(client.email).toBe('acme@example.com');
    expect(client.userId).toBe(testUserId);
  });

  it('findAll — returns only own clients', async () => {
    await service.create(testUserId, {
      name: 'Client A',
      email: 'a@example.com',
    });
    await service.create(testUserId, {
      name: 'Client B',
      email: 'b@example.com',
    });

    const clients = await service.findAll(testUserId);
    expect(clients).toHaveLength(2);
    expect(clients.every((c) => c.userId === testUserId)).toBe(true);
  });

  it('findOne — returns correct client', async () => {
    const created = await service.create(testUserId, {
      name: 'Find Me',
      email: 'find@example.com',
    });
    const found = await service.findOne(created.id, testUserId);
    expect(found.id).toBe(created.id);
  });

  it('findOne — throws NotFoundException for wrong userId', async () => {
    const created = await service.create(testUserId, {
      name: 'Mine',
      email: 'mine@example.com',
    });
    await expect(service.findOne(created.id, 'other-user-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update — changes fields', async () => {
    const created = await service.create(testUserId, {
      name: 'Old Name',
      email: 'old@example.com',
    });
    const updated = await service.update(created.id, testUserId, {
      name: 'New Name',
    });
    expect(updated.name).toBe('New Name');
    expect(updated.email).toBe('old@example.com');
  });

  it('remove — deletes client from db', async () => {
    const created = await service.create(testUserId, {
      name: 'To Delete',
      email: 'del@example.com',
    });
    await service.remove(created.id, testUserId);
    const clients = await service.findAll(testUserId);
    expect(clients.find((c) => c.id === created.id)).toBeUndefined();
  });
});
