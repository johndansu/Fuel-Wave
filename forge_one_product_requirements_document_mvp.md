# ForgeOne — Product Requirements Document (MVP)

## 1. Product Overview

### Product Name
**ForgeOne**

### Product Definition
ForgeOne is a **Work Memory System**.

It captures work as living memory — preserving context, decisions, effort, and continuity — so users never lose track of what they’ve done, why it mattered, or where they stopped.

ForgeOne does **not** manage tasks or plans. It remembers work.

---

## 2. Problem Statement

Modern work is fragmented.

People:
- Forget why they made certain decisions
- Lose context when returning to paused projects
- Remember effort emotionally but not structurally
- Use tools that track *tasks*, not *thinking*

Existing productivity tools optimize for planning and execution, but fail at **memory and continuity**.

ForgeOne solves this by treating work as **time-anchored memory**, not as checklists.

---

## 3. Target Users

### Primary Users
- Developers
- Students
- Knowledge workers
- Freelancers

### User Characteristics
- Works on long-running efforts
- Switches between projects frequently
- Values clarity and reflection
- Prefers calm, minimal tools

---

## 4. Product Philosophy (Non-Negotiable)

1. **Memory over management**
2. **Time organizes everything**
3. **Insight is a side effect, not a feature**
4. **One action, many benefits**

If a feature does not strengthen memory and continuity, it does not belong.

---

## 5. Core Concept

### Work → Memory → Continuity

ForgeOne is built on the belief that **everything else people want (clarity, habits, goals, relationships, insight)** already exists *inside remembered work*.

- What you repeatedly work on becomes a **habit**
- What your work moves toward becomes a **goal**
- Who appears in your work becomes a **relationship**
- What you stop returning to becomes a **signal**

ForgeOne does not introduce separate systems for these ideas.

Instead, it allows them to **emerge naturally from work memory over time**.

Every recorded moment of work is:
- A unit of effort
- A memory anchor
- A future signal

Continuity is the product.

---

## 6. MVP Scope

### In Scope (MVP)
- Authentication
- Work capture
- Timeline-based memory
- Recall and search
- Lightweight reflection insights

### Out of Scope (Explicitly Excluded)
- Task management
- Goals
- Habits
- Notifications
- Collaboration
- Automation
- AI features

---

## 7. User Flow (MVP)

### Primary Flow
1. User logs in
2. User answers one prompt: **“What did you work on?”**
3. Work is saved as a memory
4. Memory appears in the timeline
5. User revisits past work when needed

No secondary flows are required for MVP success.

---

## 8. Features & Requirements

> All features below exist to support **one idea**: preserving work as memory so patterns can naturally reveal themselves over time.



### 8.1 Authentication

**Description:**
Private, secure access to personal work memory.

**Requirements:**
- Email + password authentication
- Session-based login
- Logout functionality

---

### 8.2 Work Entry (Core Feature)

**Description:**
A work entry represents a moment of effort and context.

**User Input Fields:**
- Title (required)
- Description (required)
- Category (Project / Study / Personal / Client)
- Time spent (optional)
- Blockers (optional)
- Outcome (Done / Partial / Stuck)

**System Behavior:**
- Each entry automatically becomes a memory record
- Timestamp is system-generated

---

### 8.3 Timeline View

**Description:**
A chronological memory stream of work.

**Requirements:**
- Group entries by day
- Vertical scroll
- Expandable entries
- Default view opens to “Today”

The timeline is the primary interface.

---

### 8.4 Recall & Search

**Description:**
Allows users to retrieve past work context.

**Requirements:**
- Search by keyword
- Filter by category
- Jump to specific dates

Recall is framed as rediscovering moments, not querying data.

---

### 8.5 Reflection Insights

**Description:**
Lightweight system reflections derived from memory.

**Requirements:**
- Total time logged (weekly)
- Most frequent category
- Inactive days
- Projects not revisited recently

No charts required for MVP.

---

## 9. Data Model (MVP)

### User
- id
- email
- password_hash
- created_at

### WorkEntry
- id
- user_id
- title
- description
- category
- time_spent
- outcome
- blockers
- created_at

### Memory
- id
- work_entry_id
- searchable_text
- created_at

---

## 10. UX & Design Guidelines

### Design Principles
- Calm
- Minimal
- Text-forward
- Timeline-centric

### UI Tone
- Reflective
- Neutral
- Human

Avoid gamification and urgency cues.

---

## 11. Success Metrics (MVP)

### Quantitative
- Daily work entries per user
- Retention after 7 days
- Timeline revisits

### Qualitative
- Users report easier context recall
- Users describe product as “clear” or “calm”

---

## 12. MVP Completion Criteria

The MVP is complete when:
- Users can capture work consistently
- Past work can be recalled with context
- The system feels cohesive and intentional

---

## 13. Future Considerations (Post-MVP)

These are **not new ideas** — they are natural extensions of remembered work.

- **Patterns (Habits):** detected from repeated work memories
- **Direction (Goals):** inferred from long-term effort trends
- **People (MicroCRM):** surfaced from recurring names and contexts
- **Systems (LifeOS view):** derived from how work stabilizes over time

No future feature introduces a new mental model.

They only reveal what is already present inside work memory.

---

## 14. Final Statement

ForgeOne is not a productivity tool.

It is a **memory system for work** — designed to preserve effort, context, and continuity over time.

