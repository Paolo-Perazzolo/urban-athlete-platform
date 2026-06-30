-- ADD RLS POLICY TO ALLOW USERS TO CREATE THEIR OWN PROFILE
-- Fixes 403 (42501) when client tries to insert missing profile rows.

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
