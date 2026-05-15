# Backend

NestJS API for InvoiceFlow.

## Local setup

```bash
Copy-Item .env.example .env
npm install
npm run db:reset
npm run db:seed
npm run start:dev
```

API base URL: `http://localhost:4000/api`

## Database Scripts

```bash
npm run db:migrate:deploy
npm run db:seed
```

Recommended usage:

- `npm run db:migrate:deploy` for local, staging, and production databases where you want to apply existing migrations safely
- `npm run db:seed` for loading the demo account and sample invoice data
- `npm run db:reset` for local-only rebuilds when you want to wipe and recreate the database quickly

## Important environment variables

```env
DATABASE_URL=postgresql://...
JWT_SECRET=replace-me
PORT=4000
FRONTEND_URL=http://localhost:3000
```

## Scripts

- `npm run build`
- `npm run start`
- `npm run start:dev`
- `npm run start:prod`
- `npm run db:reset`
- `npm run db:migrate:deploy`
- `npm run db:seed`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:e2e`

## Railway

Recommended Railway backend setup:

- Root Directory: `/backend`
- Use the default detected `build` script
- Use the default detected `start` script

`npm run start` and `npm run start:prod` both run Prisma migrations before starting the built server, matching the Railway pattern used in `crm-ai-loyalty`.
