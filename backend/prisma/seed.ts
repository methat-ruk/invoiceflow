import 'reflect-metadata';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('🌱 Seeding database...');

  // ── Clean up existing seed data ──────────────────────────────────────────
  await prisma.invoice.deleteMany({
    where: { user: { email: 'demo@invoiceflow.dev' } },
  });
  await prisma.project.deleteMany({
    where: { user: { email: 'demo@invoiceflow.dev' } },
  });
  await prisma.client.deleteMany({
    where: { user: { email: 'demo@invoiceflow.dev' } },
  });
  await prisma.user.deleteMany({ where: { email: 'demo@invoiceflow.dev' } });

  // ── User ─────────────────────────────────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      email: 'demo@invoiceflow.dev',
      password: await bcrypt.hash('password123', 10),
      name: 'Demo User',
    },
  });
  console.log(`  ✓ User: ${user.email}`);

  // ── Clients ──────────────────────────────────────────────────────────────
  const acme = await prisma.client.create({
    data: {
      name: 'Acme Corporation',
      email: 'contact@acme.example.com',
      phone: '0812345678',
      address: '123 Sukhumvit Rd, Bangkok 10110',
      userId: user.id,
    },
  });

  const techwave = await prisma.client.create({
    data: {
      name: 'TechWave Co., Ltd.',
      email: 'billing@techwave.example.com',
      phone: '0898765432',
      address: '456 Silom Rd, Bangkok 10500',
      userId: user.id,
    },
  });

  const startup = await prisma.client.create({
    data: {
      name: 'Startup Studio',
      email: 'hello@startup.example.com',
      userId: user.id,
    },
  });
  console.log(`  ✓ Clients: ${acme.name}, ${techwave.name}, ${startup.name}`);

  // ── Projects ─────────────────────────────────────────────────────────────
  const websiteProject = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Full redesign of corporate website with new branding',
      clientId: acme.id,
      userId: user.id,
    },
  });

  const appProject = await prisma.project.create({
    data: {
      name: 'Mobile App MVP',
      description: 'iOS and Android app for internal HR management',
      clientId: techwave.id,
      userId: user.id,
    },
  });

  const brandProject = await prisma.project.create({
    data: {
      name: 'Brand Identity',
      description: 'Logo, color palette, and brand guidelines',
      clientId: startup.id,
      userId: user.id,
    },
  });
  console.log(
    `  ✓ Projects: ${websiteProject.name}, ${appProject.name}, ${brandProject.name}`,
  );

  // ── Invoices ─────────────────────────────────────────────────────────────
  const inv1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-20250301-001',
      status: 'PAID',
      dueDate: new Date('2025-03-31'),
      issueDate: new Date('2025-03-01'),
      subtotal: 45000,
      vatRate: 7,
      vatAmount: 3150,
      discount: 0,
      total: 48150,
      clientId: acme.id,
      projectId: websiteProject.id,
      userId: user.id,
      items: {
        create: [
          {
            description: 'UI/UX Design',
            quantity: 1,
            unitPrice: 25000,
            total: 25000,
          },
          {
            description: 'Frontend Development',
            quantity: 1,
            unitPrice: 15000,
            total: 15000,
          },
          {
            description: 'QA Testing',
            quantity: 5,
            unitPrice: 1000,
            total: 5000,
          },
        ],
      },
    },
  });

  const inv2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-20250315-001',
      status: 'SENT',
      dueDate: new Date('2025-04-15'),
      issueDate: new Date('2025-03-15'),
      subtotal: 60000,
      vatRate: 7,
      vatAmount: 4200,
      discount: 5000,
      total: 59200,
      notes: 'Payment due within 30 days. Bank transfer to SCB account.',
      clientId: techwave.id,
      projectId: appProject.id,
      userId: user.id,
      items: {
        create: [
          {
            description: 'Mobile App Development (iOS)',
            quantity: 1,
            unitPrice: 30000,
            total: 30000,
          },
          {
            description: 'Mobile App Development (Android)',
            quantity: 1,
            unitPrice: 30000,
            total: 30000,
          },
        ],
      },
    },
  });

  const inv3 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-20250201-001',
      status: 'OVERDUE',
      dueDate: new Date('2025-02-28'),
      issueDate: new Date('2025-02-01'),
      subtotal: 18000,
      vatRate: 7,
      vatAmount: 1260,
      discount: 0,
      total: 19260,
      clientId: startup.id,
      projectId: brandProject.id,
      userId: user.id,
      items: {
        create: [
          {
            description: 'Logo Design (3 concepts)',
            quantity: 1,
            unitPrice: 8000,
            total: 8000,
          },
          {
            description: 'Brand Guidelines Document',
            quantity: 1,
            unitPrice: 6000,
            total: 6000,
          },
          {
            description: 'Business Card Design',
            quantity: 2,
            unitPrice: 2000,
            total: 4000,
          },
        ],
      },
    },
  });

  const inv4 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-20250401-001',
      status: 'DRAFT',
      dueDate: new Date('2025-04-30'),
      issueDate: new Date('2025-04-01'),
      subtotal: 12000,
      vatRate: 7,
      vatAmount: 840,
      discount: 0,
      total: 12840,
      notes: 'Monthly maintenance retainer — April 2025',
      clientId: acme.id,
      projectId: websiteProject.id,
      userId: user.id,
      items: {
        create: [
          {
            description: 'Website Maintenance (April)',
            quantity: 1,
            unitPrice: 8000,
            total: 8000,
          },
          {
            description: 'Content Updates',
            quantity: 4,
            unitPrice: 1000,
            total: 4000,
          },
        ],
      },
    },
  });

  console.log(
    `  ✓ Invoices: ${inv1.invoiceNumber} (PAID), ${inv2.invoiceNumber} (SENT), ${inv3.invoiceNumber} (OVERDUE), ${inv4.invoiceNumber} (DRAFT)`,
  );
  console.log('\n✅ Seed complete!');
  console.log('\n📋 Demo credentials:');
  console.log('   Email:    demo@invoiceflow.dev');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
