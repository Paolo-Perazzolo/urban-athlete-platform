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
