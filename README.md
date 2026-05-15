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
npm --prefix backend run db:reset
npm --prefix backend run db:seed
```

Run the apps in separate terminals:

```bash
npm --prefix backend run start:dev
npm --prefix frontend run dev
```

Frontend: `http://localhost:3000`
Backend API: `http://localhost:4000/api`
Health: `http://localhost:4000/api/health`

## Database Scripts

Use these commands for the backend:

```bash
npm --prefix backend run db:migrate:deploy
npm --prefix backend run db:seed
```

Recommended usage:

- `npm --prefix backend run db:migrate:deploy` applies committed Prisma migrations to the target database
- `npm --prefix backend run db:seed` loads the demo account and sample data
- `npm --prefix backend run db:reset` is intended for local rebuilds when you want a clean database

## Demo Seed

`npm --prefix backend run db:seed` creates a reusable demo account plus sample clients, projects, and invoices.

| Field | Value |
| --- | --- |
| Email | `demo@invoiceflow.dev` |
| Password | `password123` |

## Test Matrix

| Type | Command | Notes |
| --- | --- | --- |
| Unit | `npm --prefix backend run test:unit` | Controller and auth service tests |
| Integration | `npm --prefix backend run test:integration` | Prisma + database-backed service tests |
| E2E | `npm --prefix backend run test:e2e` | Nest app boot + HTTP assertions |
| Smoke | `node scripts/smoke-test.mjs` | Requires a running backend and seeded demo user |
| Full verify | `npm --prefix backend run build && npm --prefix frontend run build && npm --prefix backend run test:unit && npm --prefix backend run test:integration && npm --prefix backend run test:e2e` | Build + unit + integration + e2e |

## Deployment Shape

- Frontend: Vercel project with `NEXT_PUBLIC_API_URL` pointing to Railway
- Backend: Railway service with `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_URL`
- Database: Neon Postgres database used by Railway and local Prisma

More detail:

- [docs/deployment.md](https://github.com/methat-ruk/invoiceflow/blob/release/demo-ready/docs/deployment.md)
- [docs/testing.md](https://github.com/methat-ruk/invoiceflow/blob/release/demo-ready/docs/testing.md)
- [backend/README.md](https://github.com/methat-ruk/invoiceflow/blob/release/demo-ready/backend/README.md)
- [frontend/README.md](https://github.com/methat-ruk/invoiceflow/blob/release/demo-ready/frontend/README.md)
