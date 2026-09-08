# NEXORA 88 — Final Release Checklist

Branch: `release-88-ultra`

## Current registry snapshot

- Total capabilities: **88**
- Live: **80**
- Approval-gated by design: **4**
- Ready / pending final verification: **4**

## Approval-gated capabilities

These remain intentionally gated and must not auto-send, auto-spend, auto-pay, or auto-publish:

- #38 Expense Management — spending records require approval.
- #70 SEO Content Generator — drafts only before publish approval.
- #71 Social Content Studio — drafts only before publish approval.
- #72 Portfolio Auto Builder — creates case-study drafts; publication requires approval.

## Ready capabilities pending final verification

- #58 Backup Status — show verification state only; never claim backups without evidence.
- #60 Multi-company Ready — workspace architecture and settings prepared.
- #61 White-label Mode — brand settings prepared; enable only from authorized workspace settings.
- #69 Localization Manager — AR/EN content workflow prepared.

## Public interface release gate

The final homepage must pass visual/responsive verification at:

- 360–420 px mobile
- 768 px tablet
- 1366/1440 px laptop/desktop
- 1920 px large desktop

Required checks: no horizontal overflow, no clipped CTAs, readable typography, stable header, fluid product scenes, reduced-motion support, keyboard focus visibility, and correct AR/EN direction.

## Integration state

Existing active Make scenarios retained:

1. NEXORA Website Lead Intake v1
2. NEXORA Dashboard AI Assistant v1

No outbound-contact, spending, payment, or sensitive-publication automation is to be added without the existing human approval layer.

## Backend safety gate

Supabase currently has RLS enabled on all application tables. Before final release, re-run security and performance advisors and review any remaining warnings before production merge.

## Release rule

Do not merge this branch to `main` until the interface and all 88 capabilities are verified. Final release should be one combined merge/deploy.
