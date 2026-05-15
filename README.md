# InvoiceFlow

Invoice and payment tracking app for freelancers and small teams, prepared for reliable demos and straightforward deployment.

## Stack

| Layer | Target |
| --- | --- |
| Frontend | Next.js 16 on Vercel |
| Backend | NestJS 11 on Railway |
| Database | Postgres on Neon |
| ORM | Prisma |
| Auth | JWT |
| PDF | `@react-pdf/renderer` |

## Quick Start

```bash
npm --prefix backend install
npm --prefix frontend install
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
npm run db:reset
```

Run the apps in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:3000`
Backend API: `http://localhost:4000/api`
Health: `http://localhost:4000/api/health`

## Demo Seed

`npm run db:seed` creates a reusable demo account plus sample clients, projects, and invoices.

| Field | Value |
| --- | --- |
| Email | `demo@invoiceflow.dev` |
| Password | `password123` |

## Test Matrix

| Type | Command | Notes |
| --- | --- | --- |
| Unit | `npm run test:unit` | Controller and auth service tests |
| Integration | `npm run test:integration` | Prisma + database-backed service tests |
| E2E | `npm run test:e2e` | Nest app boot + HTTP assertions |
| Smoke | `npm run test:smoke` | Requires a running backend and seeded demo user |
| Full verify | `npm run verify` | Build + unit + integration + e2e |

## Deployment Shape

- Frontend: Vercel project with `NEXT_PUBLIC_API_URL` pointing to Railway
- Backend: Railway service with `DATABASE_URL` and `JWT_SECRET`
- Database: Neon Postgres database used by Railway and local Prisma

More detail:

- [docs/deployment.md](D:/Code/Test/invoiceflow/docs/deployment.md)
- [docs/testing.md](D:/Code/Test/invoiceflow/docs/testing.md)
- [backend/README.md](D:/Code/Test/invoiceflow/backend/README.md)
- [frontend/README.md](D:/Code/Test/invoiceflow/frontend/README.md)
