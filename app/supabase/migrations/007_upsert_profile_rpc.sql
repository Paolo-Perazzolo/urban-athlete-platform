-- RPC function to upsert a profile row, bypassing RLS via SECURITY DEFINER.
-- This allows the signup page to create/update a profile without needing
-- an RLS INSERT policy on the profiles table.
--
-- MUST BE RUN IN SUPABASE SQL EDITOR for it to take effect.

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
