# Manual Test Case — Registration + Training Plan Generation

## Goal
Validate that:
1. User-entered registration data is persisted to `public.profiles`.
2. Plan generation uses profile age + selected intensity.
3. Generation is deterministic for the same inputs.

---

## Preconditions
- Local app is running.
- Supabase is configured (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
- `profiles` trigger migration update is applied (includes age/gender/experience/training days/goal).
- `exercises` table has data.

---

## Test Data (Profile A)
Use a unique email each run.

- Username: `manual_age50_user`
- Email: `manual_age50_user+<timestamp>@example.com`
- Password: `TestPass123!`
- City: `trieste`
- Age: `52`
- Gender: `male`
- Experience Level: `beginner`
- Training Days/Week: `3`
- Training Goal: `general`

---

## Scenario 1 — Registration Persists Profile Data

### Steps
1. Open `/auth/signup`.
2. Fill in all registration fields using **Profile A**.
3. Submit signup.
4. Complete email verification if required.
5. Login with the same account.
6. Open `/profile`.

### Expected Results
- Signup succeeds without client errors.
- `/profile` shows the created user.
- Profile values reflect entered data (city, experience level, training days, training goal).
- No `profile not found` error appears.

### Optional DB Check (Supabase SQL)
```sql
select id, username, city, age, gender, experience_level, training_days_per_week, training_goal
from public.profiles
where username = 'manual_age50_user'
order by created_at desc
limit 1;
```
Expected:
- Row exists.
- Values match signup input.

---

## Scenario 2 — Plan Generation Uses Intensity + Age Adjustment

### Steps
1. While logged in as Profile A, open `/plan`.
2. Set intensity to `high`.
3. Click **Generate My Plan**.
4. Inspect plan header and first workout exercise cards.

### Expected Results
- Plan is generated and displayed.
- Plan header shows intensity (effective value).
- Because age is 52, effective intensity should be reduced from `high` to `medium`.
- Training notes include:
  - selected intensity note
  - age adjustment note
- Exercise prescriptions (sets/reps/rest) are present and valid.

---

## Scenario 3 — Deterministic Output with Same Inputs

### Steps
1. Keep same user and same intensity selection.
2. Click **Regenerate**.
3. Compare workout names and exercise sequence with previous plan.

### Expected Results
- With unchanged profile/equipment/intensity, plan structure remains the same.
- Exercise ordering stays consistent across regenerations.

---

## Scenario 4 — Intensity Variation Changes Prescription

### Steps
1. Change intensity to `low` and regenerate.
2. Compare with prior `medium/high-requested` plan.

### Expected Results
- Rest times are generally longer in `low` intensity.
- Sets/reps trend lower for `low` vs `medium`.
- Plan still respects profile constraints and renders correctly.

---

## Pass Criteria
- All expected results in Scenarios 1–4 are met.
- No blocking UI errors or server errors.
- Profile data is reliably saved from registration input.
