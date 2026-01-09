import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { workEntrySchema, updateWorkEntrySchema } from '../lib/validators.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/entries - Create a new work entry
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validation = workEntrySchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.error.errors
        }
      });
    }

    const { title, description, category, timeSpent, outcome, blockers } = validation.data;

    const { data: entry, error } = await supabase
      .from('work_entries')
      .insert({
        user_id: req.userId!,
        title,
        description,
        category,
        time_spent: timeSpent,
        outcome,
        blockers
      })
      .select()
      .single();

    if (error) throw error;

    // Create memory record
    await supabase
      .from('memories')
      .insert({
        work_entry_id: entry.id,
        searchable_text: `${title} ${description} ${blockers || ''}`
      });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create work entry'
      }
    });
  }
});

// GET /api/entries - Get all entries for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date, startDate, endDate, category, limit = '50', offset = '0' } = req.query;

    let query = supabase
      .from('work_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

    if (date) {
      const targetDate = new Date(date as string).toISOString().split('T')[0];
      query = query.gte('created_at', `${targetDate}T00:00:00`).lt('created_at', `${targetDate}T23:59:59`);
    } else {
      if (startDate) query = query.gte('created_at', new Date(startDate as string).toISOString());
      if (endDate) query = query.lte('created_at', new Date(endDate as string).toISOString());
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: entries, count, error } = await query;

    if (error) throw error;

    res.json({
      entries: entries || [],
      total: count || 0,
      hasMore: parseInt(offset as string) + (entries?.length || 0) < (count || 0)
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch entries'
      }
    });
  }
});

// GET /api/entries/:id - Get single entry
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { data: entry, error } = await supabase
      .from('work_entries')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error || !entry) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Work entry not found'
        }
      });
    }

    res.json(entry);
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch entry'
      }
    });
  }
});

// PUT /api/entries/:id - Update entry
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const validation = updateWorkEntrySchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validation.error.errors
        }
      });
    }

    // Check if entry exists and belongs to user
    const { data: existing } = await supabase
      .from('work_entries')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Work entry not found'
        }
      });
    }

    const { title, description, category, timeSpent, outcome, blockers } = validation.data;

    const { data: entry, error } = await supabase
      .from('work_entries')
      .update({
        title,
        description,
        category,
        time_spent: timeSpent,
        outcome,
        blockers,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Update searchable text
    if (title || description || blockers !== undefined) {
      await supabase
        .from('memories')
        .update({
          searchable_text: `${entry.title} ${entry.description} ${entry.blockers || ''}`
        })
        .eq('work_entry_id', entry.id);
    }

    res.json(entry);
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update entry'
      }
    });
  }
});

// DELETE /api/entries/:id - Delete entry
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    // Check if entry exists and belongs to user
    const { data: existing } = await supabase
      .from('work_entries')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (!existing) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Work entry not found'
        }
      });
    }

    const { error } = await supabase
      .from('work_entries')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete entry'
      }
    });
  }
});

export default router;
