-- Optimize email-based self-read policies without changing access semantics.

drop policy if exists team_access_read on public.team_access;
create policy team_access_read on public.team_access
for select to authenticated
using (
  (select private.is_owner_or_admin())
  or lower(email)=lower(coalesce(((select auth.jwt()) ->> 'email'),'') )
);

drop policy if exists client_access_self_read on public.client_access;
create policy client_access_self_read on public.client_access
for select to authenticated
using (
  lower(email)=lower(coalesce(((select auth.jwt()) ->> 'email'),'') )
);
