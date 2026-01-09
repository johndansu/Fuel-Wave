import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/search - Search through work memories
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { q, category, limit = '20' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Search query is required'
        }
      });
    }

    let query = supabase
      .from('work_entries')
      .select('*')
      .eq('user_id', req.userId)
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,blockers.ilike.%${q}%`)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit as string));

    if (category) {
      query = query.eq('category', category);
    }

    const { data: entries, error } = await query;

    if (error) throw error;

    res.json({
      results: entries || [],
      total: entries?.length || 0
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to search entries'
      }
    });
  }
});

export default router;
