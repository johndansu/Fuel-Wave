import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

// Validation schemas
const createThreadSchema = z.object({
  name: z.string().min(1, 'Thread name is required').max(255),
  moment_id: z.string().uuid().optional()
});

const updateThreadSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: z.enum(['active', 'dormant']).optional()
});

// POST /api/threads - Create a new thread
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validation = createThreadSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.error.errors
        }
      });
    }

    const { name, moment_id } = validation.data;

    const { data: thread, error } = await supabase
      .from('threads')
      .insert({
        user_id: req.userId,
        name,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Link moment to thread if provided
    if (moment_id) {
      await supabase
        .from('thread_moments')
        .insert({
          thread_id: thread.id,
          work_moment_id: moment_id
        });
    }

    res.status(201).json(thread);
  } catch (error) {
    console.error('Create thread error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create thread'
      }
    });
  }
});

// GET /api/threads - Get all threads for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;

    let query = supabase
      .from('threads')
      .select('*', { count: 'exact' })
      .eq('user_id', req.userId)
      .order('last_seen', { ascending: false })
      .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: threads, count, error } = await query;

    if (error) throw error;

    res.json({
      threads: threads || [],
      total: count || 0,
      hasMore: parseInt(offset as string) + (threads?.length || 0) < (count || 0)
    });
  } catch (error) {
    console.error('Get threads error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch threads'
      }
    });
  }
});

// GET /api/threads/active - Get active threads with recent activity
router.get('/active', async (req: AuthRequest, res: Response) => {
  try {
    const { data: threads, error } = await supabase
      .from('threads')
      .select('*')
      .eq('user_id', req.userId)
      .eq('status', 'active')
      .order('last_seen', { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json({ threads: threads || [] });
  } catch (error) {
    console.error('Get active threads error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch active threads'
      }
    });
  }
});

// GET /api/threads/:id - Get single thread with its moments
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { data: thread, error } = await supabase
      .from('threads')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error || !thread) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Thread not found'
        }
      });
    }

    // Get linked moments
    const { data: threadMoments } = await supabase
      .from('thread_moments')
      .select('work_moment_id')
      .eq('thread_id', thread.id);

    const momentIds = (threadMoments || []).map((tm: any) => tm.work_moment_id);

    let moments: any[] = [];
    if (momentIds.length > 0) {
      const { data } = await supabase
        .from('work_moments')
        .select('*')
        .in('id', momentIds)
        .order('created_at', { ascending: true });
      moments = data || [];
    }

    res.json({ ...thread, moments });
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch thread'
      }
    });
  }
});

// PUT /api/threads/:id - Update thread
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const validation = updateThreadSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.error.errors
        }
      });
    }

    const { data: existing } = await supabase
      .from('threads')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Thread not found'
        }
      });
    }

    const { data: thread, error } = await supabase
      .from('threads')
      .update(validation.data)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(thread);
  } catch (error) {
    console.error('Update thread error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update thread'
      }
    });
  }
});

// POST /api/threads/:id/moments - Link a moment to a thread
router.post('/:id/moments', async (req: AuthRequest, res: Response) => {
  try {
    const { moment_id } = req.body;

    if (!moment_id) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'moment_id is required'
        }
      });
    }

    // Verify thread ownership
    const { data: thread } = await supabase
      .from('threads')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (!thread) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Thread not found'
        }
      });
    }

    // Verify moment ownership
    const { data: moment } = await supabase
      .from('work_moments')
      .select('id, created_at')
      .eq('id', moment_id)
      .eq('user_id', req.userId)
      .single();

    if (!moment) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Moment not found'
        }
      });
    }

    // Link moment to thread
    const { error: linkError } = await supabase
      .from('thread_moments')
      .insert({
        thread_id: req.params.id,
        work_moment_id: moment_id
      });

    if (linkError && linkError.code !== '23505') { // Ignore duplicate key error
      throw linkError;
    }

    // Update thread's last_seen
    await supabase
      .from('threads')
      .update({ last_seen: moment.created_at })
      .eq('id', req.params.id);

    // Recalculate friction score
    await updateFrictionScore(req.params.id);

    res.status(201).json({ message: 'Moment linked to thread' });
  } catch (error) {
    console.error('Link moment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to link moment to thread'
      }
    });
  }
});

// DELETE /api/threads/:id - Delete thread
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { data: existing } = await supabase
      .from('threads')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Thread not found'
        }
      });
    }

    const { error } = await supabase
      .from('threads')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete thread error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete thread'
      }
    });
  }
});

// Helper function to update friction score
async function updateFrictionScore(threadId: string) {
  try {
    // Get all moments linked to this thread
    const { data: threadMoments } = await supabase
      .from('thread_moments')
      .select('work_moment_id')
      .eq('thread_id', threadId);

    if (!threadMoments || threadMoments.length === 0) return;

    const momentIds = threadMoments.map((tm: any) => tm.work_moment_id);

    const { data: moments } = await supabase
      .from('work_moments')
      .select('state_after')
      .in('id', momentIds);

    if (!moments || moments.length === 0) return;

    // Calculate friction score (percentage of "stuck" moments)
    const stuckCount = moments.filter((m: any) => m.state_after === 'stuck').length;
    const frictionScore = (stuckCount / moments.length).toFixed(2);

    await supabase
      .from('threads')
      .update({ friction_score: parseFloat(frictionScore) })
      .eq('id', threadId);
  } catch (error) {
    console.error('Update friction score error:', error);
  }
}

export default router;
