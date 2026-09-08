import fs from 'node:fs';

const read = p => fs.readFileSync(p, 'utf8');
const requireText = (text, needle, label) => {
  if (!text.includes(needle)) throw new Error(`QA failed: ${label} missing ${needle}`);
};
const forbid = (text, re, label) => {
  if (re.test(text)) throw new Error(`QA failed: ${label} matched ${re}`);
};

const index = read('index.html');
const styles = read('styles.css');
const ultra = read('ultra-home.css');
const responsive = read('ultra-qa.css');
const dashboardLoader = read('dashboard/dashboard.js');
const suite = read('dashboard/suite-88.js');
const ultraSuite = read('dashboard/suite-88-ultra.js');
const portal = read('portal/index.html');
const migration = read('supabase/migrations/20260908_release_88_guardrails.sql');
const status = read('FEATURES_88_RELEASE_STATUS.md');
const serviceWorker = read('service-worker.js');

// Public responsive release gate.
requireText(index, 'width=device-width, initial-scale=1', 'viewport');
for (const marker of ['ultra-home.css', 'ultra-qa.css']) requireText(styles, marker, 'style import');
for (const marker of ['max-width:420px', 'max-width:760px', 'min-width:1600px', 'prefers-reduced-motion:reduce']) {
  requireText(ultra.replaceAll(' ', ''), marker, 'ultra responsive CSS');
}
for (const marker of ['max-width:380px', 'max-width:640px', 'max-width:900px', 'max-width:1200px', 'min-width:1600px', 'prefers-reduced-motion:reduce']) {
  requireText(responsive.replaceAll(' ', ''), marker, 'QA responsive CSS');
}

// Dashboard / portal release wiring.
requireText(dashboardLoader, 'suite-88.js', 'dashboard suite loader');
requireText(dashboardLoader, 'suite-88-ultra.js', 'dashboard ultra loader');
requireText(suite, '88 Feature Center', 'feature center');
requireText(ultraSuite, 'Localization Manager', 'localization manager');
requireText(ultraSuite, 'White-label', 'white-label capability');
requireText(ultraSuite, 'Multi-company', 'multi-company capability');
requireText(portal, 'portal.js', 'client portal script');

// Registry/release accounting.
requireText(status, 'Total capabilities: **88**', '88-capability checklist');
requireText(status, 'Approval-gated by design: **4**', 'approval gate count');
requireText(status, '#38 Expense Management', 'expense gate');
requireText(status, '#70 SEO Content Generator', 'SEO publish gate');
requireText(status, '#71 Social Content Studio', 'social publish gate');
requireText(status, '#72 Portfolio Auto Builder', 'portfolio publish gate');

// Database-level human approval guardrails must be staged before release.
for (const marker of [
  'nexora_expense_approval_guard',
  'nexora_content_approval_guard',
  'nexora_communication_approval_guard',
  'communication_drafts_approval_id_idx',
  'add column if not exists approval_id uuid references public.approvals(id)',
  "a.reviewed_by is not null",
  "a.reviewed_at is not null",
  'requires an approved human approval record',
  'requires explicit human approval'
]) requireText(migration, marker, 'staged approval migration');

// Every foreign key currently flagged by the production advisor must be covered in the staged release migration.
for (const marker of [
  'autopilot_settings_updated_by_idx',
  'changelog_entries_created_by_idx',
  'client_feedback_client_id_idx',
  'document_versions_created_by_idx',
  'feature_flags_updated_by_idx',
  'knowledge_articles_created_by_idx',
  'project_milestones_created_by_idx',
  'project_templates_created_by_idx',
  'proposal_templates_created_by_idx',
  'qa_reviews_reviewed_by_idx',
  'status_incidents_created_by_idx',
  'website_audits_requested_by_idx',
  'workspace_settings_updated_by_idx'
]) requireText(migration, marker, 'advisor index coverage');

// Guard helpers must stay private and non-executable from browser roles.
requireText(migration, 'from public, anon, authenticated', 'private guard execute revocation');

// Frontend must never contain privileged Supabase secrets.
const clientSurface = [index, suite, ultraSuite, portal, serviceWorker].join('\n');
forbid(clientSurface, /service[_-]?role/i, 'privileged Supabase key name in client surface');
forbid(clientSurface, /sb_secret_[A-Za-z0-9_-]+/i, 'Supabase secret key in client surface');

console.log('NEXORA release-88 static QA: PASS');
