export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

export interface WorkEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'project' | 'study' | 'personal' | 'client';
  timeSpent: number | null;
  outcome: 'done' | 'partial' | 'stuck';
  blockers: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkEntryInput {
  title: string;
  description: string;
  category: 'project' | 'study' | 'personal' | 'client';
  timeSpent?: number | null;
  outcome: 'done' | 'partial' | 'stuck';
  blockers?: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface EntriesResponse {
  entries: WorkEntry[];
  total: number;
  hasMore: boolean;
}

export interface SearchResponse {
  results: WorkEntry[];
  total: number;
}

export interface Insights {
  period: string;
  totalTimeLogged: number;
  entryCount: number;
  mostFrequentCategory: string | null;
  categoryBreakdown: Record<string, number>;
  inactiveDays: string[];
  staleProjects: {
    title: string;
    lastWorkedOn: string;
    daysSince: number;
  }[];
}

// New MVP types
export type StateAfter = 'advanced' | 'stuck' | 'resolved';
export type EnergyCost = 'low' | 'medium' | 'heavy';
export type ThreadStatus = 'active' | 'dormant';

export interface WorkMoment {
  id: string;
  user_id: string;
  effort_text: string;
  context_note: string | null;
  state_after: StateAfter;
  energy_cost: EnergyCost;
  created_at: string;
}

export interface WorkMomentInput {
  effort_text: string;
  context_note?: string;
  state_after: StateAfter;
  energy_cost: EnergyCost;
}

export interface Thread {
  id: string;
  user_id: string;
  name: string;
  first_seen: string;
  last_seen: string;
  status: ThreadStatus;
  friction_score: number;
  created_at: string;
  moments?: WorkMoment[];
}

export interface MomentsResponse {
  moments: WorkMoment[];
  total: number;
  hasMore: boolean;
}

export interface TimelineResponse {
  timeline: Record<string, WorkMoment[]>;
}

export interface ThreadsResponse {
  threads: Thread[];
  total: number;
  hasMore: boolean;
}
