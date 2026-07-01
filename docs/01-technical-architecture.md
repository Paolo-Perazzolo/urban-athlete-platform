# Technical Architecture — Urban Athlete Platform

> **Version:** 0.2 · **Date:** 2025-06-25  
> **Context:** Solo founder, near-zero budget, keep it simple

---

## 1. Stack Selection — Keep It Simple

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | SvelteKit + Tailwind CSS | Fast, lightweight, SSR built-in, great for solo dev |
| **Backend/DB/Auth/Storage** | Supabase (free tier) | All-in-one: PostgreSQL + Auth + File Storage + API. 500 MB DB, 1 GB storage, 50K MAU |
| **Maps** | Leaflet + OpenStreetMap | Free, no API key, open source |
| **Analytics** | PostHog Cloud (free tier) | 1M events/month, funnels, retention — plenty for POC |
| **Hosting** | Vercel (free tier) | Auto-deploy from GitHub, edge CDN, zero config |
| **PM Tool** | Notion | Simple boards, docs, solo-friendly |

### What About Hostinger?

You have a **Business Web Hosting** subscription on Hostinger. Here's the honest evaluation:

| | Hostinger | Vercel (free) | Recommendation |
|---|---|---|---|
| **SvelteKit support** | ❌ No native Node.js runtime (shared hosting = PHP/MySQL) | ✅ Native SSR support | **Vercel** |
| **Static site hosting** | ✅ Can host pre-built static files | ✅ Better with CDN | Vercel |
| **Database** | MySQL only | — (use Supabase) | Supabase |
| **Domain + Email** | ✅ Free domain + email included | ❌ No email | **Hostinger for domain/email** |
| **SSL** | ✅ Free | ✅ Free | Tie |

**Decision:** Use **Hostinger for your domain name and email** (you@yourdomain.com). Use **Vercel for hosting the app** (point your Hostinger domain to Vercel). Best of both worlds, €0 extra cost.

### Monthly Cost

| Item | Cost |
|---|---|
| App hosting (Vercel free) | €0 |
| Database + Auth + Storage (Supabase free) | €0 |
| Analytics (PostHog free) | €0 |
| Domain + email (Hostinger — already paying) | €0 extra |
| AI for exercise DB generation (one-time) | ~€1-2 total |
| **Total** | **~€0/month** |

## 2. Architecture — One Diagram, That's It

```
┌────────────────────────────────┐
│     USER (Browser / PWA)       │
│     SvelteKit App on Vercel    │
└───────┬──────────┬─────────────┘
        │          │
  ┌─────▼────┐  ┌──▼───────────┐
  │ Supabase │  │   PostHog    │
  │ (all-in  │  │  (analytics) │
  │  -one)   │  └──────────────┘
  │          │
  │ • Auth   │
  │ • DB     │
  │ • Storage│
  └──────────┘
```

That's it. Three services total: **Vercel + Supabase + PostHog.**

No edge functions, no separate email service, no CI/CD pipeline needed for POC. Vercel auto-deploys when you push to GitHub.

### Environment Strategy (Current, Simplified)

For the first deploy phase, use a single Supabase project (`main`) for both Git branches:

| Git branch | Vercel behavior | Supabase project | Purpose |
|---|---|---|---|
| `dev` | Not auto-deployed to production | `main` | Development and testing |
| `main` | Auto-deployed to production | `main` | Live release |

This keeps setup simple while the platform is still early-stage. Environment separation can be introduced later.

#### Environment variables

Use the same values for:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If Vercel Preview/Development environments are enabled, keep them mapped to the same Supabase project for now.

#### SQL safety rule

1. Keep SQL files in `app/supabase/migrations` as source of truth.
2. Test SQL changes carefully before applying to the live project.
3. Avoid ad-hoc SQL changes that are not captured in migration files.

### Product Scope Note (Current Phase)

Authentication and profile UX are temporarily out of scope.

Current live scope focuses on:
- Spots discovery
- Deterministic training plan generation

Auth/profile flows and related UI will be reintroduced in a later phase.

## 3. Data Model

```sql
-- User profiles (linked to Supabase auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE,
  display_name TEXT,
  city TEXT CHECK (city IN ('trieste', 'milan')),
  age INTEGER,
  gender TEXT,
  height_cm INTEGER,
  experience_level TEXT DEFAULT 'beginner',  -- beginner, intermediate, advanced
  training_days_per_week INTEGER DEFAULT 3,
  training_goal TEXT,  -- strength, endurance, skills, general
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training spots
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL CHECK (city IN ('trieste', 'milan')),
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  equipment TEXT[],  -- ['pull_up_bar', 'parallel_bars', 'rings', ...]
  avg_rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spot photos (max 5 per spot)
CREATE TABLE spot_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spot reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(spot_id, user_id)
);

-- Exercise database (AI-generated once, then static)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_it TEXT,                    -- Italian name
  description TEXT,
  muscle_groups TEXT[],            -- ['chest', 'triceps', 'shoulders']
  equipment_needed TEXT[],         -- ['pull_up_bar'] or [] for no equipment
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),  -- 1=beginner, 5=elite
  exercise_type TEXT,              -- 'strength', 'endurance', 'skill', 'mobility'
  default_sets INTEGER,
  default_reps TEXT,               -- '8-12' or '30s' for timed exercises
  default_rest_seconds INTEGER,
  progression_from UUID REFERENCES exercises(id),  -- easier version
  progression_to UUID REFERENCES exercises(id),    -- harder version
  video_url TEXT,                  -- optional YouTube/demo link
  tips TEXT
);

-- Generated training plans
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  plan_data JSONB NOT NULL,        -- structured weekly plan
  equipment_available TEXT[],      -- what equipment was available
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP events
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL,
  xp_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 4. Training Plan Engine (No Per-Request AI Costs)

### How it works

```
STEP 1 (one-time, during development):
  AI generates ~200-300 exercises with full metadata
  → stored in the 'exercises' table
  → this is a fixed cost (~€1-2 total)

STEP 2 (at runtime, when user asks for a plan):
  Algorithm reads user profile:
    - experience_level, training_days_per_week, training_goal
    - age, gender (for intensity adjustments)
  Algorithm reads spot equipment:
    - What's available at their preferred spot
  Algorithm filters & combines exercises:
    - Match equipment_needed to available equipment
    - Match difficulty to user level
    - Balance muscle groups across the week
    - Respect training_goal (more pull exercises for strength, etc.)
  → Output: structured weekly plan (JSON)
  → No AI API call needed. Instant. Free. Consistent.
```

### Why this is better than calling AI every time
- **€0 runtime cost** — no API calls per plan
- **Instant** — algorithm runs in milliseconds
- **Consistent** — same inputs = same plan (reproducible)
- **Offline-capable** — works without internet
- **Controllable** — you can tune the algorithm, not hope the AI gets it right
- **Scalable** — 1 user or 100K users, same cost

### Exercise metadata example
```json
{
  "name": "Australian Pull-ups",
  "name_it": "Trazioni australiane",
  "muscle_groups": ["back", "biceps"],
  "equipment_needed": ["low_bar"],
  "difficulty": 2,
  "exercise_type": "strength",
  "default_sets": 3,
  "default_reps": "8-12",
  "default_rest_seconds": 60,
  "progression_from": "<id of bodyweight rows>",
  "progression_to": "<id of pull-ups>",
  "tips": "Keep body straight, pull chest to bar"
}
```

## 5. Image Strategy

| Rule | Detail |
|---|---|
| Max photos per spot | 5 |
| Max file size | 2 MB (compress client-side before upload) |
| Format | WebP preferred |
| Resize | Max 1200px width |
| Storage budget | 1 GB free (Supabase) → ~500 photos → plenty for POC |

## 6. Analytics (PostHog)

Key events to track:

| Event | Why |
|---|---|
| `session_started` | Acquisition in no-auth phase |
| `spot_viewed` | Are people using the map? |
| `spot_added` | Are users contributing content? |
| `review_submitted` | Content quality signal |
| `plan_generated` | Is the training feature useful? |
| `workout_completed` | Retention signal |
| `leaderboard_viewed` | Is gamification working? |

Auth-specific events (`signup`, `login`, `profile_created`) are deferred until auth/profile flows return.

Keep it simple — add more events later based on what questions you need answered.

## 7. Auth Flow

Auth is currently disabled in the active product scope.

When reintroduced, Supabase Auth will handle JWT, sessions, password reset, and OAuth.

## 8. What You DON'T Need Yet

Things that are tempting but would slow you down:

- ❌ CI/CD pipeline (just push to main, Vercel auto-deploys)
- ❌ Edge functions (regular API routes are fine)
- ❌ Email service (Supabase handles auth emails)
- ❌ Separate CDN (Supabase Storage + Vercel CDN are enough)
- ❌ Monitoring/alerting (PostHog + Vercel logs are enough)
- ❌ Microservices (it's one app, keep it monolithic)
- ❌ Native app (PWA gives you "add to home screen" for free)

---

*Next: Agile Backlog → `02-agile-backlog.md`*
