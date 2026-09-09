# NEXORA V2

This branch is a clean rebuild of NEXORA using Next.js App Router, TypeScript, Tailwind CSS and Supabase.

## Goals

- Premium public website inspired by modern SaaS/AI product design.
- NEXORA Command for Owner/Admin/Manager/Sales/Developer roles.
- NEXORA Portal for clients.
- Proper Arabic RTL from the architecture level.
- Preserve and reuse the current Supabase project and data.
- Replace monolithic static JavaScript with routed modules.

## Current routes

- `/` — public NEXORA website
- `/login` — staff/admin authentication
- `/command` — executive overview
- `/command/leads` — real CRM leads from Supabase
- `/command/projects` — real projects workspace
- `/command/tasks` — real tasks workspace
- `/command/team` — team management using secure RPCs
- `/command/proposals`
- `/command/invoices`
- `/command/agents`
- `/command/automations`
- `/command/approvals`
- `/command/analytics`
- `/command/activity`
- `/command/settings`
- `/portal` — client portal foundation

## Supabase

The rebuild deliberately reuses the existing database instead of creating a second source of truth.

Environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do not commit service-role keys or other private secrets.

## Team access

V2 uses the existing security-definer RPCs for team management:

- `admin_add_employee`
- `admin_set_employee_role`
- `admin_set_employee_active`

The Owner role is intentionally protected from assignment/deactivation through regular admin flows.

## Migration approach

1. Keep `main` production site available.
2. Build and test V2 on this branch.
3. Connect remaining modules to existing tables/RPCs.
4. Run auth/role/RLS QA.
5. Deploy a preview to Vercel.
6. Only after approval, replace production with V2.

## Design system

Public site: Launch-style premium SaaS direction.

Internal system: Shadcn-admin-inspired product layout, adapted to NEXORA branding rather than copied as a template.

Core palette:

- Background `#F6F7F9`
- Surface `#FFFFFF`
- Text `#0B1220`
- Brand `#0071E3`
- Deep surface `#07111F`

## Status

The foundation, authentication, routed Command shell, CRM Leads, Projects, Tasks and Team modules are in place. Remaining modules should be connected incrementally to preserve data correctness and RLS behavior.
