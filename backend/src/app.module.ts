import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { ClientsModule } from './api/clients/clients.module';
import { ProjectsModule } from './api/projects/projects.module';
import { InvoicesModule } from './api/invoices/invoices.module';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { NotificationsModule } from './api/notifications/notifications.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule,
    ProjectsModule,
    InvoicesModule,
    DashboardModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
