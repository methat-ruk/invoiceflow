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
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Notes:

- If you provide only the origin, such as `http://localhost:4000`, the app will append `/api` automatically.
- If you provide the full value, such as `https://your-backend.railway.app/api`, it will also work.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
