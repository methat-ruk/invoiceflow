# Backend

NestJS API for InvoiceFlow.

## Local setup

```bash
Copy-Item .env.example .env
npm install
npm run db:reset
npm run start:dev
```

API base URL: `http://localhost:4000/api`

## Important environment variables

```env
DATABASE_URL=postgresql://...
JWT_SECRET=replace-me
PORT=4000
```

## Scripts

- `npm run build`
- `npm run start:dev`
- `npm run start:prod`
- `npm run db:reset`
- `npm run db:migrate:deploy`
- `npm run db:seed`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:e2e`
