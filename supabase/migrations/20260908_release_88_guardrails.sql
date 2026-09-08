-- NEXORA 88 final-release guardrails.
-- Prepared on release-88-ultra; DO NOT apply before final combined release verification.

-- Performance: cover foreign keys reported by Supabase advisor.
create index if not exists autopilot_settings_updated_by_idx on public.autopilot_settings(updated_by);
create index if not exists changelog_entries_created_by_idx on public.changelog_entries(created_by);
create index if not exists client_feedback_client_id_idx on public.client_feedback(client_id);
create index if not exists document_versions_created_by_idx on public.document_versions(created_by);
create index if not exists feature_flags_updated_by_idx on public.feature_flags(updated_by);
create index if not exists knowledge_articles_created_by_idx on public.knowledge_articles(created_by);
create index if not exists project_milestones_created_by_idx on public.project_milestones(created_by);
create index if not exists project_templates_created_by_idx on public.project_templates(created_by);
create index if not exists proposal_templates_created_by_idx on public.proposal_templates(created_by);
create index if not exists qa_reviews_reviewed_by_idx on public.qa_reviews(reviewed_by);
create index if not exists status_incidents_created_by_idx on public.status_incidents(created_by);
create index if not exists website_audits_requested_by_idx on public.website_audits(requested_by);
create index if not exists workspace_settings_updated_by_idx on public.workspace_settings(updated_by);

-- RLS init-plan improvements; semantics preserved.
drop policy if exists team_access_read on public.team_access;
create policy team_access_read on public.team_access
for select to authenticated
using (
  (select private.is_owner_or_admin())
  or lower(email)=lower(coalesce((select auth.jwt()->>'email'),'') )
);

drop policy if exists client_access_self_read on public.client_access;
create policy client_access_self_read on public.client_access
for select to authenticated
using (lower(email)=lower(coalesce((select auth.jwt()->>'email'),'') ));

-- Human approval enforcement for sensitive state transitions.
create or replace function private.nexora_has_approved_gate(p_approval_id uuid)
returns boolean
language sql
security invoker
set search_path=''
stable
as $$
  select exists(
    select 1 from public.approvals a
    where a.id=p_approval_id and a.status='approved'::public.approval_status
  );
$$;

create or replace function private.nexora_guard_expense_state()
returns trigger
language plpgsql
security invoker
set search_path=''
as $$
begin
  if lower(coalesce(new.status,'')) not in ('draft','pending','submitted','approval_pending') then
    if new.approval_id is null or not private.nexora_has_approved_gate(new.approval_id) then
      raise exception 'Expense transition requires an approved human approval record';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists nexora_expense_approval_guard on public.expenses;
create trigger nexora_expense_approval_guard
before insert or update of status,approval_id on public.expenses
for each row execute function private.nexora_guard_expense_state();

create or replace function private.nexora_guard_content_state()
returns trigger
language plpgsql
security invoker
set search_path=''
as $$
begin
  if lower(coalesce(new.status,'')) in ('published','live','scheduled','released') then
    if new.approval_id is null or not private.nexora_has_approved_gate(new.approval_id) then
      raise exception 'Publishing requires an approved human approval record';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists nexora_content_approval_guard on public.content_drafts;
create trigger nexora_content_approval_guard
before insert or update of status,approval_id on public.content_drafts
for each row execute function private.nexora_guard_content_state();

create or replace function private.nexora_guard_communication_state()
returns trigger
language plpgsql
security invoker
set search_path=''
as $$
begin
  if lower(coalesce(new.status,'')) in ('sent','delivered','sending','queued_for_send') then
    if new.approved_by is null or new.approved_at is null then
      raise exception 'External communication requires explicit human approval';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists nexora_communication_approval_guard on public.communication_drafts;
create trigger nexora_communication_approval_guard
before insert or update of status,approved_by,approved_at on public.communication_drafts
for each row execute function private.nexora_guard_communication_state();

-- Keep helper functions private.
revoke all on function private.nexora_has_approved_gate(uuid) from public, anon;
revoke all on function private.nexora_guard_expense_state() from public, anon;
revoke all on function private.nexora_guard_content_state() from public, anon;
revoke all on function private.nexora_guard_communication_state() from public, anon;
