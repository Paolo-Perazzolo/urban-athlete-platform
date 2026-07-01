# Product Brief — Urban Athlete Platform

> **Version:** 0.2 · **Date:** 2025-06-25 · **Author:** Solo Founder + AI  
> **Status:** Draft — simplified for solo founder  
> **PM Tool:** Notion (simple boards, no heavy processes)

---

## 1. Vision

**Become the go-to local platform where outdoor/calisthenics athletes discover training spots, follow gamified training plans, and compete in city-based leaderboards — starting from Trieste and Milan.**

## 2. Problem Statement

| Pain Point | Who Feels It |
|---|---|
| Hard to find quality outdoor training spots (pull-up bars, parallel bars, parks) with reliable info and photos | All outdoor athletes |
| No structured progression system for outdoor bodyweight training that keeps people motivated long-term | Intermediate athletes who plateau |
| Existing apps are global/generic — no local community feel, no city-based competition | Athletes who train in the same parks |
| Free training lacks accountability — easy to skip sessions with no social pressure | Beginners and inconsistent trainers |

## 3. Target Users (Personas)

### Persona 1 — "Marco, The Park Regular" (Primary)
- **Age:** 22-35, Male (80% of calisthenics community)
- **Location:** Milan or Trieste
- **Behavior:** Trains 3-5x/week outdoors, already knows some spots, wants to find new ones and connect with local athletes
- **Motivation:** Progression, community recognition, friendly competition
- **Tech:** Smartphone-first, uses Instagram for fitness content

### Persona 2 — "Sara, The Curious Beginner"
- **Age:** 20-30, any gender
- **Location:** Milan (early adopter city)
- **Behavior:** Wants to start calisthenics but doesn't know where to go or what to do
- **Motivation:** Clear guidance, welcoming community, visible progress
- **Tech:** Smartphone-first, low patience for complex UIs

### Persona 3 — "Luca, The Community Leader"
- **Age:** 25-40
- **Behavior:** Organizes local workout sessions, wants a platform to grow his community
- **Motivation:** Influence, recognition, tools to manage groups
- **Tech:** Power user, willing to contribute content

## 4. Value Proposition

> **"Find your spot. Follow your plan. Climb the ranks."**

A free, hyper-local platform that combines:
1. **Spot Discovery** — Crowd-sourced map of outdoor training areas with photos and reviews
2. **Smart Training Plans** — AI-suggested workout progressions based on your level and available equipment at your spot
3. **City Gamification** — XP, streaks, city leaderboards, badges → compete with your city

### Key Differentiators vs Competitors

| Feature | Calisthenics-Parks.com | Zelos | Ascendix | CaliQuest | **Our Platform** |
|---|---|---|---|---|---|
| Spot map with photos/reviews | ✅ (global, community) | ❌ | ❌ | ❌ | ✅ (hyper-local, curated) |
| Training plans | ❌ | ❌ | ✅ (AI) | ✅ (quests) | ✅ (AI + spot-aware) |
| Gamification/ranking | ❌ | ✅ (global Elo) | ✅ (XP/coins) | ✅ (skill tree) | ✅ (city-based leaderboard) |
| Local community focus | ❌ | ❌ | ❌ | ❌ | ✅ ← **unique angle** |
| Free, web-based (no app install) | ✅ (website) | ❌ (native app) | ❌ (native app) | ❌ (native app) | ✅ ← **lower friction** |

**Unique moat:** Hyper-local + web-first + spot-aware training plans. No one combines all three.

## 5. MVP Scope (MoSCoW)

### Must Have (POC — Sprint 0-2)
- [ ] Training spot listing (Trieste + Milan) with map view
- [ ] Add/view spot photos (max 3-5 per spot to control costs)
- [ ] Spot ratings and short reviews
- [ ] Anonymous/no-auth plan generation flow
- [ ] Analytics instrumentation (page views, actions, funnels)

### Should Have (Sprint 3-4)
- [ ] AI-generated training plan based on user level and spot equipment
- [ ] XP system: earn XP for check-ins, reviews, completing workouts
- [ ] City leaderboard (Trieste vs Milan)
- [ ] Streak tracking (consecutive training days)
- [ ] Push notifications (web) for streak reminders

### Could Have (Sprint 5+)
- [ ] Badges and achievements system
- [ ] Social features (follow athletes, activity feed)
- [ ] Community events/meetups board
- [ ] Workout logging and progress tracking
- [ ] Spot "check-in" with optional GPS verification

### Won't Have (for now)
- User registration/login and profile UX (deferred to post-MVP)
- Native mobile app (PWA instead)
- Video uploads
- Real-time chat
- E-commerce / premium subscriptions
- Cities beyond Trieste and Milan

## 6. Success Metrics (POC Phase)

| Metric | Target (3 months) | Tool |
|---|---|---|
| Unique visitors | 100+ | Analytics |
| Training spots listed | 20+ (10 per city) | Database |
| Weekly active users (WAU) | 30+ | Analytics |
| Avg. session duration | > 2 min | Analytics |
| Spot reviews submitted | 50+ | Database |
| Retention (week 1 → week 4) | > 25% | Analytics |
| Training plans generated | 50+ | Database |

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Cold start: no spots = no users | High | Seed 10 spots per city ourselves before launch |
| Low engagement after signup | High | Gamification + streak nudges + city competition |
| Hosting costs grow with photos | Medium | Compress images, limit 3-5 per spot, use free CDN tier |
| AI training plans are too generic | Medium | Start with template-based plans, iterate with user feedback |
| Privacy/GDPR compliance | Medium | Minimal data collection, clear consent, EU hosting |

---

*Next: Technical Architecture → `01-technical-architecture.md`*
