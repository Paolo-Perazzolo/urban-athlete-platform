---
description: After any architecture, scope, or strategy decision, update the project documentation to reflect the latest state
---

## When to trigger this workflow

Run this workflow whenever a conversation includes a **decision** that changes:
- Tech stack or architecture
- MVP scope or feature priorities
- Target users or personas
- Cost structure or hosting
- Training plan logic or data model
- Any other strategic direction

## Steps

1. Identify which doc(s) are affected by the decision:
   - `my-space/docs/00-product-brief.md` — scope, personas, value prop
   - `my-space/docs/01-technical-architecture.md` — stack, data model, costs
   - `my-space/docs/02-agile-backlog.md` — sprints, stories, priorities
   - `my-space/docs/03-market-analysis.md` — competitors, GTM
   - `my-space/docs/04-ai-agent-guide.md` — model usage, workflows
   - `my-space/docs/05-decisions-log.md` — append every decision here
   - `my-space/docs/09-engineering-standards.md` — coding rules and delivery standards

2. Read the affected doc(s) to understand current state.

3. Apply the minimal edit(s) to reflect the new decision. Keep the document style consistent.

4. Append the decision to `my-space/docs/05-decisions-log.md` with:
   - Date
   - Decision summary (1-2 lines)
   - Which docs were updated

5. Briefly confirm to the user what was updated.

## Mandatory gate before push to `dev`

Before pushing code to `dev`, verify docs are updated if behavior/architecture/process changed.
