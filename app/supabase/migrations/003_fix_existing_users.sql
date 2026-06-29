-- FIX EXISTING USERS WITHOUT PROFILES
-- This creates profiles for any auth.users that don't have a corresponding profile entry

INSERT INTO public.profiles (id, username, city, experience_level)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)) as username,
  COALESCE(u.raw_user_meta_data->>'city', 'trieste') as city,
  'beginner' as experience_level
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
