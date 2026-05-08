# Prototype App Onboarding Guide
**How to build and deploy a full-stack internal tool prototype from scratch**

Written by: Rutwik Godse, Senior PM — HelloFresh FSA / I2M  
Stack: Next.js · TypeScript · Neon PostgreSQL · Prisma · Sage Design System · Vercel

---

## What you'll build

A fully deployed, production-grade internal tool with:
- A real PostgreSQL database (persistent data, no mocks)
- Full CRUD — create, read, update, delete records
- Sage Enterprise Design System (green sidebar, header, table, forms)
- Live URL on Vercel, auto-deploying from GitHub
- Search, filter, sort, bulk actions, metrics dashboard

**Time to complete: ~2–3 hours end to end**  
**Cost: €0 (all free tiers)**

---

## Part 1 — Accounts & Third-Party Setup

You need four accounts. Create them before starting.

### 1. GitHub
**What it's for:** Stores your code. Vercel reads from it to deploy.  
**URL:** https://github.com  
**Account type:** Personal (free)  
**Setup:**
- Create an account with your personal email (not company email)
- Create a new **public or private repository** — name it something like `my-prototype`
- Set up SSH key authentication for pushing code securely (see Security section)

> ⚠️ Use your **personal** GitHub account, not a work/company account. Mixing accounts causes deployment permission issues.

---

### 2. Vercel
**What it's for:** Deploys your app. Connects to GitHub — every push to `main` goes live automatically.  
**URL:** https://vercel.com  
**Account type:** Hobby (free)  
**Setup:**
- Sign up with the **same GitHub account** you'll use for the repo
- Import your GitHub repo during setup
- Add your `DATABASE_URL` environment variable (see Part 3)

> ⚠️ Make sure your Vercel account is connected to the same GitHub account as your repo. Mismatched accounts cause 404 deployment errors that are hard to debug.

---

### 3. Neon (PostgreSQL database)
**What it's for:** Serverless PostgreSQL. Free, persistent, works perfectly with Vercel.  
**URL:** https://neon.tech  
**Account type:** Free tier  
**Setup:**
- Create an account
- Create a new **Project** (e.g. `my-prototype-db`)
- Copy the **connection string** — it looks like:  
  `postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`
- You'll need this in Part 3 as your `DATABASE_URL`

> ⚠️ Never share or commit this connection string. Treat it like a password. See Security section.

---

### 4. Claude / Claude Code
**What it's for:** Your AI co-builder. Handles all code generation, debugging, and deployment.  
**URL:** https://claude.ai (web) or Claude Code CLI  
**Account type:** Claude Pro recommended for longer sessions  
**Setup:**
- No special setup required
- Keep your conversation in one session — context from earlier in the chat is used by Claude to make better decisions

---

## Part 2 — Project Bootstrap

### Step 1: Create the Next.js app

Run in your terminal:

```bash
npx create-next-app@latest my-prototype --typescript --tailwind --app --no-src-dir
cd my-prototype
```

### Step 2: Install core dependencies

```bash
npm install prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless
npm install react-hook-form @hookform/resolvers zod
```

### Step 3: Initialise Prisma

```bash
npx prisma init
```

This creates `prisma/schema.prisma` and `prisma.config.ts`.

### Step 4: Configure Prisma for Neon (v7)

In `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

In `prisma.config.ts`:
```ts
import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL! },
});
```

### Step 5: Create your database client

In `lib/db.ts`:
```ts
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

function createPrisma() {
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Step 6: Define your data model

Add your model to `prisma/schema.prisma`. Example for a SKU manager:

```prisma
model Sku {
  id            Int      @id @default(autoincrement())
  name          String
  category      String
  unitOfMeasure String
  costPerUnit   Float
  status        String   @default("Active")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Step 7: Run your first migration

```bash
# Add to .env.local first:
# DATABASE_URL="your-neon-connection-string"

DATABASE_URL="your-connection-string" npx prisma migrate dev --name init
```

### Step 8: Update build script

In `package.json`:
```json
"build": "prisma generate && next build"
```

---

## Part 3 — Deploying to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:yourusername/my-prototype.git
git push -u origin main
```

### Step 2: Connect to Vercel

- Go to https://vercel.com → **Add New Project**
- Import your GitHub repo
- Vercel will auto-detect Next.js settings

### Step 3: Add DATABASE_URL on Vercel

Via Vercel CLI (recommended — avoids UI bugs):
```bash
npx vercel env add DATABASE_URL production
# Paste your Neon connection string when prompted
```

Or via Vercel dashboard: Project → Settings → Environment Variables

### Step 4: Deploy

```bash
npx vercel --prod
```

After this, every `git push origin main` triggers an automatic production deployment.

---

## Part 4 — Integrating the Sage Design System

The Sage Enterprise Design System is available as a Claude.ai artifact. To use it:

1. Open Claude.ai → find the **Sage | Enterprise Design System** artifact
2. Export/download the zip
3. Extract and copy to your project:
   - `colors_and_type.css` → reference for CSS tokens
   - `*.jsx` component files → convert to TypeScript

### Core components to build

| Component | File | Purpose |
|---|---|---|
| `AppShell` | `components/sage/AppShell.tsx` | Sidebar + content layout wrapper |
| `Sidebar` | `components/sage/Sidebar.tsx` | Green navigation sidebar |
| `SageHeader` | `components/sage/Header.tsx` | Page header with breadcrumb + actions |
| `SageSkuTable` | `components/sage/SkuTable.tsx` | Data table with sort/filter/bulk |
| `Button`, `Field`, `SageInput`, `SageSelect` | `components/sage/primitives.tsx` | Form primitives |
| `Icon`, `CheckBox`, icon set | `components/sage/icons.tsx` | Icon components |

### Fonts

Copy to `public/`:
- `AgrandirDigital-Medium.woff2`
- `AgrandirDigital-Medium.woff`

Add to `app/layout.tsx` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

Add `@font-face` to `app/globals.css`:
```css
@font-face {
  font-family: 'Agrandir Digital';
  src: url('/AgrandirDigital-Medium.woff2') format('woff2');
  font-weight: 500;
  font-display: swap;
}
```

---

## Part 5 — Preview Deployments (Recommended Workflow)

Never push directly to `main`. Use the branch → PR → preview → merge workflow.

### Set up branch protection

1. GitHub repo → **Settings** → **Branches**
2. Add rule for `main` → check **"Require a pull request before merging"**

### Daily workflow

```bash
# Start a new feature
git checkout -b feature/my-new-thing

# Make changes, then push
git add .
git commit -m "Add my new thing"
git push origin feature/my-new-thing
```

3. Open a Pull Request on GitHub
4. Vercel automatically posts a **preview URL** in the PR
5. Review the preview → merge → production deploys

---

## Part 6 — Security & Compliance

### Database credentials

| Rule | Why |
|---|---|
| Never commit `DATABASE_URL` to Git | Anyone with repo access can read your DB |
| Always use `.env.local` locally — it's git-ignored | Keeps secrets off GitHub |
| Add `DATABASE_URL` to Vercel via CLI, not by typing in chat | Chat logs can be read |
| If you accidentally expose credentials, **reset your Neon password immediately** at neon.tech | Leaked credentials must be invalidated |

### GitHub

| Rule | Why |
|---|---|
| Use a **personal** GitHub account, not a company/work account | Avoids IP and access control issues |
| Enable branch protection on `main` | Prevents accidental direct pushes to production |
| Use SSH key authentication (not HTTPS tokens) | More secure, doesn't expire |

Setting up SSH key:
```bash
ssh-keygen -t ed25519 -C "your@email.com" -f ~/.ssh/github_personal
# Add the public key to GitHub: Settings → SSH Keys
# Test: ssh -T git@github.com
```

### Vercel

| Rule | Why |
|---|---|
| Keep Vercel and GitHub on the **same account** | Avoids permission errors and duplicate projects |
| Delete unused projects and preview deployments | Reduces attack surface |
| Don't share your Vercel project URL publicly if it contains real business data | Vercel URLs are publicly accessible |

### Data in prototypes

| Rule | Why |
|---|---|
| Use **dummy/synthetic data** in prototypes — never real customer data | GDPR compliance |
| Don't store PII (names, emails, addresses) in prototype databases | Data minimisation principle |
| If you need to show realistic data, anonymise it first | HelloFresh data policy |
| Inform your data privacy team if a prototype will be shown to external parties | Standard compliance process |

### Code

| Rule | Why |
|---|---|
| Remove one-time utility routes (e.g. `/api/seed`) after use | Leaves an unsecured endpoint in production |
| Review third-party packages before adding — check npm download counts and maintenance | Supply chain security |
| Don't hard-code API keys or tokens in source files | Will end up in Git history permanently |

---

## Part 7 — Starting from the Template

Once the base repo is marked as a **GitHub Template**, building a new app takes ~30 minutes instead of 3 hours.

### Steps

1. Go to `github.com/rutwik1994/prototype-test-rg`
2. Click **"Use this template"** → **"Create a new repository"**
3. Clone your new repo locally
4. Create a new Neon database for this project
5. Add `DATABASE_URL` to `.env.local`
6. Update `prisma/schema.prisma` with your new data model
7. Run `npx prisma migrate dev --name init`
8. Build your page under `app/` using Sage components
9. Push → Vercel deploys automatically

### What you get for free from the template

- ✅ Full Sage Design System (sidebar, header, table, forms, icons, fonts)
- ✅ Neon + Prisma v7 wired up and working
- ✅ Server Actions pattern for CRUD
- ✅ Vercel build config (`prisma generate` runs automatically)
- ✅ TypeScript + Tailwind CSS
- ✅ Branch protection and preview deployment setup

### What you need to change per app

- [ ] Data model in `prisma/schema.prisma`
- [ ] Validation schema in `lib/validations.ts`
- [ ] Server actions in `lib/actions.ts`
- [ ] Page and table components under `app/` and `components/`
- [ ] Sidebar nav items in `components/sage/Sidebar.tsx`
- [ ] App title in `app/layout.tsx`

---

## Quick Reference

### Key commands

```bash
# Run locally
npm run dev

# Run a DB migration
DATABASE_URL="..." npx prisma migrate dev --name <migration-name>

# Pull Vercel env vars locally
npx vercel env pull .env.local --environment production

# Deploy to production
git push origin main   # auto-deploys via Vercel GitHub integration

# Add an env var to Vercel
npx vercel env add DATABASE_URL production
```

### Key file locations

```
app/
  layout.tsx          → Add fonts, wrap with AppShell
  globals.css         → Sage CSS tokens + Tailwind
  skus/page.tsx       → Main feature page
lib/
  db.ts               → Prisma client (don't touch)
  actions.ts          → All CRUD server actions
  validations.ts      → Zod schemas + field constants
prisma/
  schema.prisma       → Data model
  prisma.config.ts    → DB connection for migrations
components/sage/      → Design system (don't delete)
public/icons/         → SVG icon files
```

### Useful links

| Resource | URL |
|---|---|
| Live app | https://prototype-test-r.vercel.app/skus |
| GitHub repo (template) | https://github.com/rutwik1994/prototype-test-rg |
| Neon dashboard | https://console.neon.tech |
| Vercel dashboard | https://vercel.com/rutwik1994s-projects |
| Next.js docs | https://nextjs.org/docs |
| Prisma v7 docs | https://www.prisma.io/docs |

---

*Built with Claude Code · May 2026*
