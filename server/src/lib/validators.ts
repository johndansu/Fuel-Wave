import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const workEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['project', 'study', 'personal', 'client']),
  timeSpent: z.number().int().positive().optional().nullable(),
  outcome: z.enum(['done', 'partial', 'stuck']),
  blockers: z.string().optional().nullable()
});

export const updateWorkEntrySchema = workEntrySchema.partial();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WorkEntryInput = z.infer<typeof workEntrySchema>;
