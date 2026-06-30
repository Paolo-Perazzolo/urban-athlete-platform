-- UPDATE PROFILE TRIGGER TO PERSIST AGE FROM AUTH METADATA
-- Needed for existing environments where 002 migration has already run.

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
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
