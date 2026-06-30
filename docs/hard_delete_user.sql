-- HARD DELETE USER (AUTH + APP DATA)
-- Replace USER_UUID with the target user id.
-- Run in Supabase SQL Editor.

begin;

-- 1) Remove dependent rows that reference profiles(id)
-- Keep this order to avoid FK violations.
delete from public.training_plans where user_id = 'USER_UUID';
delete from public.xp_events where user_id = 'USER_UUID';
delete from public.reviews where user_id = 'USER_UUID';
delete from public.spot_photos where uploaded_by = 'USER_UUID';
delete from public.spots where created_by = 'USER_UUID';

-- 2) Delete auth user (public.profiles row should cascade via ON DELETE CASCADE)
delete from auth.users where id = 'USER_UUID';

commit;

-- Verification
-- select id, email from auth.users where id = 'USER_UUID';
-- select id, username from public.profiles where id = 'USER_UUID';
