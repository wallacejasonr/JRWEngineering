# JRW Engineering

A web application for JRW Engineering, a civil engineering firm. The app serves two purposes:

1. **Public landing page** — marketing site with services, about, team, portfolio, and contact form
2. **Internal portal** — staff-only area for managing projects, quotes, and invoices

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL on Neon
- **ORM**: Prisma
- **Auth**: NextAuth/Auth.js (JRW staff only)
- **File Storage**: AWS S3 (project files — various types, staff-uploaded)
- **PDF Generation**: TBD (quotes and invoices, emailed to clients)
- **Deployment**: Vercel

## Architecture

### Public Routes (`/`)
- Landing page with sections: services, about, team, portfolio, contact form
- Static/ISR where possible for performance

### Internal Routes (`/dashboard`)
- Protected by NextAuth — JRW staff only
- **Projects**: CRUD for civil engineering projects
- **Quotes**: Create quotes for projects, convert approved quotes to invoices
- **Invoices**: Track invoices (no online payment — tracking only)
- **Files**: Upload/manage project files stored in S3

### Data Model (high-level)
- **User** — staff accounts (NextAuth)
- **CompanyProfile** — singleton, company info for document headers (name, address, PE cert)
- **Client** — company or individual that JRW does work for
- **Contact** — person at a client company (every client has at least one)
- **Project** — has a project number (YY-NNN), belongs to a client, has a service type and location
- **Quote** — belongs to a project; has inclusions list, exclusions list, flat fee, billing terms; status (draft/sent/approved/rejected)
- **Invoice** — created from an approved quote; number format JRWE-YY-NNN; has phase-based line items with % completion; status (draft/sent/paid/overdue)
- **InvoiceLineItem** — service, phase description, contract amount, % complete, invoice amount
- **File** — belongs to a project, S3 key, metadata

### Key Workflows
- Quote lifecycle: draft -> sent -> approved -> converts to invoice
- Invoice lifecycle: draft -> sent -> paid | overdue
- PDF generation for quotes and invoices, sent via email

## Development

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npx prisma studio  # Database GUI
npx prisma migrate dev  # Run migrations
```

## Conventions

- Use the Next.js App Router (`app/` directory)
- Server Components by default; use `"use client"` only when needed
- Prisma for all database access — no raw SQL unless necessary
- Colocate components with their routes when route-specific
- Shared components go in `src/components/`
- API routes in `app/api/` for server actions that need endpoints
- Environment variables in `.env.local` (never committed)
