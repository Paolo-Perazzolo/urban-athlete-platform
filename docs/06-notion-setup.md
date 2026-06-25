# Notion Setup — Urban Athlete Platform

> Minimal Notion workspace for a solo founder. No over-engineering.

---

## Workspace Structure

Create **one Notion page** called "Urban Athlete" as your home. Inside it, create these sub-pages:

```
📋 Urban Athlete (home page)
├── 🗂️ Backlog (database)
├── 📅 Sprint Board (board view of Backlog)
├── 📝 Decisions Log
├── 💡 Ideas Parking Lot
└── 📊 Weekly Review
```

That's it. 5 pages total.

---

## 1. 🗂️ Backlog (Notion Database)

This is your **single source of truth** for all work. Create a Notion **Database - Full page**.

### Properties (columns)

| Property | Type | Options |
|---|---|---|
| **Title** | Title | (the task name) |
| **Status** | Select | `Backlog`, `Sprint`, `In Progress`, `Done`, `Dropped` |
| **Sprint** | Select | `Sprint 0`, `Sprint 1`, `Sprint 2`, `Sprint 3`, `Sprint 4`, `Sprint 5` |
| **Epic** | Select | `Setup`, `Auth`, `Spots`, `Photos & Reviews`, `Analytics`, `Gamification`, `Training Plans`, `PWA & Launch` |
| **Priority** | Select | `Must`, `Should`, `Could` |
| **Size** | Select | `S` (< 1h), `M` (1-3h), `L` (3-8h), `XL` (> 1 day) |
| **Notes** | Text | Quick notes, blockers, links |

### Views to create

1. **📅 Sprint Board** (Board view, grouped by Status, filtered by current Sprint)
   - This is your daily working view
   - Columns: `Sprint` → `In Progress` → `Done`

2. **🗂️ Full Backlog** (Table view, no filter)
   - See everything, sort by Epic or Priority

3. **✅ Done** (Table view, filtered: Status = Done)
   - Your changelog / accomplishment log

### Pre-load with Sprint 0 tasks

Copy these directly into your Backlog:

| Title | Sprint | Epic | Priority | Size |
|---|---|---|---|---|
| Create Supabase project (free tier) | Sprint 0 | Setup | Must | S |
| Create GitHub repo | Sprint 0 | Setup | Must | S |
| Initialize SvelteKit project with Tailwind | Sprint 0 | Setup | Must | M |
| Run DB migrations (core schema) | Sprint 0 | Setup | Must | M |
| Connect Vercel + auto-deploy from GitHub | Sprint 0 | Setup | Must | M |
| Point Hostinger domain to Vercel | Sprint 0 | Setup | Must | S |
| Add PostHog analytics SDK | Sprint 0 | Analytics | Must | S |
| Create basic layout (nav, footer, responsive) | Sprint 0 | Setup | Must | M |
| Set up Notion workspace (this!) | Sprint 0 | Setup | Must | S |

---

## 2. 📝 Decisions Log

Simple page with a table (not a database — just a manual table):

| Date | Decision | Why |
|---|---|---|
| 2025-06-25 | SvelteKit + Supabase + Vercel stack | Free tiers, all-in-one, solo-friendly |
| 2025-06-25 | Hostinger for domain/email only | Can't run SvelteKit SSR on shared hosting |
| 2025-06-25 | Exercise DB + algorithm (no runtime AI) | €0 cost, instant, controllable |
| 2025-06-25 | Notion for PM | Solo founder, keep it simple |

Add a row every time you make a meaningful choice. This is your "why we did X" memory.

---

## 3. 💡 Ideas Parking Lot

A simple page with a bullet list. When you have an idea that's NOT for the current sprint, dump it here instead of getting distracted:

```
- [ ] Add "workout buddy" matching feature
- [ ] Integrate with Strava for cross-tracking
- [ ] Add event/meetup scheduling
- [ ] Monetization: sponsored spots from local gyms
- [ ] Add video demos for exercises
- [ ] Multi-language support (EN/IT/DE)
```

Review this list once a month. Promote the best ideas to the Backlog.

---

## 4. 📊 Weekly Review

One page where you paste a short weekly summary every Friday/Sunday. Template:

```
### Week of [date]

**Sprint:** Sprint X
**Tasks completed:** X / Y
**Key wins:**
- ...

**Blockers / learnings:**
- ...

**Analytics snapshot:**
- Users: X
- Spots: X
- Key metric: X

**Next week focus:**
- ...
```

Takes 5 minutes. Extremely valuable after a few weeks to see your trajectory.

---

## How to Use This Day-to-Day

```
Morning:
  1. Open Sprint Board view
  2. Pick the top "Sprint" task → move to "In Progress"
  3. Work on it (with Cascade as your coding partner)
  4. When done → move to "Done"
  5. Pick next task

Weekly:
  1. Fill in Weekly Review (5 min)
  2. Check if Sprint is on track
  3. Adjust priorities if needed

End of Sprint:
  1. Move unfinished tasks to next Sprint
  2. Create next Sprint's tasks from the Backlog doc
  3. Celebrate what you shipped 🎉
```

---

## Why Not Something More Complex?

You might see templates with roadmaps, OKRs, Gantt charts, etc. **You don't need any of that.**

As a solo founder building a POC:
- One database with 6 properties = enough to track everything
- Board view = your daily workflow
- Decisions log = your memory
- Ideas parking lot = your "later" bucket
- Weekly review = your feedback loop

If this feels too simple, it's working correctly. Add complexity only when simplicity becomes a bottleneck.
