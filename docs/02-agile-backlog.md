# Agile Backlog — Urban Athlete Platform

> **Version:** 0.1 · **Date:** 2025-06-25  
> **Methodology:** Scrum-lite (1-week sprints, no formal ceremonies — just you + AI)

---

## Epics Overview

| # | Epic | Priority | Sprint Target |
|---|---|---|---|
| E1 | Project Setup & Infrastructure | P0 | Sprint 0 |
| E2 | Authentication & User Profiles | P0 | Sprint 1 |
| E3 | Training Spots (CRUD + Map) | P0 | Sprint 1-2 |
| E4 | Photos & Reviews | P1 | Sprint 2 |
| E5 | Analytics Instrumentation | P0 | Sprint 0-1 |
| E6 | Gamification (XP + Leaderboard) | P1 | Sprint 3 |
| E7 | AI Training Plans | P2 | Sprint 4 |
| E8 | PWA & Notifications | P2 | Sprint 5 |
| E9 | Seed Content & Launch Prep | P1 | Sprint 5 |

---

## Sprint 0 — Foundation (Week 1)

**Goal:** Project scaffold, CI/CD, database schema, analytics ready

| ID | Story | Points | Acceptance Criteria |
|---|---|---|---|
| S0-1 | Set up SvelteKit project with Tailwind CSS | 2 | Project runs locally, basic page renders |
| S0-2 | Configure Supabase project (DB + Auth + Storage) | 3 | Supabase dashboard accessible, tables created |
| S0-3 | Run database migrations (core schema) | 2 | All tables from data model exist with RLS policies |
| S0-4 | Connect GitHub repo + Vercel deployment | 2 | Push to main → live on vercel.app URL |
| S0-5 | Integrate PostHog analytics SDK | 1 | Page views tracked, events visible in PostHog |
| S0-6 | Create basic layout (nav, footer, responsive shell) | 2 | Mobile-first layout with nav and city selector |

**Total:** 12 points

---

## Sprint 1 — Auth + Spots List (Week 2)

**Goal:** Users can sign up, log in, and see a list of training spots on a map

| ID | Story | Points | Acceptance Criteria |
|---|---|---|---|
| S1-1 | User registration (email + Google OAuth) | 3 | User can sign up and receives confirmation |
| S1-2 | User login + session management | 2 | User stays logged in, JWT in cookie |
| S1-3 | Profile creation flow (username, city selection) | 2 | After first login, user selects Trieste or Milan |
| S1-4 | Training spots map view (Leaflet + OSM) | 3 | Map centered on user's city showing spot markers |
| S1-5 | Spot detail page (name, description, equipment) | 2 | Click marker → see spot details |
| S1-6 | Track auth events in PostHog | 1 | signup, login, profile_created events firing |

**Total:** 13 points

---

## Sprint 2 — Spots CRUD + Photos + Reviews (Week 3)

**Goal:** Users can add spots, upload photos, and leave reviews

| ID | Story | Points | Acceptance Criteria |
|---|---|---|---|
| S2-1 | "Add new spot" form (name, location picker, equipment) | 3 | Logged-in user can submit a new spot |
| S2-2 | Photo upload for spots (max 5, client-side compression) | 5 | Photos compressed to WebP, stored in Supabase Storage |
| S2-3 | Star rating + review for spots | 3 | User can rate 1-5 stars and leave comment |
| S2-4 | Spot list view (card layout, filterable by city) | 2 | Alternative to map: scrollable card list |
| S2-5 | Track content events in PostHog | 1 | spot_added, photo_uploaded, review_submitted events |

**Total:** 14 points

---

## Sprint 3 — Gamification v1 (Week 4)

**Goal:** XP system live, city leaderboard visible

| ID | Story | Points | Acceptance Criteria |
|---|---|---|---|
| S3-1 | XP engine: award XP for actions | 3 | XP granted for review (+10), photo (+15), check-in (+20), workout (+30) |
| S3-2 | User profile shows level + XP bar | 2 | Profile page displays current level, XP, progress to next level |
| S3-3 | City leaderboard page | 3 | Top 20 users per city, sortable by XP |
| S3-4 | Streak tracking (consecutive days with activity) | 3 | Calendar view of training days, streak counter |
| S3-5 | Basic badge system (5 initial badges) | 2 | "First Review", "Explorer" (3 spots), "Streak 7", etc. |
| S3-6 | Track gamification events in PostHog | 1 | xp_earned, level_up, streak, badge_unlocked events |

**Total:** 14 points

---

## Sprint 4 — AI Training Plans (Week 5)

**Goal:** Users can generate personalized training plans

| ID | Story | Points | Acceptance Criteria |
|---|---|---|---|
| S4-1 | Training plan request form (level, goals, equipment) | 2 | Form collects user preferences |
| S4-2 | AI plan generation (GPT-4o-mini integration) | 5 | Structured weekly plan returned and stored |
| S4-3 | Plan display page (daily exercises, sets, reps) | 3 | Clean UI showing the weekly plan |
| S4-4 | Workout logging (mark exercises as done) | 3 | User can check off exercises, earn XP |
| S4-5 | Track AI feature usage in PostHog | 1 | plan_generated, workout_started, workout_completed |

**Total:** 14 points

---

## Sprint 5 — Polish + Seed + Launch (Week 6)

**Goal:** Platform ready for first real users

| ID | Story | Points | Acceptance Criteria |
|---|---|---|---|
| S5-1 | Seed 10 spots in Trieste with photos | 3 | Real spots with descriptions, equipment, photos |
| S5-2 | Seed 10 spots in Milan with photos | 3 | Real spots with descriptions, equipment, photos |
| S5-3 | PWA manifest + service worker | 2 | App installable on mobile, offline spot cache |
| S5-4 | Landing page with value proposition | 3 | Hero section, features, CTA to sign up |
| S5-5 | SEO basics (meta tags, OG images, sitemap) | 2 | Shareable on social media with preview |
| S5-6 | Build analytics dashboards in PostHog | 2 | Acquisition funnel, retention, city comparison |
| S5-7 | Bug fixes and performance optimization | 3 | Lighthouse score > 85, no critical bugs |

**Total:** 18 points

---

## Definition of Done (DoD)

- [ ] Feature works on mobile and desktop
- [ ] Analytics events fire correctly
- [ ] No console errors
- [ ] Deployed to production (Vercel)
- [ ] Basic manual testing done

---

## Velocity Tracking

| Sprint | Planned | Completed | Notes |
|---|---|---|---|
| Sprint 0 | 12 | — | |
| Sprint 1 | 13 | — | |
| Sprint 2 | 14 | — | |
| Sprint 3 | 14 | — | |
| Sprint 4 | 14 | — | |
| Sprint 5 | 18 | — | |

---

*Next: Market Analysis → `03-market-analysis.md`*
