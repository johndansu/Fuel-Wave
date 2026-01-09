# ForgeOne — Technical Specification

## 1. Overview

This document defines the technical architecture for **ForgeOne MVP** — a Work Memory System that captures, stores, and retrieves work as time-anchored memory.

---

## 2. Technology Stack

### Frontend
| Layer | Technology |
|-------|------------|
| Framework | React 18+ |
| Styling | TailwindCSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| State Management | React Context + useReducer |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Date Handling | date-fns |

### Backend
| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 LTS |
| Framework | Express.js |
| Database | PostgreSQL 15+ |
| ORM | Prisma |
| Authentication | bcrypt + JWT |
| Validation | Zod |

### Infrastructure
| Component | Technology |
|-----------|------------|
| Hosting | Vercel (Frontend) / Railway or Render (Backend) |
| Database Hosting | Supabase or Railway PostgreSQL |
| Environment | dotenv |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Auth UI   │  │  Timeline   │  │   Work Entry Form   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Search    │  │  Insights   │  │   Entry Details     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      REST API                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/auth    /api/entries    /api/search    /api/insights │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE                                │
│  ┌────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │   Users    │  │  WorkEntries   │  │    Memories    │     │
│  └────────────┘  └────────────────┘  └────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema

### 4.1 Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### 4.2 WorkEntries Table

```sql
CREATE TABLE work_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('project', 'study', 'personal', 'client')),
    time_spent INTEGER, -- in minutes, nullable
    outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('done', 'partial', 'stuck')),
    blockers TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_work_entries_user_id ON work_entries(user_id);
CREATE INDEX idx_work_entries_created_at ON work_entries(created_at DESC);
CREATE INDEX idx_work_entries_category ON work_entries(category);
```

### 4.3 Memories Table

```sql
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_entry_id UUID UNIQUE NOT NULL REFERENCES work_entries(id) ON DELETE CASCADE,
    searchable_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_memories_searchable_text ON memories USING GIN (to_tsvector('english', searchable_text));
```

### 4.4 Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String       @id @default(uuid())
  email        String       @unique
  passwordHash String       @map("password_hash")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")
  workEntries  WorkEntry[]

  @@map("users")
}

model WorkEntry {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  title       String
  description String
  category    Category
  timeSpent   Int?     @map("time_spent")
  outcome     Outcome
  blockers    String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  memory Memory?

  @@index([userId])
  @@index([createdAt(sort: Desc)])
  @@index([category])
  @@map("work_entries")
}

model Memory {
  id             String    @id @default(uuid())
  workEntryId    String    @unique @map("work_entry_id")
  searchableText String    @map("searchable_text")
  createdAt      DateTime  @default(now()) @map("created_at")

  workEntry WorkEntry @relation(fields: [workEntryId], references: [id], onDelete: Cascade)

  @@map("memories")
}

enum Category {
  project
  study
  personal
  client
}

enum Outcome {
  done
  partial
  stuck
}
```

---

## 5. API Specification

### 5.1 Authentication Endpoints

#### POST `/api/auth/register`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2026-01-09T12:00:00Z"
  },
  "token": "jwt_token"
}
```

#### POST `/api/auth/login`
Authenticate an existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

#### POST `/api/auth/logout`
Invalidate current session.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5.2 Work Entry Endpoints

#### POST `/api/entries`
Create a new work entry.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "title": "Built authentication flow",
  "description": "Implemented login/register with JWT tokens and bcrypt hashing",
  "category": "project",
  "timeSpent": 120,
  "outcome": "done",
  "blockers": null
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Built authentication flow",
  "description": "Implemented login/register with JWT tokens and bcrypt hashing",
  "category": "project",
  "timeSpent": 120,
  "outcome": "done",
  "blockers": null,
  "createdAt": "2026-01-09T12:00:00Z"
}
```

#### GET `/api/entries`
Retrieve work entries for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | string | Filter by specific date (YYYY-MM-DD) |
| `startDate` | string | Filter from date |
| `endDate` | string | Filter to date |
| `category` | string | Filter by category |
| `limit` | number | Max entries to return (default: 50) |
| `offset` | number | Pagination offset |

**Response (200):**
```json
{
  "entries": [...],
  "total": 150,
  "hasMore": true
}
```

#### GET `/api/entries/:id`
Retrieve a single work entry.

**Response (200):**
```json
{
  "id": "uuid",
  "title": "...",
  "description": "...",
  ...
}
```

#### PUT `/api/entries/:id`
Update a work entry.

#### DELETE `/api/entries/:id`
Delete a work entry.

---

### 5.3 Search Endpoints

#### GET `/api/search`
Search through work memories.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (required) |
| `category` | string | Filter by category |
| `limit` | number | Max results (default: 20) |

**Response (200):**
```json
{
  "results": [
    {
      "id": "uuid",
      "title": "...",
      "description": "...",
      "category": "project",
      "createdAt": "2026-01-09T12:00:00Z",
      "relevance": 0.95
    }
  ],
  "total": 5
}
```

---

### 5.4 Insights Endpoints

#### GET `/api/insights`
Retrieve reflection insights for the authenticated user.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | `week` or `month` (default: week) |

**Response (200):**
```json
{
  "period": "week",
  "totalTimeLogged": 1240,
  "entryCount": 15,
  "mostFrequentCategory": "project",
  "categoryBreakdown": {
    "project": 8,
    "study": 4,
    "personal": 2,
    "client": 1
  },
  "inactiveDays": ["2026-01-05", "2026-01-06"],
  "staleProjects": [
    {
      "title": "Side project X",
      "lastWorkedOn": "2025-12-20T10:00:00Z",
      "daysSince": 20
    }
  ]
}
```

---

## 6. Frontend Architecture

### 6.1 Directory Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── entries/
│   │   ├── WorkEntryForm.tsx
│   │   ├── EntryCard.tsx
│   │   └── EntryDetails.tsx
│   ├── timeline/
│   │   ├── Timeline.tsx
│   │   ├── DayGroup.tsx
│   │   └── TimelineEntry.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   └── SearchResults.tsx
│   └── insights/
│       └── InsightsPanel.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── EntriesContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useEntries.ts
│   ├── useSearch.ts
│   └── useInsights.ts
├── lib/
│   ├── api.ts                 # Axios instance & API calls
│   ├── utils.ts
│   └── validators.ts
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx          # Main timeline view
│   └── Search.tsx
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

### 6.2 Key Components

#### Timeline View (Primary Interface)
- Infinite scroll with virtualization for performance
- Entries grouped by day with date headers
- Expandable entry cards
- Quick-add floating action button

#### Work Entry Form
- Modal or slide-over panel
- Form validation with Zod
- Category selector (dropdown)
- Optional time tracking input
- Outcome selector (radio buttons)

#### Search Interface
- Debounced search input
- Category filter chips
- Date range picker
- Results displayed as entry cards

---

## 7. Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│   API    │────▶│    DB    │
└──────────┘     └──────────┘     └──────────┘
     │                │                │
     │  1. Register   │                │
     │───────────────▶│                │
     │                │  2. Hash pwd   │
     │                │───────────────▶│
     │                │  3. Store user │
     │                │◀───────────────│
     │  4. JWT token  │                │
     │◀───────────────│                │
     │                │                │
     │  5. Login      │                │
     │───────────────▶│                │
     │                │  6. Verify pwd │
     │                │───────────────▶│
     │  7. JWT token  │                │
     │◀───────────────│                │
     │                │                │
     │  8. API call   │                │
     │  + Bearer token│                │
     │───────────────▶│                │
     │                │  9. Verify JWT │
     │                │  10. Query DB  │
     │                │───────────────▶│
     │  11. Response  │                │
     │◀───────────────│◀───────────────│
```

### JWT Configuration
- **Algorithm:** HS256
- **Expiration:** 7 days
- **Payload:** `{ userId, email, iat, exp }`
- **Storage:** HttpOnly cookie (preferred) or localStorage

---

## 8. Security Considerations

### Authentication
- Passwords hashed with bcrypt (cost factor: 12)
- JWT tokens with secure secret (256-bit minimum)
- Rate limiting on auth endpoints (5 attempts/minute)

### Data Protection
- All API endpoints require authentication (except auth routes)
- Users can only access their own data
- Input validation on all endpoints
- SQL injection prevention via Prisma ORM

### Transport
- HTTPS enforced in production
- CORS configured for allowed origins only

---

## 9. Performance Considerations

### Database
- Indexed queries on frequently accessed columns
- Connection pooling via Prisma
- Pagination on list endpoints

### Frontend
- Lazy loading of routes
- Virtual scrolling for timeline
- Debounced search input
- Optimistic UI updates

### Caching
- Browser caching for static assets
- Consider Redis for session storage (post-MVP)

---

## 10. Error Handling

### API Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 11. Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or pnpm

### Environment Variables

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/forgeone
JWT_SECRET=your-256-bit-secret
PORT=3001
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001/api
```

### Commands

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development servers
npm run dev          # Frontend (Vite)
npm run dev:server   # Backend (nodemon)

# Build for production
npm run build

# Run tests
npm test
```

---

## 12. Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] HTTPS enabled
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Health check endpoint (`/api/health`)
- [ ] Database backups scheduled

---

## 13. Future Technical Considerations

These align with post-MVP product features:

| Feature | Technical Approach |
|---------|-------------------|
| **Patterns (Habits)** | Scheduled job analyzing entry frequency by title/category |
| **Direction (Goals)** | Aggregation queries on time spent by category over periods |
| **People (MicroCRM)** | NLP entity extraction from descriptions (post-MVP) |
| **Offline Support** | Service worker + IndexedDB sync |
| **Mobile App** | React Native with shared API |

---

## 14. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-09 | — | Initial technical specification |
