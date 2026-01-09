# ForgeOne

A **Work Memory System** that captures work as living memory — preserving context, decisions, effort, and continuity.

## Features

- **Work Entry Capture** — Record what you worked on with title, description, category, time spent, outcome, and blockers
- **Timeline View** — Chronological memory stream grouped by day
- **Search & Recall** — Find past work by keyword and category
- **Reflection Insights** — Weekly stats including time logged, category breakdown, inactive days, and stale projects

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Router
- Axios

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Zod validation

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or pnpm

### Installation

1. **Clone and install dependencies**
```bash
cd forgeone
npm install
```

2. **Set up environment variables**

Server (`server/.env`):
```env
# Get your connection string from Supabase Dashboard > Settings > Database > Connection string (URI)
DATABASE_URL="postgresql://postgres.pejsyedbtsqxofnrwiyu:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"

# Supabase Project Settings
SUPABASE_URL="https://pejsyedbtsqxofnrwiyu.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlanN5ZWRidHNxeG9mbnJ3aXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTI0MDcsImV4cCI6MjA4MzUyODQwN30.-0r-L5NN3csw0QRr_um_tf_z5kddQ9d4ssD9e8K75UQ"

JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
```

Client (`client/.env`):
```env
VITE_API_URL=http://localhost:3001/api
```

3. **Generate Prisma client** (database tables already created in Supabase)
```bash
cd server
npx prisma generate
```

4. **Start development servers**
```bash
# From root directory
npm run dev
```

This starts both the frontend (http://localhost:5173) and backend (http://localhost:3001).

## Project Structure

```
forgeone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── auth/       # Login/Register forms
│   │   │   ├── entries/    # Work entry components
│   │   │   ├── insights/   # Insights panel
│   │   │   ├── search/     # Search components
│   │   │   ├── timeline/   # Timeline view
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # API client, utilities
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript types
│   └── ...
├── server/                 # Express backend
│   ├── prisma/             # Database schema
│   └── src/
│       ├── lib/            # Prisma client, validators
│       ├── middleware/     # Auth middleware
│       └── routes/         # API routes
└── ...
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout

### Work Entries
- `GET /api/entries` — List entries (with filters)
- `POST /api/entries` — Create entry
- `GET /api/entries/:id` — Get single entry
- `PUT /api/entries/:id` — Update entry
- `DELETE /api/entries/:id` — Delete entry

### Search
- `GET /api/search?q=query` — Search entries

### Insights
- `GET /api/insights?period=week` — Get reflection insights

## Philosophy

ForgeOne is built on the belief that **everything else people want (clarity, habits, goals, relationships, insight)** already exists inside remembered work.

- What you repeatedly work on becomes a **habit**
- What your work moves toward becomes a **goal**
- Who appears in your work becomes a **relationship**
- What you stop returning to becomes a **signal**

ForgeOne does not manage tasks or plans. It remembers work.

## License

MIT
