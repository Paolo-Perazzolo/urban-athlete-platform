# DB Health Check — Auth Users vs Profiles

Run these queries in Supabase SQL Editor.

---

## 1) Check profile-related RLS policies

```sql
select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
order by policyname;
```

Expected minimum:
- `Profiles are viewable by everyone` (`SELECT`)
- `Users can update own profile` (`UPDATE`)
- `Users can create own profile` (`INSERT`)

---

## 2) Check trigger function exists

```sql
select n.nspname as schema_name, p.proname as function_name
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'handle_new_user';
```

Expected: 1 row (`public.handle_new_user`).

---

## 3) Check auth.users trigger exists

```sql
select tgname, tgrelid::regclass as table_name
from pg_trigger
where tgname = 'on_auth_user_created'
  and tgrelid = 'auth.users'::regclass;
```

Expected: 1 row (`on_auth_user_created`).

---

## 4) Check if any auth users are missing in public.profiles

```sql
select count(*) as missing_profiles
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
```

Expected: `0`.

To inspect missing rows:

```sql
select
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
order by u.created_at desc;
```

---

## 5) Check metadata quality for profile fields

```sql
select
  id,
  email,
  raw_user_meta_data->>'username' as username,
  raw_user_meta_data->>'city' as city,
  raw_user_meta_data->>'age' as age,
  raw_user_meta_data->>'gender' as gender,
  raw_user_meta_data->>'experience_level' as experience_level,
  raw_user_meta_data->>'training_days_per_week' as training_days_per_week,
  raw_user_meta_data->>'training_goal' as training_goal
from auth.users
order by created_at desc
limit 20;
```

Use this to confirm signup is writing expected metadata values.

---

## 6) One-shot repair (safe/idempotent)

If checks above fail, run `app/supabase/migrations/006_ensure_profiles_creation_flow.sql`.

It will:
- ensure trigger function and trigger exist
- ensure `INSERT` RLS policy exists on `profiles`
- backfill missing profile rows from `auth.users`
