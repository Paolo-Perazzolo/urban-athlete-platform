# 🏋️ Urban Athlete Platform

> Find your spot. Follow your plan. Climb the ranks.

A free, hyper-local web platform for outdoor/calisthenics athletes to discover training spots, follow AI-powered training plans, and compete on city-based leaderboards.

**Starting cities:** Trieste 🇮🇹 · Milan 🇮🇹

---

## 📁 Project Documentation

| Doc | Description | Status |
|---|---|---|
| [Product Brief](docs/00-product-brief.md) | Vision, personas, MVP scope, success metrics | ✅ Draft |
| [Technical Architecture](docs/01-technical-architecture.md) | Stack, data model, system design, cost analysis | ✅ Draft |
| [Agile Backlog](docs/02-agile-backlog.md) | Epics, sprint plans, user stories | ✅ Draft |
| [Market Analysis](docs/03-market-analysis.md) | Competitors, differentiation, go-to-market | ✅ Draft |
| [AI Agent Guide](docs/04-ai-agent-guide.md) | Model selection, token optimization, workflow tips | ✅ Draft |
| [Decisions Log](docs/05-decisions-log.md) | Running log of all strategic/technical decisions | ✅ Active |
| [Notion Setup](docs/06-notion-setup.md) | Notion workspace structure and daily workflow | ✅ Ready |
| [System Architecture](docs/06-system-architecture-diagram.md) | Architecture diagrams, data flows, tech stack | ✅ Complete |
| [Technical Improvement Backlog](docs/10-technical-improvement-backlog.md) | Prioritized non-feature technical hardening backlog | ✅ Active |
| [Product Improvement Backlog](docs/11-product-improvement-backlog.md) | Prioritized user-facing product improvements | ✅ Active |

## 🚀 Current Status

**Sprint 0: COMPLETE ✅**
- Project setup, Git workflow, SvelteKit app
- Database schema + 15 exercises loaded
- Design system + landing page
- Full documentation

**Current phase: No-auth MVP hardening**
1. **Stabilize spots + plan UX** — loading/error/empty states and edge-case handling
2. **Seed real spots data** — Trieste + Milan baseline content
3. **Add lightweight analytics events** — `spot_viewed`, `plan_generated`, `plan_generation_failed`
4. **Launch readiness checks** — smoke tests before each promotion from `dev` to `main`

## 💰 Cost Summary

| Item | Monthly Cost |
|---|---|
| Hosting (Vercel free) | €0 |
| Database + Auth + Storage (Supabase free) | €0 |
| Analytics (PostHog free) | €0 |
| Domain + email (Hostinger — already paying) | €0 extra |
| AI exercise DB generation (one-time) | ~€1-2 total |
| **Total** | **~€0/month** |

## 🛠 Tech Stack

**Frontend:** SvelteKit + Tailwind CSS  
**Backend:** Supabase (PostgreSQL + Auth + Storage)  
**Maps:** Leaflet + OpenStreetMap  
**Training Plans:** AI-generated exercise DB + deterministic algorithm  
**Analytics:** PostHog  
**Hosting:** Vercel (app) + Hostinger (domain/email)  
**PM:** Notion
