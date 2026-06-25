-- EXERCISE DATABASE SEED
-- 15 foundational calisthenics exercises with full metadata
-- Run this after the initial schema migration

-- ============================================================================
-- PUSH EXERCISES (Chest, Shoulders, Triceps)
-- ============================================================================

-- 1. INCLINE PUSH-UPS (Beginner)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_to, tips
) VALUES (
  'Incline Push-Ups',
  'Piegamenti Inclinati',
  'Push-ups with hands elevated on a bench or bar. Easier than standard push-ups, perfect for building initial strength.',
  ARRAY['chest', 'triceps', 'shoulders'],
  ARRAY['bench', 'low_bar'],
  1, -- Beginner
  'strength',
  3,
  '8-12',
  90,
  NULL, -- Will link after creating standard push-ups
  'Keep core tight, elbows at 45° angle. The higher the hands, the easier the exercise.'
);

-- 2. STANDARD PUSH-UPS (Intermediate)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_from, progression_to, tips
) VALUES (
  'Standard Push-Ups',
  'Piegamenti Standard',
  'Classic push-up with hands on the ground, body in straight line from head to heels.',
  ARRAY['chest', 'triceps', 'shoulders', 'core'],
  ARRAY[]::TEXT[], -- No equipment needed
  2, -- Intermediate
  'strength',
  3,
  '10-15',
  75,
  (SELECT id FROM exercises WHERE name = 'Incline Push-Ups'),
  NULL, -- Will link to diamond push-ups
  'Full range of motion: chest touches ground. Keep body straight, no sagging hips.'
);

-- Update incline push-ups progression
UPDATE exercises 
SET progression_to = (SELECT id FROM exercises WHERE name = 'Standard Push-Ups')
WHERE name = 'Incline Push-Ups';

-- 3. DIAMOND PUSH-UPS (Advanced)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_from, tips
) VALUES (
  'Diamond Push-Ups',
  'Piegamenti Diamante',
  'Push-ups with hands close together forming a diamond shape. Intense triceps focus.',
  ARRAY['triceps', 'chest', 'shoulders'],
  ARRAY[]::TEXT[],
  3, -- Advanced
  'strength',
  3,
  '6-10',
  90,
  (SELECT id FROM exercises WHERE name = 'Standard Push-Ups'),
  'Thumbs and index fingers touch to form diamond. Elbows stay close to body.'
);

-- Update standard push-ups progression
UPDATE exercises 
SET progression_to = (SELECT id FROM exercises WHERE name = 'Diamond Push-Ups')
WHERE name = 'Standard Push-Ups';

-- 4. PIKE PUSH-UPS (Intermediate - Shoulder focus)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  tips
) VALUES (
  'Pike Push-Ups',
  'Piegamenti Pike',
  'Push-ups with hips raised high, forming an inverted V. Builds shoulder strength for handstand push-ups.',
  ARRAY['shoulders', 'triceps', 'upper_chest'],
  ARRAY[]::TEXT[],
  2, -- Intermediate
  'strength',
  3,
  '8-12',
  90,
  'Hips high, head between arms. Lower until head nearly touches ground.'
);

-- 5. PARALLEL BAR DIPS (Intermediate)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  tips
) VALUES (
  'Parallel Bar Dips',
  'Dip alle Parallele',
  'Lower and raise body between parallel bars. Upright torso = triceps focus, forward lean = chest focus.',
  ARRAY['triceps', 'chest', 'shoulders'],
  ARRAY['parallel_bars', 'dip_station'],
  2, -- Intermediate
  'strength',
  3,
  '8-12',
  90,
  'Full range: upper arms parallel to ground. Keep shoulders down and back.'
);

-- ============================================================================
-- PULL EXERCISES (Back, Biceps)
-- ============================================================================

-- 6. AUSTRALIAN PULL-UPS / INVERTED ROWS (Beginner)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_to, tips
) VALUES (
  'Australian Pull-Ups',
  'Trazioni Australiane',
  'Horizontal pull-ups with feet on ground, body under a low bar. Perfect for building pulling strength.',
  ARRAY['back', 'biceps', 'rear_shoulders'],
  ARRAY['low_bar', 'rings'],
  1, -- Beginner
  'strength',
  3,
  '8-12',
  90,
  NULL, -- Will link to pull-ups
  'Body straight, pull chest to bar. Lower the bar or elevate feet to increase difficulty.'
);

-- 7. PULL-UPS (Intermediate)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_from, progression_to, tips
) VALUES (
  'Pull-Ups',
  'Trazioni alla Sbarra',
  'Classic pull-up: hang from bar, pull chin over bar. The king of back exercises.',
  ARRAY['back', 'biceps', 'forearms'],
  ARRAY['pull_up_bar'],
  2, -- Intermediate
  'strength',
  3,
  '5-10',
  120,
  (SELECT id FROM exercises WHERE name = 'Australian Pull-Ups'),
  NULL, -- Will link to weighted pull-ups
  'Dead hang start, full extension. Pull until chin clears bar. Control the descent.'
);

-- Update Australian pull-ups progression
UPDATE exercises 
SET progression_to = (SELECT id FROM exercises WHERE name = 'Pull-Ups')
WHERE name = 'Australian Pull-Ups';

-- 8. CHIN-UPS (Intermediate)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  tips
) VALUES (
  'Chin-Ups',
  'Trazioni Supine',
  'Pull-ups with palms facing you (supinated grip). Slightly easier than pull-ups, more biceps activation.',
  ARRAY['back', 'biceps', 'forearms'],
  ARRAY['pull_up_bar'],
  2, -- Intermediate
  'strength',
  3,
  '6-10',
  120,
  'Palms face you, shoulder-width grip. Great for building bicep strength.'
);

-- 9. WEIGHTED PULL-UPS (Advanced)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_from, tips
) VALUES (
  'Weighted Pull-Ups',
  'Trazioni Zavorate',
  'Pull-ups with added weight (belt, vest, or dumbbell between feet). For advanced strength building.',
  ARRAY['back', 'biceps', 'forearms'],
  ARRAY['pull_up_bar', 'weight_belt'],
  4, -- Advanced
  'strength',
  3,
  '3-6',
  180,
  (SELECT id FROM exercises WHERE name = 'Pull-Ups'),
  'Start with 5-10kg. Progress slowly. Maintain perfect form.'
);

-- Update pull-ups progression
UPDATE exercises 
SET progression_to = (SELECT id FROM exercises WHERE name = 'Weighted Pull-Ups')
WHERE name = 'Pull-Ups';

-- ============================================================================
-- LEG EXERCISES
-- ============================================================================

-- 10. BODYWEIGHT SQUATS (Beginner)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_to, tips
) VALUES (
  'Bodyweight Squats',
  'Squat a Corpo Libero',
  'Basic squat: feet shoulder-width, lower hips until thighs parallel to ground.',
  ARRAY['quads', 'glutes', 'hamstrings'],
  ARRAY[]::TEXT[],
  1, -- Beginner
  'strength',
  3,
  '15-20',
  60,
  NULL, -- Will link to Bulgarian split squats
  'Chest up, knees track over toes. Full depth if mobility allows.'
);

-- 11. BULGARIAN SPLIT SQUATS (Intermediate)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_from, progression_to, tips
) VALUES (
  'Bulgarian Split Squats',
  'Squat Bulgaro',
  'Single-leg squat with rear foot elevated on bench. Builds unilateral leg strength.',
  ARRAY['quads', 'glutes', 'hamstrings'],
  ARRAY['bench'],
  2, -- Intermediate
  'strength',
  3,
  '8-12 per leg',
  75,
  (SELECT id FROM exercises WHERE name = 'Bodyweight Squats'),
  NULL, -- Will link to pistol squats
  'Front knee stays behind toes. Keep torso upright. Balance challenge!'
);

-- Update bodyweight squats progression
UPDATE exercises 
SET progression_to = (SELECT id FROM exercises WHERE name = 'Bulgarian Split Squats')
WHERE name = 'Bodyweight Squats';

-- 12. PISTOL SQUATS (Advanced)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  progression_from, tips
) VALUES (
  'Pistol Squats',
  'Squat a Una Gamba',
  'Single-leg squat with other leg extended forward. Elite leg strength and balance.',
  ARRAY['quads', 'glutes', 'hamstrings', 'core'],
  ARRAY[]::TEXT[],
  4, -- Advanced
  'strength',
  3,
  '3-6 per leg',
  120,
  (SELECT id FROM exercises WHERE name = 'Bulgarian Split Squats'),
  'Use support (pole/TRX) when learning. Requires ankle mobility and balance.'
);

-- Update Bulgarian split squats progression
UPDATE exercises 
SET progression_to = (SELECT id FROM exercises WHERE name = 'Pistol Squats')
WHERE name = 'Bulgarian Split Squats';

-- ============================================================================
-- CORE EXERCISES
-- ============================================================================

-- 13. PLANK (Beginner)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  tips
) VALUES (
  'Plank',
  'Plank',
  'Hold body in straight line on forearms and toes. Core endurance builder.',
  ARRAY['core', 'shoulders'],
  ARRAY[]::TEXT[],
  1, -- Beginner
  'endurance',
  3,
  '30-60s',
  60,
  'Body straight from head to heels. Squeeze glutes, brace core. Breathe normally.'
);

-- 14. HANGING LEG RAISES (Intermediate)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  tips
) VALUES (
  'Hanging Leg Raises',
  'Sollevamenti Gambe Appesi',
  'Hang from bar, raise legs to horizontal (or higher). Intense core and hip flexor work.',
  ARRAY['core', 'hip_flexors'],
  ARRAY['pull_up_bar'],
  3, -- Advanced
  'strength',
  3,
  '8-12',
  90,
  'Control the swing. Start with knees bent if needed. Progress to straight legs.'
);

-- 15. L-SIT (Advanced)
INSERT INTO exercises (
  name, name_it, description,
  muscle_groups, equipment_needed, difficulty,
  exercise_type, default_sets, default_reps, default_rest_seconds,
  tips
) VALUES (
  'L-Sit',
  'L-Sit',
  'Hold body with legs extended horizontally while supporting on hands. Elite core strength.',
  ARRAY['core', 'hip_flexors', 'shoulders', 'triceps'],
  ARRAY['parallel_bars', 'parallettes'],
  4, -- Advanced
  'skill',
  3,
  '10-30s',
  90,
  'Shoulders depressed, legs locked straight. Start with tuck L-sit, progress to one leg, then full L-sit.'
);

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total: 15 exercises
-- Difficulty distribution:
--   Level 1 (Beginner): 4 exercises
--   Level 2 (Intermediate): 7 exercises
--   Level 3 (Advanced): 2 exercises
--   Level 4 (Elite): 2 exercises
-- 
-- Equipment needed:
--   No equipment: 6 exercises
--   Pull-up bar: 5 exercises
--   Parallel bars/dip station: 2 exercises
--   Low bar/rings: 2 exercises
--   Bench: 2 exercises
--   Weight belt: 1 exercise
--
-- Progression chains created:
--   Push: Incline → Standard → Diamond
--   Pull: Australian → Pull-Ups → Weighted
--   Legs: Bodyweight Squats → Bulgarian → Pistol
