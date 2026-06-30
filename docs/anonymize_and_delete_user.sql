-- ANONYMIZE CONTENT + DELETE AUTH USER
-- Replace USER_UUID with the target user id.
-- Run in Supabase SQL Editor.
-- Use this if you want to keep spots/reviews/photos but remove personal ownership link.

begin;

-- 1) Delete private user-linked records
-- (plans/xp are personal history, usually removed)
delete from public.training_plans where user_id = 'USER_UUID';
delete from public.xp_events where user_id = 'USER_UUID';

-- 2) Detach authored content while keeping records
update public.reviews
set user_id = null
where user_id = 'USER_UUID';

update public.spot_photos
set uploaded_by = null
where uploaded_by = 'USER_UUID';

update public.spots
set created_by = null
where created_by = 'USER_UUID';

-- 3) Delete auth user (profile row cascades)
delete from auth.users where id = 'USER_UUID';

commit;

-- Verification
-- select id, email from auth.users where id = 'USER_UUID';
-- select id, username from public.profiles where id = 'USER_UUID';
