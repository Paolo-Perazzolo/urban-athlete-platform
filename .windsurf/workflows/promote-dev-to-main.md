---
description: Promote dev to main without branch checkout (safe for OneDrive lock issues)
---

# Promote `dev` to `main` (Safe Procedure)

Use this when `dev` is your source of truth and you want production (`main` + Vercel) to match it exactly.

## 1) Preconditions

Run from repo root:

```bash
git rev-parse --abbrev-ref HEAD
git status -sb
```

Expected:
- Current branch is `dev`
- Working tree is clean

If not clean, commit first on `dev`:

```bash
git add -A
git commit -m "<your message>"
git push origin dev
```

## 2) Promote `dev` to `main` (no checkout)

```bash
git push origin dev:main
```

This updates remote `main` to the same commit as `dev` without local `git checkout main`.

## 3) Verify promotion

```bash
git rev-parse --short dev
git ls-remote --heads origin main
```

The `origin/main` hash should match `dev` commit.

## 4) Production deploy check

Vercel auto-deploys from `main`.

Check:
1. Vercel deployment status = `Ready`
2. Smoke test:
   - `/`
   - `/spots`
   - `/plan`

## 5) Rollback (if needed)

Rollback main to previous known commit:

```bash
git push origin <previous_commit_sha>:main
```

Then re-check Vercel deployment.
