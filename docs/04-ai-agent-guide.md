# AI Agent & Model Selection Guide

> **For:** Non-developers using AI agents to build products  
> **Goal:** Optimize cost, quality, and speed by choosing the right model for each task

---

## 1. Models Cheat Sheet (as of mid-2025)

| Model | Best For | Cost | Speed | Quality | Token Limit |
|---|---|---|---|---|---|
| **GPT-4o** | Complex reasoning, architecture decisions, code review | $$$ | Medium | ⭐⭐⭐⭐⭐ | 128K |
| **GPT-4o-mini** | Coding, training plan generation, structured output | $ | Fast | ⭐⭐⭐⭐ | 128K |
| **Claude 3.5 Sonnet** | Long documents, nuanced writing, code generation | $$ | Medium | ⭐⭐⭐⭐⭐ | 200K |
| **Claude 3.5 Haiku** | Quick tasks, classification, simple generation | $ | Very Fast | ⭐⭐⭐ | 200K |
| **Gemini 2.0 Flash** | Multimodal (images), fast prototyping | $ | Very Fast | ⭐⭐⭐⭐ | 1M |
| **DeepSeek V3** | Coding, math, open-source alternative | $ | Fast | ⭐⭐⭐⭐ | 128K |
| **Llama 3.1 (local)** | Offline use, privacy, zero cost | Free | Varies | ⭐⭐⭐ | 128K |

## 2. Which Model for Which Task (This Project)

| Task | Recommended Model | Why | Est. Cost/Call |
|---|---|---|---|
| **Strategic planning** (product brief, market analysis) | Claude 3.5 Sonnet or GPT-4o | Best reasoning and writing quality | $0.01-0.05 |
| **Code generation** (SvelteKit components, SQL) | Claude 3.5 Sonnet (via Windsurf/Cascade) | Best at complex multi-file code changes | Included in subscription |
| **Training plan generation** (user-facing AI) | GPT-4o-mini | Cheap ($0.15/1M tokens), fast, good enough for structured fitness plans | ~$0.001/plan |
| **Image description** (spot photo analysis) | Gemini 2.0 Flash | Cheap multimodal, can describe equipment in photos | ~$0.001/image |
| **Text classification** (review sentiment, spam detection) | GPT-4o-mini or Haiku | Simple task, cheapest models work fine | ~$0.0005 |
| **Content moderation** | GPT-4o-mini | Cheap and reliable for safety checks | ~$0.0005 |
| **SEO content** (landing page copy, meta descriptions) | Claude 3.5 Sonnet | Best writing quality | $0.01 |

## 3. Token Optimization Tips

### What is a token?
- ~1 token ≈ 4 characters in English (slightly more in Italian)
- "Calisthenics training plan for beginners" ≈ 7 tokens
- A full training plan response ≈ 500-1000 tokens

### How to save tokens (and money)

1. **Use system prompts wisely** — Write a good system prompt once, reuse it. Don't repeat instructions in every user message.
2. **Structured output** — Ask for JSON responses instead of prose. Shorter and easier to parse.
3. **Minimize context** — Only send relevant data to the AI. Don't dump the entire user profile if you only need their level.
4. **Cache responses** — If 10 beginners ask for a plan at a spot with the same equipment, cache the first response.
5. **Use the cheapest model that works** — Start with GPT-4o-mini. Only upgrade if quality is insufficient.
6. **Batch when possible** — Generate 4 weekly plans in one call instead of 4 separate calls (saves on overhead tokens).

### Cost Example for This Project

```
Scenario: 100 users, each generates 2 training plans/month

Per plan:
  Input: ~300 tokens (system prompt + user context)
  Output: ~800 tokens (structured plan)
  Cost with GPT-4o-mini: ~$0.0002 per plan

Monthly cost: 100 users × 2 plans × $0.0002 = $0.04
Annual cost: ~$0.50

→ AI training plans cost less than a coffee per year at POC scale
```

## 4. AI Agent Workflows (How to Use This Tool Effectively)

### What you're doing right now (Windsurf/Cascade)
You're using an **AI coding agent** — it can:
- Read/write files in your project
- Run terminal commands
- Search codebases
- Generate code, docs, architecture
- Interact with APIs (Jira, Confluence, GitHub)

### Tips for Working with AI Agents

| Do | Don't |
|---|---|
| Give clear context about what you want | Don't assume the AI remembers everything from 10 conversations ago |
| Break big tasks into smaller ones | Don't ask for "build the entire app" in one prompt |
| Review generated code before running | Don't blindly trust — you're the PM, quality gate is you |
| Use memories to store key decisions | Don't repeat yourself — save context for future sessions |
| Ask the agent to explain its choices | Don't skip understanding — this is how you learn |

### Effective Prompt Patterns

1. **Role + Context + Task + Format**
   > "You are a fitness app architect. Given our SvelteKit + Supabase stack, design the database schema for the gamification system. Output as SQL CREATE statements."

2. **Iterative refinement**
   > "This is good but add a constraint: max 5 photos per spot. Also add an index on city column."

3. **Review request**
   > "Review this component for accessibility issues and performance. Suggest improvements."

4. **Learning mode**
   > "Explain why you chose Supabase over Firebase for this use case. What are the trade-offs?"

## 5. Agent Orchestration (Advanced — For Later)

As the project grows, you might want multiple AI agents working together:

```
┌─────────────────────────────┐
│   PM Agent (You + Cascade)  │ ← Strategic decisions, architecture
├─────────────────────────────┤
│   Coder Agent               │ ← Writes components, fixes bugs
│   (Claude Sonnet via IDE)   │
├─────────────────────────────┤
│   Content Agent             │ ← Generates training plans, spot descriptions
│   (GPT-4o-mini via API)     │
├─────────────────────────────┤
│   QA Agent                  │ ← Reviews code, runs tests, checks accessibility
│   (Can be same as Coder)    │
├─────────────────────────────┤
│   Analytics Agent           │ ← Interprets PostHog data, suggests experiments
│   (GPT-4o for reasoning)    │
└─────────────────────────────┘
```

For now, **Cascade (me) handles all roles.** As you scale, you can specialize.

---

*This guide will evolve as we build together. Ask me to explain any concept deeper.*
