---
description: Git workflow for solo development with safe deployments
---

# Git Workflow — Urban Athlete Platform

## Branch Strategy

```
main (production)  ← Auto-deploys to Vercel (live site)
  ↑
  | merge when ready to release
  |
dev (development)  ← Daily work happens here
```

## Daily Workflow

### 1. Start Your Day
```bash
# Make sure you're on dev branch
git checkout dev

# Pull latest changes (if working from multiple machines)
git pull origin dev
```

### 2. Work & Commit Often
```bash
# Make changes, then commit
git add .
git commit -m "Add feature X"

# Push to dev branch
git push origin dev
```

`dev` is your working branch for daily development and validation.

### 3. Ready to Deploy to Production?
```bash
# Switch to main
git checkout main

# Merge dev into main
git merge dev

# Push to production
git push origin main
```

**Vercel will automatically deploy to your live site.**

### 4. Go Back to Dev
```bash
git checkout dev
```

---

## Quick Commands

| Action | Command |
|---|---|
| Check current branch | `git branch` |
| Switch to dev | `git checkout dev` |
| Switch to main | `git checkout main` |
| See what changed | `git status` |
| Commit changes | `git add . && git commit -m "message"` |
| Push to current branch | `git push` |

---

## Safety Rules

✅ **DO:**
- Always work in `dev` branch
- Test preview deployments before merging to `main`
- Commit often with clear messages
- Merge to `main` only when features are complete

❌ **DON'T:**
- Work directly in `main` branch
- Push broken code to `main`
- Merge to `main` without testing

---

## Emergency: Rollback Production

If something breaks in production:

```bash
# Switch to main
git checkout main

# Revert to previous commit
git reset --hard HEAD~1

# Force push (use with caution!)
git push -f origin main
```

Vercel will redeploy the previous version.

---

## Vercel Deployment Mode (Current)

For now, Vercel production deploy is tied to `main` only.

Use local testing (`npm run dev` / `npm run build`) before merging `dev` into `main`.

---

## Tips for Solo Founders

1. **Commit often** — even incomplete features. It's your backup.
2. **Use descriptive commit messages** — "Add spots map" not "update stuff"
3. **Merge to main weekly** — don't let `dev` drift too far
4. **Tag releases** — `git tag v0.1.0` when you hit milestones

---

## Current Status

- ✅ `dev` branch created
- ✅ `main` branch is production-ready
- 🔜 Keep evaluating if preview deploys on `dev` should be enabled later
