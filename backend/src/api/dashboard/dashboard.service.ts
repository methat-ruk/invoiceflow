import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface DashboardStats {
  clients: number;
  projects: number;
  invoices: {
    total: number;
    draft: number;
    sent: number;
    paid: number;
    overdue: number;
  };
  revenue: {
    paid: number;
    outstanding: number;
  };
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(userId: string): Promise<DashboardStats> {
    const [clients, projects, invoiceCounts, revenueAgg] = await Promise.all([
      this.prisma.client.count({ where: { userId } }),
      this.prisma.project.count({ where: { userId } }),
      this.prisma.invoice.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      }),
      this.prisma.invoice.groupBy({
        by: ['status'],
        where: { userId, status: { in: ['PAID', 'SENT', 'OVERDUE'] } },
        _sum: { total: true },
      }),
    ]);

    const countByStatus = (status: string) =>
      invoiceCounts.find((g) => g.status === status)?._count.status ?? 0;

    const sumByStatus = (status: string) =>
      Number(revenueAgg.find((g) => g.status === status)?._sum.total ?? 0);

    const draft = countByStatus('DRAFT');
    const sent = countByStatus('SENT');
    const paid = countByStatus('PAID');
    const overdue = countByStatus('OVERDUE');

    return {
      clients,
      projects,
      invoices: {
        total: draft + sent + paid + overdue,
        draft,
        sent,
        paid,
        overdue,
      },
      revenue: {
        paid: Math.round(sumByStatus('PAID') * 100) / 100,
        outstanding:
          Math.round((sumByStatus('SENT') + sumByStatus('OVERDUE')) * 100) /
          100,
      },
    };
  }
}
