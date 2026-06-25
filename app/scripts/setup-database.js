/**
 * Database Setup Script
 * Runs the initial schema migration and seeds the exercise database
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Supabase credentials from environment (try both with and without VITE_ prefix)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_ prefixed versions)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🚀 Running database migration...\n');

  try {
    // Read the migration file
    const migrationPath = join(__dirname, '../supabase/migrations/001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Note: Supabase JS client doesn't support running raw SQL directly
    // We need to use the REST API or run it manually in the dashboard
    console.log('⚠️  Cannot run SQL migrations directly via JS client.');
    console.log('📋 Please run the migration manually:');
    console.log('');
    console.log('1. Go to: https://supabase.com/dashboard/project/uidvrhthkeqxwytangnt/sql');
    console.log('2. Copy the contents of: app/supabase/migrations/001_initial_schema.sql');
    console.log('3. Paste and run in SQL Editor');
    console.log('');
    console.log('Then run this script again to seed the exercises.');
    console.log('');

    // Check if tables exist by trying to query
    const { data, error } = await supabase.from('exercises').select('count').limit(1);
    
    if (error) {
      if (error.message.includes('relation "exercises" does not exist')) {
        console.log('❌ Tables not created yet. Please run the migration first.');
        return false;
      }
      throw error;
    }

    console.log('✅ Tables exist! Ready to seed exercises.');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function seedExercises() {
  console.log('\n🌱 Seeding exercise database...\n');

  const exercises = [
    {
      name: 'Incline Push-Ups',
      name_it: 'Piegamenti Inclinati',
      description: 'Push-ups with hands elevated on a bench or bar. Easier than standard push-ups, perfect for building initial strength.',
      muscle_groups: ['chest', 'triceps', 'shoulders'],
      equipment_needed: ['bench', 'low_bar'],
      difficulty: 1,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '8-12',
      default_rest_seconds: 90,
      tips: 'Keep core tight, elbows at 45° angle. The higher the hands, the easier the exercise.'
    },
    {
      name: 'Standard Push-Ups',
      name_it: 'Piegamenti Standard',
      description: 'Classic push-up with hands on the ground, body in straight line from head to heels.',
      muscle_groups: ['chest', 'triceps', 'shoulders', 'core'],
      equipment_needed: [],
      difficulty: 2,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '10-15',
      default_rest_seconds: 75,
      tips: 'Full range of motion: chest touches ground. Keep body straight, no sagging hips.'
    },
    {
      name: 'Diamond Push-Ups',
      name_it: 'Piegamenti Diamante',
      description: 'Push-ups with hands close together forming a diamond shape. Intense triceps focus.',
      muscle_groups: ['triceps', 'chest', 'shoulders'],
      equipment_needed: [],
      difficulty: 3,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '6-10',
      default_rest_seconds: 90,
      tips: 'Thumbs and index fingers touch to form diamond. Elbows stay close to body.'
    },
    {
      name: 'Pike Push-Ups',
      name_it: 'Piegamenti Pike',
      description: 'Push-ups with hips raised high, forming an inverted V. Builds shoulder strength for handstand push-ups.',
      muscle_groups: ['shoulders', 'triceps', 'upper_chest'],
      equipment_needed: [],
      difficulty: 2,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '8-12',
      default_rest_seconds: 90,
      tips: 'Hips high, head between arms. Lower until head nearly touches ground.'
    },
    {
      name: 'Parallel Bar Dips',
      name_it: 'Dip alle Parallele',
      description: 'Lower and raise body between parallel bars. Upright torso = triceps focus, forward lean = chest focus.',
      muscle_groups: ['triceps', 'chest', 'shoulders'],
      equipment_needed: ['parallel_bars', 'dip_station'],
      difficulty: 2,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '8-12',
      default_rest_seconds: 90,
      tips: 'Full range: upper arms parallel to ground. Keep shoulders down and back.'
    },
    {
      name: 'Australian Pull-Ups',
      name_it: 'Trazioni Australiane',
      description: 'Horizontal pull-ups with feet on ground, body under a low bar. Perfect for building pulling strength.',
      muscle_groups: ['back', 'biceps', 'rear_shoulders'],
      equipment_needed: ['low_bar', 'rings'],
      difficulty: 1,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '8-12',
      default_rest_seconds: 90,
      tips: 'Body straight, pull chest to bar. Lower the bar or elevate feet to increase difficulty.'
    },
    {
      name: 'Pull-Ups',
      name_it: 'Trazioni alla Sbarra',
      description: 'Classic pull-up: hang from bar, pull chin over bar. The king of back exercises.',
      muscle_groups: ['back', 'biceps', 'forearms'],
      equipment_needed: ['pull_up_bar'],
      difficulty: 2,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '5-10',
      default_rest_seconds: 120,
      tips: 'Dead hang start, full extension. Pull until chin clears bar. Control the descent.'
    },
    {
      name: 'Chin-Ups',
      name_it: 'Trazioni Supine',
      description: 'Pull-ups with palms facing you (supinated grip). Slightly easier than pull-ups, more biceps activation.',
      muscle_groups: ['back', 'biceps', 'forearms'],
      equipment_needed: ['pull_up_bar'],
      difficulty: 2,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '6-10',
      default_rest_seconds: 120,
      tips: 'Palms face you, shoulder-width grip. Great for building bicep strength.'
    },
    {
      name: 'Weighted Pull-Ups',
      name_it: 'Trazioni Zavorate',
      description: 'Pull-ups with added weight (belt, vest, or dumbbell between feet). For advanced strength building.',
      muscle_groups: ['back', 'biceps', 'forearms'],
      equipment_needed: ['pull_up_bar', 'weight_belt'],
      difficulty: 4,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '3-6',
      default_rest_seconds: 180,
      tips: 'Start with 5-10kg. Progress slowly. Maintain perfect form.'
    },
    {
      name: 'Bodyweight Squats',
      name_it: 'Squat a Corpo Libero',
      description: 'Basic squat: feet shoulder-width, lower hips until thighs parallel to ground.',
      muscle_groups: ['quads', 'glutes', 'hamstrings'],
      equipment_needed: [],
      difficulty: 1,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '15-20',
      default_rest_seconds: 60,
      tips: 'Chest up, knees track over toes. Full depth if mobility allows.'
    },
    {
      name: 'Bulgarian Split Squats',
      name_it: 'Squat Bulgaro',
      description: 'Single-leg squat with rear foot elevated on bench. Builds unilateral leg strength.',
      muscle_groups: ['quads', 'glutes', 'hamstrings'],
      equipment_needed: ['bench'],
      difficulty: 2,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '8-12 per leg',
      default_rest_seconds: 75,
      tips: 'Front knee stays behind toes. Keep torso upright. Balance challenge!'
    },
    {
      name: 'Pistol Squats',
      name_it: 'Squat a Una Gamba',
      description: 'Single-leg squat with other leg extended forward. Elite leg strength and balance.',
      muscle_groups: ['quads', 'glutes', 'hamstrings', 'core'],
      equipment_needed: [],
      difficulty: 4,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '3-6 per leg',
      default_rest_seconds: 120,
      tips: 'Use support (pole/TRX) when learning. Requires ankle mobility and balance.'
    },
    {
      name: 'Plank',
      name_it: 'Plank',
      description: 'Hold body in straight line on forearms and toes. Core endurance builder.',
      muscle_groups: ['core', 'shoulders'],
      equipment_needed: [],
      difficulty: 1,
      exercise_type: 'endurance',
      default_sets: 3,
      default_reps: '30-60s',
      default_rest_seconds: 60,
      tips: 'Body straight from head to heels. Squeeze glutes, brace core. Breathe normally.'
    },
    {
      name: 'Hanging Leg Raises',
      name_it: 'Sollevamenti Gambe Appesi',
      description: 'Hang from bar, raise legs to horizontal (or higher). Intense core and hip flexor work.',
      muscle_groups: ['core', 'hip_flexors'],
      equipment_needed: ['pull_up_bar'],
      difficulty: 3,
      exercise_type: 'strength',
      default_sets: 3,
      default_reps: '8-12',
      default_rest_seconds: 90,
      tips: 'Control the swing. Start with knees bent if needed. Progress to straight legs.'
    },
    {
      name: 'L-Sit',
      name_it: 'L-Sit',
      description: 'Hold body with legs extended horizontally while supporting on hands. Elite core strength.',
      muscle_groups: ['core', 'hip_flexors', 'shoulders', 'triceps'],
      equipment_needed: ['parallel_bars', 'parallettes'],
      difficulty: 4,
      exercise_type: 'skill',
      default_sets: 3,
      default_reps: '10-30s',
      default_rest_seconds: 90,
      tips: 'Shoulders depressed, legs locked straight. Start with tuck L-sit, progress to one leg, then full L-sit.'
    }
  ];

  try {
    // Insert exercises one by one
    for (const exercise of exercises) {
      const { data, error } = await supabase
        .from('exercises')
        .insert([exercise])
        .select();

      if (error) {
        console.error(`❌ Error inserting ${exercise.name}:`, error.message);
      } else {
        console.log(`✅ Added: ${exercise.name}`);
      }
    }

    console.log('\n✅ Exercise database seeded successfully!');
    console.log(`📊 Total exercises: ${exercises.length}`);

  } catch (error) {
    console.error('❌ Error seeding exercises:', error.message);
  }
}

async function main() {
  console.log('🏋️ Urban Athlete Platform - Database Setup\n');
  
  const tablesExist = await runMigration();
  
  if (tablesExist) {
    await seedExercises();
    console.log('\n🎉 Database setup complete!');
  }
}

main();
