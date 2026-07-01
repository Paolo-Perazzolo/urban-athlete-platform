# Supabase Database Setup

## Environment Strategy (Current, Simplified)

For now, use one Supabase project (`main`) shared by both Git branches (`dev` and `main`).

This reduces setup complexity for the first deployment phase. A dedicated dev/prod split can be introduced later.

## Step 1: Run Initial Schema

1. Go to your Supabase project dashboard (`main`)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy/paste the contents of `migrations/001_initial_schema.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)

This creates all core tables: profiles, spots, reviews, exercises, training_plans, xp_events.

## Step 2: Seed Exercise Database

1. In the same SQL Editor
2. Click **New Query**
3. Copy/paste the contents of `seed/exercises_seed.sql`
4. Click **Run**

This adds 15 foundational calisthenics exercises with full metadata.

## SQL Safety Rules

1. Treat SQL files in `app/supabase/migrations` as source of truth.
2. Avoid ad-hoc SQL changes not captured in migration files.
3. Before applying risky SQL, take a backup/export snapshot from Supabase.

## Verify It Worked

Run this query to see all exercises:

```sql
SELECT 
  name,
  name_it,
  difficulty,
  muscle_groups,
  equipment_needed,
  default_sets,
  default_reps
FROM exercises
ORDER BY difficulty, name;
```

You should see 15 exercises sorted by difficulty level.

Run this verification after each migration/seed update.

## Exercise Database Summary

| Difficulty | Count | Examples |
|---|---|---|
| 1 (Beginner) | 4 | Incline Push-Ups, Australian Pull-Ups, Bodyweight Squats, Plank |
| 2 (Intermediate) | 7 | Standard Push-Ups, Pull-Ups, Pike Push-Ups, Dips, Bulgarian Split Squats |
| 3 (Advanced) | 2 | Diamond Push-Ups, Hanging Leg Raises |
| 4 (Elite) | 2 | Weighted Pull-Ups, Pistol Squats, L-Sit |

## Progression Chains

The exercises are linked with `progression_from` and `progression_to`:

**Push progression:**
Incline Push-Ups → Standard Push-Ups → Diamond Push-Ups

**Pull progression:**
Australian Pull-Ups → Pull-Ups → Weighted Pull-Ups

**Legs progression:**
Bodyweight Squats → Bulgarian Split Squats → Pistol Squats

## Next Steps

Once the exercise database is populated, the training plan algorithm can:
1. Filter exercises by user's experience level
2. Match equipment available at the spot
3. Balance muscle groups across the week
4. Create progressive overload by suggesting harder variations

No AI API calls needed at runtime — everything is deterministic and instant!
