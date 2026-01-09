import { Router, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// GET /api/insights - Get reflection insights
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { period = 'week' } = req.query;

    const now = new Date();
    const startDate = new Date();
    
    if (period === 'month') {
      startDate.setDate(now.getDate() - 30);
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    const { data: entries, error } = await supabase
      .from('work_entries')
      .select('*')
      .eq('user_id', req.userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const entriesData = entries || [];

    // Calculate total time logged
    const totalTimeLogged = entriesData.reduce((sum: number, entry: any) => sum + (entry.time_spent || 0), 0);

    // Calculate category breakdown
    const categoryBreakdown: Record<string, number> = {
      project: 0,
      study: 0,
      personal: 0,
      client: 0
    };
    
    entriesData.forEach((entry: any) => {
      if (categoryBreakdown[entry.category] !== undefined) {
        categoryBreakdown[entry.category]++;
      }
    });

    // Find most frequent category
    const mostFrequentCategory = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Calculate inactive days
    const activeDays = new Set(
      entriesData.map((entry: any) => new Date(entry.created_at).toISOString().split('T')[0])
    );

    const inactiveDays: string[] = [];
    const checkDate = new Date(startDate);
    while (checkDate <= now) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (!activeDays.has(dateStr)) {
        inactiveDays.push(dateStr);
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }

    // Find stale projects (not worked on in 14+ days)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);

    const recentTitles = new Set(
      entriesData
        .filter((e: any) => new Date(e.created_at) >= twoWeeksAgo)
        .map((e: any) => e.title.toLowerCase())
    );

    // Get all entries for stale project detection
    const { data: allEntries } = await supabase
      .from('work_entries')
      .select('title, created_at')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    const seenTitles = new Set<string>();
    const staleProjects = (allEntries || [])
      .filter((entry: any) => {
        const titleLower = entry.title.toLowerCase();
        if (seenTitles.has(titleLower)) return false;
        seenTitles.add(titleLower);
        return !recentTitles.has(titleLower) && new Date(entry.created_at) < twoWeeksAgo;
      })
      .slice(0, 5)
      .map((entry: any) => ({
        title: entry.title,
        lastWorkedOn: entry.created_at,
        daysSince: Math.floor((now.getTime() - new Date(entry.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }));

    res.json({
      period,
      totalTimeLogged,
      entryCount: entriesData.length,
      mostFrequentCategory,
      categoryBreakdown,
      inactiveDays,
      staleProjects
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch insights'
      }
    });
  }
});

export default router;
