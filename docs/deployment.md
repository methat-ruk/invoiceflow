# Deployment Guide

## Recommended topology

- Frontend: Vercel
- Backend: Railway
- Database: Neon Postgres

This repo is set up so the frontend can point directly at the backend origin through `NEXT_PUBLIC_API_URL`, while the backend allows localhost and Vercel preview origins in `main.ts`.

## Frontend on Vercel

Set these environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

Notes:

- If you enter `https://your-backend.railway.app` the system will automatically append `/api`
- If you enter `https://your-backend.railway.app/api` it will work as well

## Backend on Railway

Set these environment variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=replace-with-a-long-random-secret
PORT=4000
```

Recommended deploy steps:

```bash
npm install
npm run db:reset
npm run build
npm run start:prod
```

## Neon

- Create a Postgres database in Neon
- Copy the pooled connection string into `DATABASE_URL`
- Run `npm run db:migrate:deploy`
- Run `npm run db:seed` once for live demo data

## Live Demo Checklist

1. Confirm Railway backend responds at `/api/health`
2. Run `npm run db:seed` against the demo database
3. Verify Vercel frontend can log in with the demo account
4. Run `npm run test:smoke` against the deployed backend
5. Open the deployed frontend and verify dashboard, clients, projects, invoices, and PDF download
