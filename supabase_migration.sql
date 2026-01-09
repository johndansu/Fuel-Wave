-- ForgeOne MVP Migration: Work Moments and Threads
-- Run this in Supabase Dashboard > SQL Editor

-- Create enums for state_after and energy_cost
DO $$ BEGIN
  CREATE TYPE state_after AS ENUM ('advanced', 'stuck', 'resolved');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE energy_cost AS ENUM ('low', 'medium', 'heavy');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE thread_status AS ENUM ('active', 'dormant');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create work_moments table
CREATE TABLE IF NOT EXISTS work_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  effort_text TEXT NOT NULL,
  context_note TEXT,
  state_after state_after NOT NULL,
  energy_cost energy_cost NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  status thread_status DEFAULT 'active',
  friction_score DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create thread_moments junction table
CREATE TABLE IF NOT EXISTS thread_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  work_moment_id UUID NOT NULL REFERENCES work_moments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(thread_id, work_moment_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_work_moments_user_id ON work_moments(user_id);
CREATE INDEX IF NOT EXISTS idx_work_moments_created_at ON work_moments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_work_moments_state_after ON work_moments(state_after);
CREATE INDEX IF NOT EXISTS idx_threads_user_id ON threads(user_id);
CREATE INDEX IF NOT EXISTS idx_threads_status ON threads(status);
CREATE INDEX IF NOT EXISTS idx_threads_last_seen ON threads(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_thread_moments_thread_id ON thread_moments(thread_id);
CREATE INDEX IF NOT EXISTS idx_thread_moments_work_moment_id ON thread_moments(work_moment_id);
