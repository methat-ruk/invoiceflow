import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './api/auth/auth.module.js';
import { ClientsModule } from './api/clients/clients.module.js';
import { ProjectsModule } from './api/projects/projects.module.js';
import { InvoicesModule } from './api/invoices/invoices.module.js';
import { DashboardModule } from './api/dashboard/dashboard.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ClientsModule,
    ProjectsModule,
    InvoicesModule,
    DashboardModule,
  ],
})
export class AppModule {}
