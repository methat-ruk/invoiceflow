# Frontend

Next.js app for InvoiceFlow.

## Local setup

```bash
Copy-Item .env.example .env.local
npm install
npm run dev
```

Default local URL: `http://localhost:3000`

## Environment variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Notes:

- Use the full backend API base URL, including `/api`, the same way the CRM project does.
- Example for Vercel: `NEXT_PUBLIC_API_URL=https://invoiceflow-production-d1d2.up.railway.app/api`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
