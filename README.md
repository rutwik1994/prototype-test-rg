# Sage Prototype Template

A full-stack Next.js app template for building internal tool prototypes fast. Pre-wired with the Sage Enterprise Design System, Neon PostgreSQL, Prisma ORM, and Vercel deployment.

## What's included

- **Sage Design System** — Sidebar, Header, Table, Form primitives, icon set, full token system
- **Neon PostgreSQL** — serverless Postgres via `@prisma/adapter-neon`
- **Prisma v7** — ORM with migrations, configured for Vercel serverless
- **Next.js 16 App Router** — Server Actions for CRUD, no separate API layer
- **React Hook Form + Zod** — type-safe form validation
- **Vercel-ready** — `prisma generate` runs at build time

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Database | Neon serverless PostgreSQL |
| ORM | Prisma v7 |
| UI | Sage Enterprise Design System |
| Forms | React Hook Form + Zod v4 |
| Deployment | Vercel |

## Getting started from this template

### 1. Create a new repo
Click **"Use this template"** → **"Create a new repository"** on GitHub.

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your database
Create a free database at [neon.tech](https://neon.tech). Copy the connection string.
```bash
# .env.local
DATABASE_URL="postgresql://..."
```

### 4. Run migrations
```bash
npx prisma migrate dev --name init
```

### 5. Run locally
```bash
npm run dev
```

### 6. Deploy to Vercel
Connect your GitHub repo in the [Vercel dashboard](https://vercel.com) and add `DATABASE_URL` as a production environment variable.

---

## Building a new feature

1. Add a model in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <name>`
3. Add server actions in `lib/actions.ts`
4. Add a Zod schema in `lib/validations.ts`
5. Build your page under `app/` using Sage components from `components/sage/`

---

## Project structure

```
app/
  layout.tsx              # AppShell — Sidebar + content wrapper
  page.tsx                # Root redirect
  skus/                   # Example feature: Culinary SKU manager
    page.tsx
    new/page.tsx
    [id]/edit/page.tsx
components/
  sage/                   # Sage Design System — reuse across all features
    AppShell.tsx
    Header.tsx
    Sidebar.tsx
    SkuTable.tsx
    icons.tsx
    primitives.tsx
  skus/
    sku-form.tsx
lib/
  actions.ts              # Server Actions (CRUD)
  db.ts                   # Prisma client singleton
  validations.ts          # Zod schemas
prisma/
  schema.prisma
  migrations/
public/
  icons/                  # Sage SVG icon set (10 icons)
  AgrandirDigital-Medium.woff2
```
