# Decisions Log

> Every strategic/technical decision gets logged here with date and context.

---

| Date | Decision | Docs Updated |
|---|---|---|
| 2025-06-25 | Initial Phase 0 docs created (product brief, architecture, backlog, market analysis, AI guide) | All |
| 2025-06-25 | Solo founder — simplify everything, use Notion for PM, no heavy tooling | 00, 01, 02 |
| 2025-06-25 | Training plans: AI generates exercise DB once, deterministic algorithm builds plans (no per-request AI calls) | 01, 02 |
| 2025-06-25 | Hostinger Business Web Hosting available — evaluate for hosting instead of / alongside Vercel | 01 |
| 2025-06-25 | Created `update-docs` workflow to keep documentation in sync with decisions | — |
| 2025-06-25 | Notion workspace structure defined: 1 DB (Backlog) + 4 pages (Decisions, Ideas, Weekly Review, Sprint Board view) | 06 |
| 2025-06-25 | Sprint 0 completed: SvelteKit app scaffold, atomic design components, content system (JSON), database schema, Revolut/Freeletics-inspired design | app/* |
| 2025-06-25 | Corporate network blocks npm - will test/deploy from home network | — |
| 2026-06-29 | UI direction updated to dark minimal style (mostly black, small radius, no gradients) across navigation and core pages | app/src/app.css, app/src/routes/* |
| 2026-06-29 | Landing page refreshed to premium/dynamic composition using two static WebP assets | app/src/routes/+page.svelte, app/static/images/* |
| 2026-06-29 | Training plan generator hardened for null profile fields to prevent runtime errors | app/src/lib/utils/trainingPlanGenerator.js |
| 2026-06-30 | Project moved to no-auth UX for plan and spots; added engineering standards and docs gate before dev push; implemented spots map view with dark style, lucid-gold pins, and marker-driven left sidebar details | docs/09-engineering-standards.md, .windsurf/workflows/update-docs.md, app/src/routes/spots/+page.svelte, app/src/app.css |
| 2026-07-01 | Reverted to simplified DB strategy for first deploy: single Supabase project (`main`) shared by Git `dev` and `main`; Vercel production deploy remains `main` only | docs/01-technical-architecture.md, app/supabase/README.md, app/README.md |
| 2026-07-01 | Removed active auth/profile routes from current app phase and aligned docs/backlog to no-auth scope (spots + deterministic plan only) | app/src/routes/+layout.svelte, app/src/routes/auth/*, app/src/routes/profile/*, docs/01-technical-architecture.md, docs/02-agile-backlog.md, app/README.md, app/SETUP_INSTRUCTIONS.md |
| 2026-07-02 | Performed docs consistency pass for no-auth phase and introduced dedicated technical improvement backlog for stabilization priorities | docs/00-product-brief.md, docs/01-technical-architecture.md, docs/02-agile-backlog.md, docs/10-technical-improvement-backlog.md, README.md |
| 2026-07-02 | Created dedicated product improvement backlog to prioritize user-facing roadmap by impact on core loop and retention | docs/11-product-improvement-backlog.md, README.md |
