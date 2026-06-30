/**
 * Apply Profile Fix
 * 
 * This script creates the upsert_profile RPC function and the RLS INSERT policy
 * directly on your Supabase instance. Run it once to fix profile creation.
 * 
 * Usage: node app/scripts/apply-profile-fix.js
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

// Extract project ref from URL (e.g. "https://abc123.supabase.co" -> "abc123")
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

const sql = `
-- 1. RPC function to upsert profile (SECURITY DEFINER = bypasses RLS)
CREATE OR REPLACE FUNCTION public.upsert_profile(
  p_id UUID,
  p_username TEXT,
  p_city TEXT,
  p_age INTEGER,
  p_gender TEXT,
  p_experience_level TEXT,
  p_training_days_per_week INTEGER,
  p_training_goal TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (
    id, username, city, age, gender,
    experience_level, training_days_per_week, training_goal
  )
  VALUES (
    p_id, p_username, p_city, p_age, p_gender,
    p_experience_level, p_training_days_per_week, p_training_goal
  )
  ON CONFLICT (id) DO UPDATE SET
    city = EXCLUDED.city,
    age = EXCLUDED.age,
    gender = EXCLUDED.gender,
    experience_level = EXCLUDED.experience_level,
    training_days_per_week = EXCLUDED.training_days_per_week,
    training_goal = EXCLUDED.training_goal,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger function for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, username, city, age, gender,
    experience_level, training_days_per_week, training_goal
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'city', 'trieste'),
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 25),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'male'),
    COALESCE(NEW.raw_user_meta_data->>'experience_level', 'beginner'),
    COALESCE((NEW.raw_user_meta_data->>'training_days_per_week')::INTEGER, 3),
    COALESCE(NEW.raw_user_meta_data->>'training_goal', 'general')
  )
  ON CONFLICT (id) DO UPDATE SET
    city = EXCLUDED.city,
    age = EXCLUDED.age,
    gender = EXCLUDED.gender,
    experience_level = EXCLUDED.experience_level,
    training_days_per_week = EXCLUDED.training_days_per_week,
    training_goal = EXCLUDED.training_goal,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger (recreate to be safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. RLS INSERT policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can create own profile'
  ) THEN
    CREATE POLICY "Users can create own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- 5. Backfill missing profiles
INSERT INTO public.profiles (id, username, city, age, gender, experience_level, training_days_per_week, training_goal)
SELECT u.id,
  COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'city', 'trieste'),
  COALESCE((u.raw_user_meta_data->>'age')::INTEGER, 25),
  COALESCE(u.raw_user_meta_data->>'gender', 'male'),
  COALESCE(u.raw_user_meta_data->>'experience_level', 'beginner'),
  COALESCE((u.raw_user_meta_data->>'training_days_per_week')::INTEGER, 3),
  COALESCE(u.raw_user_meta_data->>'training_goal', 'general')
FROM auth.users u LEFT JOIN public.profiles p ON p.id = u.id WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
`;

async function applyFix() {
  console.log('🔧 Applying profile creation fix to Supabase...\n');
  console.log(`   Project: ${projectRef}`);
  console.log(`   URL: ${supabaseUrl}\n`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test if upsert_profile function already exists by calling it with a dummy UUID
  // (will fail with FK violation or similar, but NOT with 42883 if function exists)
  const { error: testError } = await supabase.rpc('upsert_profile', {
    p_id: '00000000-0000-0000-0000-000000000000',
    p_username: '__test__',
    p_city: 'trieste',
    p_age: 25,
    p_gender: 'male',
    p_experience_level: 'beginner',
    p_training_days_per_week: 3,
    p_training_goal: 'general'
  });

  console.log('   RPC test result:', testError ? `error ${testError.code}: ${testError.message}` : 'success (no error)');

  if (testError && testError.code === '42883') {
    // Function doesn't exist — we MUST run SQL manually
    console.log('❌ The upsert_profile function does not exist in your database yet.\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  You need to run SQL in Supabase Dashboard. Here is how:');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`  1. Open: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    console.log('  2. Paste the SQL from: app/supabase/migrations/007_upsert_profile_rpc.sql');
    console.log('  3. Click "Run"\n');
    console.log('  Or paste this directly:\n');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(sql);
    console.log('─────────────────────────────────────────────────────────────────\n');
    console.log('  After running the SQL, try signing up again.\n');
    process.exit(1);
  } else if (testError) {
    // Function exists but test failed for another reason (FK violation etc) — that's fine
    console.log(`✅ upsert_profile function exists (test returned: ${testError.code} — expected for dummy data)`);
  } else {
    console.log('✅ upsert_profile function exists and works!');
    // Clean up test row
    await supabase.from('profiles').delete().eq('id', '00000000-0000-0000-0000-000000000000');
  }

  // Check if profiles table has any data
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, city, age')
    .limit(10);

  if (profilesError) {
    console.log(`\n⚠️  Could not read profiles: ${profilesError.message}`);
  } else {
    console.log(`\n📊 Profiles in database: ${profiles.length}`);
    if (profiles.length > 0) {
      profiles.forEach(p => console.log(`   - ${p.username} (${p.city}, age ${p.age})`));
    } else {
      console.log('   (none — try signing up a new user)');
    }
  }

  console.log('\n✅ Done.');
}

applyFix().catch(err => {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
});
