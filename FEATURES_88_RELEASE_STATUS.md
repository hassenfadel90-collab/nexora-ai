# NEXORA 88 — Final Release Checklist

Branch: `release-88-ultra`

## Current registry snapshot

- Total capabilities: **88**
- Live in current backend registry: **80**
- Approval-gated by design: **4**
- Ready / pending final verification: **4**

`FEATURES_88_MANIFEST.json` is the authoritative release snapshot exported from `public.feature_registry`. The release QA now rejects duplicate feature numbers/keys, gaps in 1–88 numbering, incorrect status counts, or movement of the four human-approval capabilities out of `approval_gated`.

## Approval-gated capabilities

These remain intentionally gated and must not auto-send, auto-spend, auto-pay, or auto-publish:

- #38 Expense Management — spending records require approval.
- #70 SEO Content Generator — drafts only before publish approval.
- #71 Social Content Studio — drafts only before publish approval.
- #72 Portfolio Auto Builder — creates case-study drafts; publication requires approval.

A final-release Supabase migration is staged in this branch to enforce approval gates at database level for expense state transitions, content publication and outbound communications. It must not be applied before the combined release gate passes.

## Ready capabilities pending final verification

- #58 Backup Status — branch UI performs evidence-based database/health verification and explicitly avoids claiming managed backups without provider evidence.
- #60 Multi-company Ready — branch UI supports isolated company contexts in workspace metadata.
- #61 White-label Mode — branch UI provides authorized brand configuration and preview without changing production branding early.
- #69 Localization Manager — branch UI provides AR/EN locale configuration with RTL/LTR-ready preview state.

The last three are implemented in `release-88-ultra` and remain registry-`ready` until the branch is authenticated and verified during final pre-release QA. Backup Status remains verification-only by design.

## Public interface release gate

The final homepage must pass visual/responsive verification at:

- 360–420 px mobile
- 768 px tablet
- 1366/1440 px laptop/desktop
- 1920 px large desktop

Required checks: no horizontal overflow, no clipped CTAs, readable typography, stable header, fluid product scenes, reduced-motion support, keyboard focus visibility, and correct AR/EN direction.

A final `ultra-qa.css` guardrail layer is loaded last on the release branch to constrain overflow, responsive grids, product scenes, large-screen widths and reduced-motion behavior.

## Integration state

Existing active Make scenarios retained:

1. NEXORA Website Lead Intake v1 — active, zero incomplete executions; latest inspected runs on 2026-09-08 succeeded.
2. NEXORA Dashboard AI Assistant v1 — active, zero incomplete executions.

No outbound-contact, spending, payment, or sensitive-publication automation is to be added without the human approval layer.

## Backend safety gate

Supabase is `ACTIVE_HEALTHY`; all public application tables currently report RLS enabled. Security/performance advisors were re-run on 2026-09-08. The staged final-release migration covers all 13 currently reported unindexed foreign keys, optimizes the two reported auth-heavy RLS predicates, and adds database-level approval-state guards. The migration remains unapplied until the final combined release.

Known advisor items intentionally held for final hardening/review:

- `intake_rate_limits` has RLS enabled with no browser policy; this is intentionally non-browser-accessible.
- Three admin RPCs remain `SECURITY DEFINER` because they must update protected identity/team records; their function bodies enforce owner/admin authorization and their ACL excludes `anon`/`PUBLIC`. This accepted warning must be rechecked immediately before release.
- Supabase Auth leaked-password protection is currently disabled and requires provider/auth configuration review before declaring the security gate fully complete.
- Several multiple-permissive-policy warnings remain; they require semantic RLS consolidation rather than blind removal and are therefore not changed during an intermediate branch run.

## Release rule

Do not merge this branch to `main` until the interface and all 88 capabilities are verified. Final release should be one combined merge/deploy, followed by production verification against the merged commit.
