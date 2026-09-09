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
- `/command/leads` — CRM leads from Supabase
- `/command/projects` — projects workspace
- `/command/tasks` — tasks workspace
- `/command/team` — team management using secure RPCs
- `/command/proposals` — proposals
- `/command/invoices` — invoices and payment status
- `/command/agents` — AI request monitoring
- `/command/automations` — autopilot settings and run monitoring
- `/command/approvals` — approval center
- `/command/analytics` — operational analytics
- `/command/activity` — activity log and system health
- `/command/settings` — workspace settings
- `/portal` — client portal
- `/portal/login` — client authentication

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
3. Finish role-specific UI restrictions and remaining client-facing modules.
4. Run auth/role/RLS and build QA.
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

## Current implementation status

Implemented in V2:

- Next.js + TypeScript + Tailwind foundation
- New NEXORA public landing page
- Staff/Admin login with profile-role validation
- Routed NEXORA Command application shell
- CRM Leads: list, filter and create
- Projects: list/filter/create
- Tasks: Kanban-style view, create and status updates
- Team: list, add via secure RPC, role changes and activate/deactivate
- Proposals: list/create/status workflow
- Invoices: list/create/status and collection metrics
- Approvals: pending queue with approve/reject actions
- AI requests monitor
- Autopilot/automation settings and run monitor
- Analytics overview
- Activity log and system health monitor
- Workspace settings editor
- Client portal and client login foundation

Still required before production cutover:

- Build/TypeScript QA in a deployment environment
- Complete role-specific navigation visibility
- Complete client project/approval/file isolation UX
- Notifications/search polish
- Full Arabic/English switching
- Final mobile QA
- Vercel preview and acceptance testing
