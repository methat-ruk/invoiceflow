# Testing Guide

## Commands

```bash
npm --prefix backend run test:unit
npm --prefix backend run test:integration
npm --prefix backend run test:e2e
node scripts/smoke-test.mjs
npm --prefix backend run build
npm --prefix frontend run build
```

## What each suite covers

### Unit

`npm --prefix backend run test:unit`

- Fast controller and auth service checks
- No live HTTP server needed
- Best for regressions during refactoring

### Integration

`npm --prefix backend run test:integration`

- Uses Prisma against a real database
- Verifies client, project, invoice, and dashboard service behavior
- Requires `backend/.env` with a working `DATABASE_URL`

### E2E

`npm --prefix backend run test:e2e`

- Boots the Nest app
- Covers auth endpoints, auth guards, and health endpoint

### Smoke

`node scripts/smoke-test.mjs`

Requirements:

- Backend must already be running
- Demo seed account must exist

Optional environment variables:

```env
SMOKE_API_URL=http://localhost:4000/api
SMOKE_EMAIL=demo@invoiceflow.dev
SMOKE_PASSWORD=password123
```

The smoke script checks:

1. `/api/health`
2. `/api/auth/login`
3. `/api/dashboard/stats`
