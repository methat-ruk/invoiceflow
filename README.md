# InvoiceFlow — Invoice & Payment Tracker

A full-stack Invoice & Payment Tracking platform for freelancers and SMEs.  
Built as a portfolio project demonstrating Full-Stack Development, REST API Design, Database Design, Financial Logic, and PDF Generation.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Shadcn UI |
| Backend | NestJS 11, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (access token) |
| PDF | @react-pdf/renderer |

## Features

- **Auth** — Register, Login with JWT
- **Client Management** — CRUD with contact info
- **Project Management** — CRUD, linked to clients
- **Invoice Management** — Create itemized invoices with VAT and discount calculation
- **Invoice Status** — DRAFT → SENT → PAID → OVERDUE with inline status change
- **PDF Export** — Download professional invoice PDF per invoice
- **Dashboard** — Summary stats: clients, projects, revenue collected, outstanding, invoice breakdown

---

## Prerequisites

- [Node.js](https://nodejs.org) v20+
- [PostgreSQL](https://www.postgresql.org) v14+
- npm v9+

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd invoiceflow
```

### 2. Set up the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/invoiceflow"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

Install dependencies and set up the database:

```bash
npm install
npx prisma migrate deploy
npm run db:seed        # optional: load sample data
```

Start the backend:

```bash
npm run start:dev
```

Backend runs at: `http://localhost:4000`

---

### 3. Set up the Frontend

```bash
cd ../frontend
cp .env.example .env.local
```

`.env.local` contents:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

Install dependencies and start:

```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Sample Data (Seed)

Run the seed script to populate the database with demo data:

```bash
cd backend
npm run db:seed
```

Demo login credentials:

| Field | Value |
|---|---|
| Email | `demo@invoiceflow.dev` |
| Password | `password123` |

Sample data includes 3 clients, 3 projects, and 4 invoices (PAID, SENT, OVERDUE, DRAFT).

---

## Running Tests

Integration tests require a running PostgreSQL database and a `.env` file with `DATABASE_URL`.

```bash
cd backend
npm test
```

---

## Project Structure

```
invoiceflow/
├── backend/
│   ├── db/
│   │   ├── schema.dbml        # DB schema for dbdiagram.io
│   │   └── sample-data.json   # Reference data for manual testing
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma schema
│   │   ├── migrations/        # Migration history
│   │   └── seed.ts            # Seed script
│   └── src/
│       └── api/
│           ├── auth/
│           ├── clients/
│           ├── projects/
│           ├── invoices/
│           └── dashboard/
└── frontend/
    ├── public/
    │   └── fonts/             # Local TTF fonts for PDF generation
    └── src/
        ├── app/
        │   ├── (auth)/        # Login, Register pages
        │   └── (dashboard)/   # Dashboard, Clients, Projects, Invoices
        ├── components/
        │   ├── layout/        # Topbar, Sidebar
        │   ├── pdf/           # InvoicePDF component
        │   └── ui/            # Button, DropdownMenu, etc.
        └── services/          # API service functions
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/clients` | List all clients |
| POST | `/api/clients` | Create client |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/invoices` | List all invoices |
| POST | `/api/invoices` | Create invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |
| GET | `/api/dashboard/stats` | Get summary stats |

All endpoints except auth require `Authorization: Bearer <token>` header.
