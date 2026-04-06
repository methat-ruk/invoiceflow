import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DashboardService } from './dashboard.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('DashboardService (integration)', () => {
  let module: TestingModule;
  let service: DashboardService;
  let prisma: PrismaService;
  let testUserId: string;
  let clientId: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
      providers: [DashboardService],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);

    const user = await prisma.user.create({
      data: {
        email: 'test-dashboard@test.com',
        password: 'hashed',
        name: 'Dashboard Test',
      },
    });
    testUserId = user.id;

    const client = await prisma.client.create({
      data: {
        name: 'Test Client',
        email: 'client@test.com',
        userId: testUserId,
      },
    });
    clientId = client.id;
  });

  afterEach(async () => {
    await prisma.invoice.deleteMany({ where: { userId: testUserId } });
  });

  afterAll(async () => {
    await prisma.client.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await module.close();
  });

  it('returns counts and zeros when no invoices', async () => {
    const stats = await service.getStats(testUserId);
    expect(stats.clients).toBe(1);
    expect(stats.projects).toBe(0);
    expect(stats.invoices.total).toBe(0);
    expect(stats.revenue.paid).toBe(0);
    expect(stats.revenue.outstanding).toBe(0);
  });

  it('counts invoices by status', async () => {
    const base = {
      userId: testUserId,
      clientId,
      dueDate: new Date(),
      vatRate: 7,
      discount: 0,
      subtotal: 100,
      vatAmount: 7,
      total: 107,
    };
    await prisma.invoice.createMany({
      data: [
        { ...base, invoiceNumber: 'INV-D01', status: 'DRAFT' },
        { ...base, invoiceNumber: 'INV-D02', status: 'SENT' },
        { ...base, invoiceNumber: 'INV-D03', status: 'PAID' },
        { ...base, invoiceNumber: 'INV-D04', status: 'OVERDUE' },
      ],
    });

    const stats = await service.getStats(testUserId);
    expect(stats.invoices.total).toBe(4);
    expect(stats.invoices.draft).toBe(1);
    expect(stats.invoices.sent).toBe(1);
    expect(stats.invoices.paid).toBe(1);
    expect(stats.invoices.overdue).toBe(1);
  });

  it('calculates paid revenue and outstanding correctly', async () => {
    const base = {
      userId: testUserId,
      clientId,
      dueDate: new Date(),
      vatRate: 0,
      discount: 0,
      vatAmount: 0,
      subtotal: 500,
    };
    await prisma.invoice.createMany({
      data: [
        { ...base, invoiceNumber: 'INV-R01', status: 'PAID', total: 500 },
        { ...base, invoiceNumber: 'INV-R02', status: 'PAID', total: 300 },
        { ...base, invoiceNumber: 'INV-R03', status: 'SENT', total: 200 },
        { ...base, invoiceNumber: 'INV-R04', status: 'OVERDUE', total: 150 },
        { ...base, invoiceNumber: 'INV-R05', status: 'DRAFT', total: 999 },
      ],
    });

    const stats = await service.getStats(testUserId);
    expect(stats.revenue.paid).toBe(800); // 500 + 300
    expect(stats.revenue.outstanding).toBe(350); // 200 + 150
  });

  it('does not include other users data', async () => {
    const other = await prisma.user.create({
      data: {
        email: 'other-dashboard@test.com',
        password: 'hashed',
        name: 'Other',
      },
    });
    const otherClient = await prisma.client.create({
      data: { name: 'Other', email: 'o@test.com', userId: other.id },
    });
    await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-OTHER',
        userId: other.id,
        clientId: otherClient.id,
        dueDate: new Date(),
        status: 'PAID',
        vatRate: 0,
        discount: 0,
        subtotal: 9999,
        vatAmount: 0,
        total: 9999,
      },
    });

    const stats = await service.getStats(testUserId);
    expect(stats.revenue.paid).toBe(0);
    expect(stats.clients).toBe(1); // only testUser's client

    await prisma.invoice.deleteMany({ where: { userId: other.id } });
    await prisma.client.delete({ where: { id: otherClient.id } });
    await prisma.user.delete({ where: { id: other.id } });
  });
});
