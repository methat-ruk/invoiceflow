import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { UpdateInvoiceDto } from './dto/update-invoice.dto.js';
import { CreateInvoiceItemDto } from './dto/create-invoice-item.dto.js';

const INVOICE_INCLUDE = {
  client: { select: { id: true, name: true } },
  project: { select: { id: true, name: true } },
  items: true,
};

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.invoice.findMany({
      where: { userId },
      include: INVOICE_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, userId },
      include: INVOICE_INCLUDE,
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async create(userId: string, dto: CreateInvoiceDto) {
    await this.validateClient(dto.clientId, userId);
    if (dto.projectId) await this.validateProject(dto.projectId, userId);
    if (!dto.items?.length) throw new BadRequestException('Invoice must have at least one item');

    const invoiceNumber = await this.generateInvoiceNumber();
    const { subtotal, vatAmount, total, itemsData } = this.calculateTotals(
      dto.items,
      dto.vatRate ?? 7,
      dto.discount ?? 0,
    );

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId: dto.clientId,
        projectId: dto.projectId,
        userId,
        dueDate: new Date(dto.dueDate),
        vatRate: dto.vatRate ?? 7,
        discount: dto.discount ?? 0,
        subtotal,
        vatAmount,
        total,
        notes: dto.notes,
        items: { create: itemsData },
      },
      include: INVOICE_INCLUDE,
    });
  }

  async update(id: string, userId: string, dto: UpdateInvoiceDto) {
    await this.findOne(id, userId);
    if (dto.clientId) await this.validateClient(dto.clientId, userId);
    if (dto.projectId) await this.validateProject(dto.projectId, userId);

    const data: Record<string, unknown> = {};
    if (dto.clientId !== undefined) data['clientId'] = dto.clientId;
    if (dto.projectId !== undefined) data['projectId'] = dto.projectId;
    if (dto.dueDate !== undefined) data['dueDate'] = new Date(dto.dueDate);
    if (dto.notes !== undefined) data['notes'] = dto.notes;
    if (dto.status !== undefined) data['status'] = dto.status;

    if (dto.items) {
      const current = await this.prisma.invoice.findUnique({
        where: { id },
        select: { vatRate: true, discount: true },
      });
      const vatRate = dto.vatRate ?? Number(current!.vatRate);
      const discount = dto.discount ?? Number(current!.discount);
      const { subtotal, vatAmount, total, itemsData } = this.calculateTotals(
        dto.items,
        vatRate,
        discount,
      );
      data['vatRate'] = vatRate;
      data['discount'] = discount;
      data['subtotal'] = subtotal;
      data['vatAmount'] = vatAmount;
      data['total'] = total;
      data['items'] = { deleteMany: {}, create: itemsData };
    } else {
      if (dto.vatRate !== undefined) data['vatRate'] = dto.vatRate;
      if (dto.discount !== undefined) data['discount'] = dto.discount;
    }

    return this.prisma.invoice.update({
      where: { id },
      data,
      include: INVOICE_INCLUDE,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.invoice.delete({ where: { id } });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private async validateClient(clientId: string, userId: string) {
    const client = await this.prisma.client.findFirst({ where: { id: clientId, userId } });
    if (!client) throw new BadRequestException('Client not found');
  }

  private async validateProject(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) throw new BadRequestException('Project not found');
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const prefix = `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const count = await this.prisma.invoice.count({
      where: { invoiceNumber: { startsWith: prefix } },
    });
    return `${prefix}-${String(count + 1).padStart(3, '0')}`;
  }

  private calculateTotals(items: CreateInvoiceItemDto[], vatRate: number, discount: number) {
    const itemsData = items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: Math.round(item.quantity * item.unitPrice * 100) / 100,
    }));
    const subtotal = Math.round(itemsData.reduce((sum, i) => sum + i.total, 0) * 100) / 100;
    const vatAmount = Math.round(subtotal * (vatRate / 100) * 100) / 100;
    const total = Math.round((subtotal + vatAmount - discount) * 100) / 100;
    return { subtotal, vatAmount, total, itemsData };
  }
}
