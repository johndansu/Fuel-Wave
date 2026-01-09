import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

// Validation schemas
const createMomentSchema = z.object({
  effort_text: z.string().min(1, 'Effort text is required'),
  context_note: z.string().optional(),
  state_after: z.enum(['advanced', 'stuck', 'resolved']),
  energy_cost: z.enum(['low', 'medium', 'heavy'])
});

const updateMomentSchema = createMomentSchema.partial();

// POST /api/moments - Create a new work moment
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validation = createMomentSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.error.errors
        }
      });
    }

    const { effort_text, context_note, state_after, energy_cost } = validation.data;

    const { data: moment, error } = await supabase
      .from('work_moments')
      .insert({
        user_id: req.userId,
        effort_text,
        context_note,
        state_after,
        energy_cost
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(moment);
  } catch (error) {
    console.error('Create moment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create work moment'
      }
    });
  }
});

// GET /api/moments - Get all moments for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date, state_after, energy_cost, limit = '50', offset = '0' } = req.query;

    let query = supabase
      .from('work_moments')
      .select('*', { count: 'exact' })
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

    if (date) {
      const targetDate = new Date(date as string).toISOString().split('T')[0];
      query = query.gte('created_at', `${targetDate}T00:00:00`).lt('created_at', `${targetDate}T23:59:59.999`);
    }

    if (state_after) {
      query = query.eq('state_after', state_after);
    }

    if (energy_cost) {
      query = query.eq('energy_cost', energy_cost);
    }

    const { data: moments, count, error } = await query;

    if (error) throw error;

    res.json({
      moments: moments || [],
      total: count || 0,
      hasMore: parseInt(offset as string) + (moments?.length || 0) < (count || 0)
    });
  } catch (error) {
    console.error('Get moments error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch moments'
      }
    });
  }
});

// GET /api/moments/today - Get today's moments
router.get('/today', async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: moments, error } = await supabase
      .from('work_moments')
      .select('*')
      .eq('user_id', req.userId)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59.999`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ moments: moments || [] });
  } catch (error) {
    console.error('Get today moments error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch today\'s moments'
      }
    });
  }
});

// GET /api/moments/timeline - Get moments grouped by day
router.get('/timeline', async (req: AuthRequest, res: Response) => {
  try {
    const { days = '7' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const { data: moments, error } = await supabase
      .from('work_moments')
      .select('*')
      .eq('user_id', req.userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by day
    const grouped: Record<string, any[]> = {};
    (moments || []).forEach((moment: any) => {
      const day = new Date(moment.created_at).toISOString().split('T')[0];
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(moment);
    });

    res.json({ timeline: grouped });
  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch timeline'
      }
    });
  }
});

// GET /api/moments/:id - Get single moment
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { data: moment, error } = await supabase
      .from('work_moments')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error || !moment) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Work moment not found'
        }
      });
    }

    res.json(moment);
  } catch (error) {
    console.error('Get moment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch moment'
      }
    });
  }
});

// PUT /api/moments/:id - Update moment
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const validation = updateMomentSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.error.errors
        }
      });
    }

    // Check ownership
    const { data: existing } = await supabase
      .from('work_moments')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Work moment not found'
        }
      });
    }

    const { data: moment, error } = await supabase
      .from('work_moments')
      .update(validation.data)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(moment);
  } catch (error) {
    console.error('Update moment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update moment'
      }
    });
  }
});

// DELETE /api/moments/:id - Delete moment
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { data: existing } = await supabase
      .from('work_moments')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Work moment not found'
        }
      });
    }

    const { error } = await supabase
      .from('work_moments')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete moment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete moment'
      }
    });
  }
});

export default router;
