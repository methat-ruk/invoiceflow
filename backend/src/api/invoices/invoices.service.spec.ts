import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InvoicesService } from './invoices.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PrismaService } from '../../prisma/prisma.service.js';

const ITEMS = [
  { description: 'Web Design', quantity: 1, unitPrice: 5000 },
  { description: 'Hosting', quantity: 12, unitPrice: 500 },
];

describe('InvoicesService (integration)', () => {
  let module: TestingModule;
  let service: InvoicesService;
  let prisma: PrismaService;
  let testUserId: string;
  let testClientId: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
      providers: [InvoicesService],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    prisma = module.get<PrismaService>(PrismaService);

    const user = await prisma.user.create({
      data: {
        email: 'test-invoices@test.com',
        password: 'hashed',
        name: 'Test User',
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
    testClientId = client.id;
  });

  afterEach(async () => {
    await prisma.invoice.deleteMany({ where: { userId: testUserId } });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: testUserId } });
    await module.close();
  });

  it('create — calculates totals correctly', async () => {
    const invoice = await service.create(testUserId, {
      clientId: testClientId,
      dueDate: '2026-12-31',
      vatRate: 7,
      discount: 0,
      items: ITEMS,
    });
    // subtotal: 5000 + 6000 = 11000, vat: 770, total: 11770
    expect(Number(invoice.subtotal)).toBe(11000);
    expect(Number(invoice.vatAmount)).toBe(770);
    expect(Number(invoice.total)).toBe(11770);
    expect(invoice.invoiceNumber).toMatch(/^INV-\d{8}-\d{3}$/);
  });

  it('create — applies discount', async () => {
    const invoice = await service.create(testUserId, {
      clientId: testClientId,
      dueDate: '2026-12-31',
      vatRate: 7,
      discount: 500,
      items: [{ description: 'Service', quantity: 1, unitPrice: 10000 }],
    });
    expect(Number(invoice.total)).toBe(10200); // 10000 + 700 - 500
  });

  it('create — throws BadRequestException for invalid clientId', async () => {
    await expect(
      service.create(testUserId, {
        clientId: 'invalid-id',
        dueDate: '2026-12-31',
        items: ITEMS,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('create — throws BadRequestException when items is empty', async () => {
    await expect(
      service.create(testUserId, {
        clientId: testClientId,
        dueDate: '2026-12-31',
        items: [],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('findAll — returns own invoices', async () => {
    await service.create(testUserId, {
      clientId: testClientId,
      dueDate: '2026-12-31',
      items: ITEMS,
    });
    await service.create(testUserId, {
      clientId: testClientId,
      dueDate: '2026-12-31',
      items: ITEMS,
    });
    const invoices = await service.findAll(testUserId);
    expect(invoices.length).toBeGreaterThanOrEqual(2);
    expect(invoices.every((i) => i.userId === testUserId)).toBe(true);
  });

  it('update — changes status', async () => {
    const created = await service.create(testUserId, {
      clientId: testClientId,
      dueDate: '2026-12-31',
      items: ITEMS,
    });
    const updated = await service.update(created.id, testUserId, {
      status: 'SENT',
    });
    expect(updated.status).toBe('SENT');
  });

  it('remove — deletes invoice', async () => {
    const created = await service.create(testUserId, {
      clientId: testClientId,
      dueDate: '2026-12-31',
      items: ITEMS,
    });
    await service.remove(created.id, testUserId);
    await expect(service.findOne(created.id, testUserId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
