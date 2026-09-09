-- NEXORA Titanium auth/performance hardening.
-- Keeps the existing authorization semantics while avoiding per-row auth.uid() work
-- in client invite policies and covering the remaining client_invites foreign key.

create index if not exists client_invites_created_by_idx
  on public.client_invites(created_by);

drop policy if exists client_invites_internal_select on public.client_invites;
create policy client_invites_internal_select on public.client_invites
for select to authenticated
using (
  (select private.current_role()) in (
    'owner'::public.app_role,
    'admin'::public.app_role,
    'manager'::public.app_role
  )
);

drop policy if exists client_invites_internal_update on public.client_invites;
create policy client_invites_internal_update on public.client_invites
for update to authenticated
using (
  (select private.current_role()) in (
    'owner'::public.app_role,
    'admin'::public.app_role,
    'manager'::public.app_role
  )
)
with check (
  (select private.current_role()) in (
    'owner'::public.app_role,
    'admin'::public.app_role,
    'manager'::public.app_role
  )
);
