# System Architecture & Data Flow

**Version:** 0.1  
**Last Updated:** 2025-06-25  
**Status:** Sprint 0 Complete

---

## System Overview

The Urban Athlete Platform is a three-tier web application with frontend (SvelteKit), backend (Supabase), and database (PostgreSQL).

---

## Architecture Diagram

```mermaid
graph TB
    subgraph "User Devices"
        U1[Web Browser]
        U2[Mobile Browser PWA]
    end

    subgraph "Frontend - Vercel"
        FE[SvelteKit App<br/>Port: 5173 local<br/>Vercel in production]
        
        subgraph "Pages"
            HOME[Home Page<br/>Landing]
            SPOTS[Spots Map<br/>Leaflet + OSM]
            AUTH[Auth Pages<br/>Login/Signup]
            PROFILE[User Profile<br/>Stats & Settings]
            PLANS[Training Plans<br/>Algorithm-generated]
        end
        
        subgraph "Components"
            ATOMS[Atoms<br/>Button, Card, Input]
            MOLS[Molecules<br/>SpotCard, SearchBar]
            ORGS[Organisms<br/>Nav, Footer, SpotList]
        end
        
        CONTENT[Content JSON<br/>home.json, spots.json]
    end

    subgraph "Backend - Supabase"
        API[Supabase Client<br/>REST API + Realtime]
        AUTH_SVC[Auth Service<br/>JWT tokens]
        STORAGE[Storage<br/>Spot photos]
        
        subgraph "Database - PostgreSQL"
            DB[(PostgreSQL)]
            
            T_PROFILES[profiles<br/>User data]
            T_SPOTS[spots<br/>Training locations]
            T_PHOTOS[spot_photos<br/>Images]
            T_REVIEWS[reviews<br/>Ratings & comments]
            T_EXERCISES[exercises<br/>15 exercises loaded]
            T_PLANS[training_plans<br/>User workout plans]
            T_XP[xp_events<br/>Gamification]
        end
        
        RLS[Row Level Security<br/>Access control]
    end

    subgraph "Analytics"
        POSTHOG[PostHog<br/>Event tracking]
    end

    subgraph "External Services"
        OSM[OpenStreetMap<br/>Map tiles]
    end

    %% User interactions
    U1 --> FE
    U2 --> FE
    
    %% Frontend routing
    FE --> HOME
    FE --> SPOTS
    FE --> AUTH
    FE --> PROFILE
    FE --> PLANS
    
    %% Component hierarchy
    HOME --> ORGS
    SPOTS --> ORGS
    ORGS --> MOLS
    MOLS --> ATOMS
    
    %% Content system
    CONTENT -.->|JSON data| HOME
    CONTENT -.->|JSON data| SPOTS
    
    %% Frontend to Backend
    FE -->|HTTP/WebSocket| API
    AUTH -->|Login/Signup| AUTH_SVC
    SPOTS -->|Upload photos| STORAGE
    
    %% Backend to Database
    API --> DB
    AUTH_SVC --> T_PROFILES
    API --> T_SPOTS
    API --> T_PHOTOS
    API --> T_REVIEWS
    API --> T_EXERCISES
    API --> T_PLANS
    API --> T_XP
    
    %% Security
    RLS -.->|Enforces| DB
    
    %% Analytics
    FE -->|Events| POSTHOG
    
    %% External
    SPOTS -->|Map tiles| OSM

    style FE fill:#1890ff,color:#fff
    style API fill:#3ecf8e,color:#fff
    style DB fill:#ff6b6b,color:#fff
    style POSTHOG fill:#ffa500,color:#fff
```

---

## Data Flow Examples

### 1. User Views Training Spots

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant SvelteKit
    participant Supabase
    participant PostgreSQL
    participant OSM

    User->>Browser: Navigate to /spots
    Browser->>SvelteKit: GET /spots
    SvelteKit->>Supabase: Query spots by city
    Supabase->>PostgreSQL: SELECT * FROM spots WHERE city='trieste'
    PostgreSQL-->>Supabase: Return spot data
    Supabase-->>SvelteKit: JSON response
    SvelteKit->>OSM: Request map tiles
    OSM-->>SvelteKit: Map tiles
    SvelteKit-->>Browser: Render spots on map
    Browser-->>User: Display interactive map
```

### 2. User Adds a Review

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant SvelteKit
    participant Supabase
    participant PostgreSQL

    User->>Browser: Submit review (rating + comment)
    Browser->>SvelteKit: POST review data
    SvelteKit->>Supabase: Insert review
    Supabase->>PostgreSQL: Check RLS policy
    PostgreSQL->>PostgreSQL: Verify user is authenticated
    PostgreSQL->>PostgreSQL: INSERT INTO reviews
    PostgreSQL->>PostgreSQL: Trigger: update_spot_rating()
    PostgreSQL->>PostgreSQL: UPDATE spots SET avg_rating
    PostgreSQL-->>Supabase: Success + XP event
    Supabase-->>SvelteKit: Review created
    SvelteKit->>Supabase: Insert XP event (+10 XP)
    Supabase->>PostgreSQL: INSERT INTO xp_events
    PostgreSQL->>PostgreSQL: Trigger: update_user_level()
    PostgreSQL-->>Supabase: User leveled up!
    Supabase-->>SvelteKit: Success
    SvelteKit-->>Browser: Show success + new level
    Browser-->>User: "Review added! +10 XP, Level 2!"
```

### 3. Generate Training Plan (Algorithm)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant SvelteKit
    participant Algorithm
    participant Supabase
    participant PostgreSQL

    User->>Browser: Request training plan
    Browser->>SvelteKit: POST /api/generate-plan<br/>{spot_id, user_profile}
    SvelteKit->>Supabase: Get spot equipment
    Supabase->>PostgreSQL: SELECT equipment FROM spots
    PostgreSQL-->>Supabase: ['pull_up_bar', 'parallel_bars']
    Supabase-->>SvelteKit: Equipment list
    SvelteKit->>Supabase: Get user profile
    Supabase->>PostgreSQL: SELECT * FROM profiles
    PostgreSQL-->>Supabase: {level: 'intermediate', goal: 'strength'}
    Supabase-->>SvelteKit: User data
    SvelteKit->>Supabase: Get matching exercises
    Supabase->>PostgreSQL: SELECT * FROM exercises<br/>WHERE difficulty <= 2<br/>AND equipment IN (...)
    PostgreSQL-->>Supabase: 8 matching exercises
    Supabase-->>SvelteKit: Exercise list
    SvelteKit->>Algorithm: Generate plan<br/>(deterministic, no AI)
    Algorithm->>Algorithm: Balance muscle groups<br/>3 days/week<br/>Progressive overload
    Algorithm-->>SvelteKit: Weekly plan JSON
    SvelteKit->>Supabase: Save training plan
    Supabase->>PostgreSQL: INSERT INTO training_plans
    PostgreSQL-->>Supabase: Success
    Supabase-->>SvelteKit: Plan saved
    SvelteKit-->>Browser: Return plan
    Browser-->>User: Display weekly workout
```

### 4. Registration & Profile Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant SvelteKit
    participant SupabaseAuth as Supabase Auth (GoTrue)
    participant AuthUsers as auth.users
    participant Trigger as public.handle_new_user()
    participant Profiles as public.profiles
    participant RLS as RLS Policy Engine

    User->>Browser: Submit signup form (email, password, profile fields)
    Browser->>SvelteKit: signup(formData)
    SvelteKit->>SupabaseAuth: auth.signUp({ email, password, options.data })

    SupabaseAuth->>AuthUsers: INSERT new auth user + raw_user_meta_data
    AuthUsers->>Trigger: AFTER INSERT trigger fires
    Trigger->>Profiles: INSERT profile row (id = auth.users.id, mapped metadata)
    Profiles->>RLS: Validate trigger write under SECURITY DEFINER context
    RLS-->>Profiles: Allowed

    SupabaseAuth-->>SvelteKit: Return session/user

    opt Client-side profile sync/update (defensive)
        SvelteKit->>Profiles: INSERT or UPDATE own profile fields
        Profiles->>RLS: Check policy (auth.uid() = id)
        alt Insert policy exists
            RLS-->>Profiles: Allowed
            Profiles-->>SvelteKit: Success
        else Insert policy missing
            RLS-->>Profiles: Denied
            Profiles-->>SvelteKit: 403 Forbidden
        end
    end

    SvelteKit-->>Browser: Signup result (success or error)
    Browser-->>User: Redirect to app or show error
```

Expected behavior:
- `auth.users` is the source of identity, and `public.profiles` stores app-specific user fields.
- `public.handle_new_user()` should auto-create the profile row immediately after signup.
- Client-side profile insert/update must pass RLS (`auth.uid() = id`) and needs explicit `INSERT` policy for inserts.
- If `INSERT` policy is missing, profile writes return `403 Forbidden` even for authenticated users.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | SvelteKit 2 | Web framework (SSR + SPA) |
| | Tailwind CSS 3 | Styling (utility-first) |
| | Leaflet | Interactive maps |
| | Lucide Icons | Icon library |
| **Backend** | Supabase | All-in-one backend |
| | PostgreSQL | Database |
| | PostgREST | Auto-generated REST API |
| | GoTrue | Authentication (JWT) |
| | Realtime | WebSocket subscriptions |
| **Storage** | Supabase Storage | Image hosting (spot photos) |
| **Analytics** | PostHog | Event tracking, funnels |
| **Hosting** | Vercel | Frontend deployment |
| | Supabase Cloud | Backend + DB hosting |
| **Domain** | Hostinger | Domain name + email |

---

## Database Schema (Summary)

```mermaid
erDiagram
    PROFILES ||--o{ SPOTS : creates
    PROFILES ||--o{ REVIEWS : writes
    PROFILES ||--o{ XP_EVENTS : earns
    PROFILES ||--o{ TRAINING_PLANS : has
    
    SPOTS ||--o{ SPOT_PHOTOS : has
    SPOTS ||--o{ REVIEWS : receives
    
    EXERCISES ||--o{ EXERCISES : progression_from
    EXERCISES ||--o{ EXERCISES : progression_to

    PROFILES {
        uuid id PK
        text username
        text city
        int experience_level
        int total_xp
        int level
    }

    SPOTS {
        uuid id PK
        text name
        text city
        decimal latitude
        decimal longitude
        text[] equipment
        decimal avg_rating
    }

    EXERCISES {
        uuid id PK
        text name
        text[] muscle_groups
        text[] equipment_needed
        int difficulty
        int default_sets
        text default_reps
    }

    REVIEWS {
        uuid id PK
        uuid spot_id FK
        uuid user_id FK
        int rating
        text comment
    }

    XP_EVENTS {
        uuid id PK
        uuid user_id FK
        text event_type
        int xp_amount
    }

    TRAINING_PLANS {
        uuid id PK
        uuid user_id FK
        jsonb plan_data
        text[] equipment_available
    }
```

---

## Security Model

### Row Level Security (RLS)

All tables have RLS enabled with specific policies:

| Table | Read | Write |
|---|---|---|
| **profiles** | Everyone | Own profile only |
| **spots** | Everyone | Authenticated users |
| **reviews** | Everyone | Own reviews only |
| **exercises** | Everyone | Admin only (read-only for users) |
| **training_plans** | Own plans only | Own plans only |
| **xp_events** | Own events only | System only |

### Authentication Flow

1. User signs up → Supabase creates `auth.users` entry
2. Trigger creates `profiles` entry with same UUID
3. JWT token issued (expires in 1 hour)
4. Token included in all API requests
5. RLS policies enforce access control

---

## Deployment Pipeline

```mermaid
graph LR
    DEV[dev branch<br/>Daily work] -->|git push| GH_DEV[GitHub dev]
    GH_DEV -->|Auto-deploy| VERCEL_DEV[Vercel Preview<br/>urban-athlete-dev.vercel.app]
    
    DEV -->|git merge| MAIN[main branch<br/>Production-ready]
    MAIN -->|git push| GH_MAIN[GitHub main]
    GH_MAIN -->|Auto-deploy| VERCEL_PROD[Vercel Production<br/>urbanathlete.com]
    
    VERCEL_DEV -.->|Test| DEV
    VERCEL_PROD -->|Live| USERS[Users]

    style DEV fill:#ffa500
    style MAIN fill:#52c41a
    style VERCEL_PROD fill:#1890ff,color:#fff
```

---

## Current Status (Sprint 0 Complete)

### ✅ Completed
- [x] Project setup (Git, GitHub, branches)
- [x] SvelteKit app scaffold
- [x] Design system (Tailwind config)
- [x] Atomic component structure
- [x] Content system (JSON-based)
- [x] Home page (landing)
- [x] Supabase project created
- [x] Database schema (all tables)
- [x] Exercise database (15 exercises)
- [x] Git workflow (dev/main branches)
- [x] Documentation complete

### 🔜 Next (Sprint 1)
- [ ] Authentication (login/signup)
- [ ] Navigation component
- [ ] Spots map page (Leaflet)
- [ ] Add spot form
- [ ] Deploy to Vercel

---

## Environment Variables

Required in `.env` (local) and Vercel (production):

```bash
# Supabase
VITE_SUPABASE_URL=https://uidvrhthkeqxwytangnt.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# PostHog (later)
VITE_POSTHOG_KEY=your_key_here
```

---

## Key Files & Locations

| Path | Purpose |
|---|---|
| `app/src/routes/+page.svelte` | Home page |
| `app/src/lib/components/` | Reusable components |
| `app/src/lib/content/` | JSON content files |
| `app/src/lib/utils/supabase.js` | Supabase client |
| `app/supabase/migrations/` | Database schema SQL |
| `app/supabase/seed/` | Exercise data SQL |
| `docs/` | All documentation |
| `.windsurf/workflows/` | Development workflows |

---

## Quick Start (For Next Session)

```bash
# 1. Pull latest code
git checkout dev
git pull origin dev

# 2. Start dev server
cd app
npm run dev

# 3. Open browser
http://localhost:5173

# 4. Continue building Sprint 1 features
```

---

**Last updated:** 2025-06-25 17:05  
**Next milestone:** Deploy to Vercel + Start Sprint 1
