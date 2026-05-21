# JRW Engineering

A web application for JRW Engineering, a civil engineering firm. The app serves two purposes:

1. **Public landing page** — marketing site with about, portfolio, and contact info
2. **Internal portal** — staff-only dashboard for managing clients, projects, quotes, invoices, and files

## Tech Stack

- **Framework**: Next.js 16 (App Router) on React 19
- **Styling**: Tailwind CSS v4 (PostCSS plugin, no `tailwind.config.ts`)
- **Database**: PostgreSQL on Neon
- **ORM**: Prisma v7 (uses `prisma-client` generator + `@prisma/adapter-pg`; URL configured in `prisma.config.ts`, not the datasource block)
- **Auth**: NextAuth v5 (Auth.js beta) — Credentials provider, JWT sessions, bcryptjs
- **Validation**: Zod (server actions parse FormData via shared schemas)
- **File Storage**: AWS S3 (browser-direct uploads via presigned PUT, downloads via presigned GET)
- **PDF Generation**: `@react-pdf/renderer` — server-rendered to a buffer and streamed back
- **Deployment**: Vercel (build runs `prisma generate && next build`)

## Architecture

### Public routes (`src/app/(public)/`)
- `/` — landing page (hero, "What We Do" services grid, "Why JRW" section)
- `/about` — about the firm
- `/portfolio` — past projects
- `/contact` — phone, mailto link to `jason@jrwengineering.us`, business hours (no form)
- Header + Footer in `src/components/layout/`

### Dashboard routes (`src/app/dashboard/`)
- Protected by `src/middleware.ts` — redirects to `/auth/signin` if no Auth.js session cookie
- Sign-in at `/auth/signin` (Credentials, email + password)
- Sections: `/clients`, `/projects`, `/quotes`, `/invoices`
- Server actions live alongside their routes as `actions.ts` (e.g. `src/app/dashboard/clients/actions.ts`)

### API routes (`src/app/api/`)
- `auth/[...nextauth]` — NextAuth handler
- `files/presign`, `files`, `files/[id]`, `files/[id]/download` — S3 presigned upload/download lifecycle
- `quotes/[id]/pdf`, `invoices/[id]/pdf` — render `@react-pdf/renderer` document to a buffer and respond with `application/pdf`

### Library (`src/lib/`)
- `prisma.ts` — Prisma client singleton with `PrismaPg` adapter
- `auth.ts` — NextAuth config + `handlers`/`auth`/`signIn`/`signOut` exports
- `auth-helpers.ts` — `requireUser()` for server actions
- `numbering.ts` — `nextProjectNumber()` (`YY-NNN`), `nextQuoteNumber()` (`Q-YY-NNN`), `nextInvoiceNumber()` (`JRWE-YY-NNN`)
- `form-state.ts` — shared `FormState` type and helpers for `useActionState` flows
- `s3.ts` — S3 client + presign helpers (auto-checksum disabled for browser PUT)
- `pdf/` — React-PDF components (`shared.tsx`, `QuotePDF.tsx`, `InvoicePDF.tsx`) and company-profile loader

### Data model
- **User** — staff accounts (id, email, hashedPassword, role: admin|user)
- **CompanyProfile** — singleton header info (name, owner, PE title, address, phone, email, PE cert)
- **Client** — company or individual; soft-deleted via `archivedAt`; has many Contacts and Projects
- **Contact** — person at a client (firstName/lastName/email/phone/title, `isPrimary` boolean); cascade-deleted with client
- **Project** — `projectNumber` (`YY-NNN`), belongs to a Client, references a primary `Contact`, has `service`, `location`, `status` (active|completed|on_hold|archived), soft-deleted via `archivedAt`
- **Quote** — `quoteNumber` (`Q-YY-NNN`), belongs to a Project, has `inclusions[]`/`exclusions[]` (string lists), `fee` Decimal, `billingTerms`, status (draft|sent|approved|rejected), tracks sentAt/approvedAt/rejectedAt
- **Invoice** — `invoiceNumber` (`JRWE-YY-NNN`), one-to-one with the source Quote, has phase-based `InvoiceLineItem`s, `total` Decimal (auto-recomputed on line-item changes), status (draft|sent|paid|overdue|cancelled)
- **InvoiceLineItem** — service, phaseDescription, contractAmount, percentComplete, invoiceAmount, sortOrder
- **File** — belongs to a Project; stores S3 key/bucket, original name, mime type, size

### Key workflows
- **Quote lifecycle**: draft → sent → approved → convert to invoice (button on detail page). Only `draft` quotes can be edited or deleted.
- **Invoice lifecycle**: draft → sent → paid | overdue (or cancelled). Line items are editable inline while draft; total auto-recomputes.
- **Quote → Invoice**: converts an approved quote into a draft invoice with one seeded line item from the quote fee. The Quote and Invoice retain a one-to-one link.
- **Client archive guard**: a Client can only be archived when it has no Projects with status != `archived`. Enforced in `archiveClient` and surfaced in the UI as a disabled Archive button with a list of blocking projects.
- **Soft delete**: Clients and Projects use `archivedAt`. List views default to non-archived; archived clients are accessible via `/dashboard/clients?view=archived` with inline Unarchive.
- **File uploads**: browser → `/api/files/presign` → S3 PUT directly → `/api/files` to persist metadata. Downloads use presigned GET via `/api/files/[id]/download`.
- **PDF generation**: rendered server-side on demand at `/api/quotes/[id]/pdf` and `/api/invoices/[id]/pdf`; layout uses `CompanyProfile` for the document header. Currently downloaded manually — no auto-email yet.

## Development

```bash
npm run dev                     # Start dev server (default :3000, picks :3001 if taken)
npm run build                   # Production build (runs prisma generate)
npm run lint                    # ESLint
npx prisma studio               # Database GUI
npx prisma migrate dev          # Create + apply a migration in dev
npx prisma migrate deploy       # Apply pending migrations (CI/prod)
npx prisma db seed              # Seed the database (config in prisma.config.ts)
```

### Seeded staff users
All passwords: `password123`. Seed file: `prisma/seed.ts`.
- `jason@jrwengineering.com` (admin)
- `sarah@jrwengineering.com` (user)
- `marcus@jrwengineering.com` (user)

### Environment variables
Required in `.env` (local) and Vercel (production):
- `DATABASE_URL` — Neon connection string
- `NEXTAUTH_URL` — public origin (`http://localhost:3001` local, `https://www.jrwengineering.us` prod)
- `NEXTAUTH_SECRET` — random 32-byte secret
- `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — S3 access

See `docs/aws-s3-setup.md` for AWS setup including bucket CORS and IAM policy.

## Conventions

- Next.js App Router under `src/app/`; route groups for `(public)` vs `dashboard`
- Server Components by default; `"use client"` only when state/effects are needed
- All database access through Prisma — no raw SQL unless absolutely necessary
- **Server actions colocated** with their routes as `actions.ts` (one per resource: `clients/actions.ts`, `projects/actions.ts`, etc.)
- Mutating server actions call `await requireUser()` first and use Zod to parse `FormData`
- **Forms** use the `useActionState` pattern: a small client component holds the form, the server action returns `FormState` (`{ ok, message, fieldErrors }`) for inline error rendering. Errors flow through `src/lib/form-state.ts`.
- Inline single-button server actions (no field errors needed) can use the `<form action={async () => { "use server"; ... }}>` pattern directly in a server component
- Shared UI in `src/components/`; route-specific components (forms, sections) stay colocated with the route
- API routes only for things that need an HTTP endpoint (auth callback, file API, PDF streaming) — otherwise prefer server actions
- Generated Prisma client lives at `src/generated/prisma/` (gitignored); import via `@/generated/prisma/client`
- Env vars live in `.env` (gitignored). Template: `.env.sample`
- PDFs match the JRW sample templates in look — header banner, company block, info tables, section banners, line items, signature
