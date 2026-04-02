# InvoiceFlow — Invoice & Payment Tracker

A full-stack Invoice & Payment Tracking platform for freelancers and SMEs. Built as a portfolio project demonstrating Full-Stack Development, REST API Design, Database Design, Financial Logic, and PDF Generation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | NestJS, TypeScript, Zod |
| Database | PostgreSQL, Prisma ORM |

## Features

- **Client Management** — CRUD, contact info, projects overview
- **Project Management** — CRUD, assign invoices, track progress
- **Invoice Management** — Create invoices, itemized services/products, VAT calculation
- **Invoice Status** — Draft → Sent → Paid → Overdue
- **PDF Export** — Generate professional invoice PDFs with company branding
- **Dashboard** — Monthly revenue, outstanding balance, overdue reports
- **Notifications** — Email reminders for unpaid invoices (optional)
- **Financial Calculations** — Auto subtotal, VAT, discounts, and totals

---

## Prerequisites

- Node.js
- PostgreSQL
- npm

---

## Project Structure

invoiceflow/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── src/
│       ├── api/
│       │   ├── auth/
│       │   ├── clients/
│       │   ├── projects/
│       │   ├── invoices/
│       │   ├── dashboard/
│       │   └── notifications/
│       └── main.ts
└── frontend/
    └── src/
        ├── app/(dashboard)/
        │   ├── clients/
        │   ├── projects/
        │   ├── invoices/
        │   └── dashboard/
        ├── components/
        └── services/