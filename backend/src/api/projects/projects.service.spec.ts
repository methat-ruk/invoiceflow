import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('ProjectsService (integration)', () => {
  let module: TestingModule;
  let service: ProjectsService;
  let prisma: PrismaService;
  let testUserId: string;
  let testClientId: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = module.get<PrismaService>(PrismaService);

    const user = await prisma.user.create({
      data: { email: 'test-projects@test.com', password: 'hashed', name: 'Test User' },
    });
    testUserId = user.id;

    const client = await prisma.client.create({
      data: { name: 'Test Client', email: 'client@test.com', userId: testUserId },
    });
    testClientId = client.id;
  });

  afterEach(async () => {
    await prisma.project.deleteMany({ where: { userId: testUserId } });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: testUserId } });
    await module.close();
  });

  it('create — saves project to db', async () => {
    const project = await service.create(testUserId, {
      name: 'Website Redesign',
      clientId: testClientId,
      description: 'Redesign the company website',
    });
    expect(project.name).toBe('Website Redesign');
    expect(project.clientId).toBe(testClientId);
    expect(project.client.name).toBe('Test Client');
  });

  it('create — throws BadRequestException for invalid clientId', async () => {
    await expect(
      service.create(testUserId, { name: 'Project X', clientId: 'invalid-id' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('findAll — returns only own projects', async () => {
    await service.create(testUserId, { name: 'Project A', clientId: testClientId });
    await service.create(testUserId, { name: 'Project B', clientId: testClientId });

    const projects = await service.findAll(testUserId);
    expect(projects).toHaveLength(2);
    expect(projects.every((p) => p.userId === testUserId)).toBe(true);
  });

  it('findAll — filter by clientId', async () => {
    await service.create(testUserId, { name: 'Project A', clientId: testClientId });

    const projects = await service.findAll(testUserId, testClientId);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every((p) => p.clientId === testClientId)).toBe(true);
  });

  it('findOne — throws NotFoundException for wrong userId', async () => {
    const created = await service.create(testUserId, { name: 'Mine', clientId: testClientId });
    await expect(service.findOne(created.id, 'other-user-id')).rejects.toThrow(NotFoundException);
  });

  it('update — changes fields', async () => {
    const created = await service.create(testUserId, { name: 'Old Name', clientId: testClientId });
    const updated = await service.update(created.id, testUserId, { name: 'New Name', description: 'Updated' });
    expect(updated.name).toBe('New Name');
    expect(updated.description).toBe('Updated');
  });

  it('remove — deletes project from db', async () => {
    const created = await service.create(testUserId, { name: 'To Delete', clientId: testClientId });
    await service.remove(created.id, testUserId);
    const projects = await service.findAll(testUserId);
    expect(projects.find((p) => p.id === created.id)).toBeUndefined();
  });
});
