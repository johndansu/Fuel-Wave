# ForgeOne — MVP Specification

> **ForgeOne is a Work Memory System** that captures effort as evolving context over time.
>
> It does not manage tasks or time.
> It preserves continuity.

---

## Core Idea (One Idea Only)

**Moments → Threads → Continuity**

- **Moments** capture effort
- **Threads** reveal repeated effort
- **Continuity** shows how work actually unfolds over time

Everything in ForgeOne exists to support this flow.

---

## Product Principles (Non‑Negotiable)

1. Memory over management
2. Effort over tasks
3. Energy over hours
4. Continuity over completion

If a feature does not strengthen memory or continuity, it does not belong.

---

## MVP Primitives

### 1. Work Moments

A **Work Moment** represents a single moment of applied effort.

You are not logging work.
You are capturing a state of effort.

#### Prompt
> **“What effort did you apply?”**

#### Fields
- `effort_text` (required)
- `context_note` (optional)
- `state_after` (required)
  - Advanced
  - Stuck
  - Resolved
- `energy_cost` (required)
  - Low
  - Medium
  - Heavy
- `created_at` (auto)

**Why this is unique**
- Effort ≠ task
- Energy ≠ time
- State ≠ status

---

### 2. Context Threads (Signature Mechanic)

A **Context Thread** is a visible line of continued effort over time.

Threads are not projects.
Threads are not tags.

They represent *gravity* — things that keep pulling your attention back.

#### Thread Rules
- Threads are **suggested**, not created
- Suggestions are based on:
  - Similar effort language
  - Repeated blockers or states
- Users may accept, rename, or ignore suggestions

#### Thread Properties
- `name`
- `first_seen`
- `last_seen`
- `status`
  - Active
  - Dormant
- `friction_score`
  - Calculated from how often moments end as **Stuck**

Threads emerge naturally from moments.

---

### 3. Continuity View

ForgeOne does not show analytics dashboards.

It reflects continuity through signals:

#### Signals
- **Gaps** — how long a thread went untouched
- **Pressure** — repeated high‑energy moments
- **Gravity** — threads that keep returning

These are reflections, not metrics.

---

## MVP Screens

### 1. Today — Capture

Single calm prompt:

> **“What effort did you apply today?”**

No forms. No checklists.

---

### 2. Timeline — Memory

- Vertical, chronological
- Grouped by day
- Color‑coded by `state_after`

Purpose:
> “What has my work looked like recently?”

---

### 3. Thread View — Continuity (Hero Screen)

Shows the full journey of a thread:
- First effort
- Repeated struggles
- Breakthroughs
- Pauses

This view answers:
> “How did this actually unfold?”

---

### 4. Recall — Return

Search framed as:
> **“Find the moment you’re thinking about.”**

Results include:
- Moments
- Threads
- Gaps in continuity

---

## Data Model (MVP)

### User
- `id`
- `email`
- `password_hash`
- `created_at`

### WorkMoment
- `id`
- `user_id`
- `effort_text`
- `context_note`
- `state_after`
- `energy_cost`
- `created_at`

### Thread
- `id`
- `user_id`
- `name`
- `first_seen`
- `last_seen`
- `status`
- `friction_score`

### ThreadMoment
- `thread_id`
- `work_moment_id`

---

## Explicitly Out of Scope (MVP)

- Tasks
- Goals
- Habits
- Time tracking
- Notifications
- Collaboration
- AI automation

These are **emergent**, not features.

---

## MVP Success Criteria

The MVP is successful when users:
- Capture effort daily
- Can return to past context instantly
- Recognize long‑running threads without managing them

If users say:
> “This shows me what I’ve really been dealing with”

The MVP has succeeded.

---

## Final Statement

ForgeOne is not a productivity tool.

It is a **memory system for effort** — designed to preserve continuity so nothing meaningful is lost over time.

