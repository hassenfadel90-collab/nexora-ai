# NEXORA 88 — Final Release Checklist

Branch: `release-88-ultra`

## Current registry snapshot

- Total capabilities: **88**
- Live in current backend registry: **80**
- Approval-gated by design: **4**
- Ready / pending final verification: **4**

## Approval-gated capabilities

These remain intentionally gated and must not auto-send, auto-spend, auto-pay, or auto-publish:

- #38 Expense Management — spending records require approval.
- #70 SEO Content Generator — drafts only before publish approval.
- #71 Social Content Studio — drafts only before publish approval.
- #72 Portfolio Auto Builder — creates case-study drafts; publication requires approval.

A final-release Supabase migration is staged in this branch to enforce approval gates at database level for expense state transitions, content publication and outbound communications. It must not be applied before the combined release gate passes.

## Ready capabilities pending final verification

- #58 Backup Status — branch UI now performs evidence-based database/health verification and explicitly avoids claiming managed backups without provider evidence.
- #60 Multi-company Ready — branch UI now supports isolated company contexts in workspace metadata.
- #61 White-label Mode — branch UI now provides authorized brand configuration and preview without changing production branding early.
- #69 Localization Manager — branch UI now provides AR/EN locale configuration with RTL/LTR-ready preview state.

The last three are implemented in `release-88-ultra` and remain registry-`ready` until the branch is authenticated and verified during final pre-release QA. Backup Status remains verification-only by design.

## Public interface release gate

The final homepage must pass visual/responsive verification at:

- 360–420 px mobile
- 768 px tablet
- 1366/1440 px laptop/desktop
- 1920 px large desktop

Required checks: no horizontal overflow, no clipped CTAs, readable typography, stable header, fluid product scenes, reduced-motion support, keyboard focus visibility, and correct AR/EN direction.

A final `ultra-qa.css` guardrail layer is now loaded last on the release branch to constrain overflow, responsive grids, product scenes, large-screen widths and reduced-motion behavior.

## Integration state

Existing active Make scenarios retained and healthy in the latest inspected executions:

1. NEXORA Website Lead Intake v1
2. NEXORA Dashboard AI Assistant v1

No outbound-contact, spending, payment, or sensitive-publication automation is to be added without the existing human approval layer.

## Backend safety gate

Supabase security/performance advisors were re-run. Existing warnings are documented for final hardening. The staged final-release migration adds missing foreign-key indexes, optimizes two auth-heavy RLS predicates, and adds approval-state database guards. The migration remains unapplied until the final combined release.

## Release rule

Do not merge this branch to `main` until the interface and all 88 capabilities are verified. Final release should be one combined merge/deploy, followed by production verification against the merged commit.
