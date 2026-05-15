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

- ถ้าใส่แค่ origin เช่น `http://localhost:4000` ระบบจะเติม `/api` ให้เอง
- ถ้าใส่เต็มเป็น `https://your-backend.railway.app/api` ก็ใช้ได้เหมือนกัน

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
