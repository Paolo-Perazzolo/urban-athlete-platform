-- ENSURE PROFILES AUTO-CREATION FLOW WORKS END-TO-END
-- This migration is idempotent and can be run safely even if previous migrations were partially applied.
-- It ensures:
-- 1) trigger function exists and maps auth metadata -> public.profiles
-- 2) auth.users trigger exists
-- 3) RLS INSERT policy allows users to create their own profile row
-- 4) existing auth users without profile are backfilled

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    city,
    age,
    gender,
    experience_level,
    training_days_per_week,
    training_goal
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
  ON CONFLICT (id) DO UPDATE
  SET
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
      AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can create own profile'
  ) THEN
    CREATE POLICY "Users can create own profile"
      ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END;
$$;

INSERT INTO public.profiles (
  id,
  username,
  city,
  age,
  gender,
  experience_level,
  training_days_per_week,
  training_goal
)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'city', 'trieste'),
  COALESCE((u.raw_user_meta_data->>'age')::INTEGER, 25),
  COALESCE(u.raw_user_meta_data->>'gender', 'male'),
  COALESCE(u.raw_user_meta_data->>'experience_level', 'beginner'),
  COALESCE((u.raw_user_meta_data->>'training_days_per_week')::INTEGER, 3),
  COALESCE(u.raw_user_meta_data->>'training_goal', 'general')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;
