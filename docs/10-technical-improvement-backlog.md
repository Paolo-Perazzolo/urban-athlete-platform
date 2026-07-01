# Technical Improvement Backlog

> **Purpose:** Track non-feature technical improvements that increase stability, delivery confidence, and maintainability.

---

## P0 — Next Iteration

| ID | Improvement | Why | Acceptance Criteria |
|---|---|---|---|
| T0-1 | Pre-promotion smoke checklist (`dev` -> `main`) | Prevent broken production deploys | Checklist documented and used before each promotion; includes `/`, `/spots`, `/plan` + console check |
| T0-2 | Spots page hardening (loading/error/empty states parity) | Reduce runtime confusion and silent failures | All major UI states visible and testable in list and map mode |
| T0-3 | Plan generation input guards | Prevent invalid profile/input causing runtime failures | Invalid values are clamped/validated; user sees clear error messages |
| T0-4 | Analytics minimum baseline | Enable evidence-based prioritization | `spot_viewed`, `plan_generated`, `plan_generation_failed` events visible in PostHog |

## P1 — Near Term

| ID | Improvement | Why | Acceptance Criteria |
|---|---|---|---|
| T1-1 | Seed realistic spots dataset (Trieste/Milan) | Improve first impression and usability | At least 10 spots/city with coordinates, equipment, and basic descriptions |
| T1-2 | Data quality validation for spots | Prevent map/list breakage from malformed data | Invalid lat/lng/equipment rows are filtered and surfaced in logs |
| T1-3 | Basic release notes discipline | Improve rollback/debug speed | Each `dev` -> `main` promotion has short change summary + rollback SHA |

## P2 — Later (After Scope Expansion)

| ID | Improvement | Why | Acceptance Criteria |
|---|---|---|---|
| T2-1 | Reintroduce auth/profile with dedicated migration plan | Enable personalization/gamification phase safely | Auth/profile routes return with updated docs + migration checklist |
| T2-2 | Environment split for Supabase (dev/prod) | Lower production risk at scale | Separate Supabase projects or DB branching strategy documented and adopted |
| T2-3 | Automated lint/test gate in CI | Catch regressions before promotion | GitHub workflow blocks promotion when checks fail |

---

## Working Rule

Before promoting `dev` to `main`, prioritize unresolved P0 items over new feature additions when they affect stability.
