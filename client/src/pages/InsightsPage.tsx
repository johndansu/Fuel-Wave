import { useState, useEffect } from 'react';
import { insightsApi } from '../lib/api';
import type { Insights } from '../types';

export function InsightsPage() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadInsights();
  }, [period]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await insightsApi.get(period);
      setInsights(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button onClick={loadInsights} className="mt-4 text-gray-600 hover:text-gray-800">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light text-gray-700">Reflection Insights</h1>
            <p className="text-sm text-gray-400 mt-1">
              Patterns emerging from your work memory
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg text-sm ${
                period === 'week' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm ${
                period === 'month' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {insights && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <div className="text-3xl font-semibold text-gray-800">
                  {insights.entryCount}
                </div>
                <div className="text-sm text-gray-500 mt-1">Work Entries</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <div className="text-3xl font-semibold text-gray-800">
                  {Math.round(insights.totalTimeLogged / 60)}h
                </div>
                <div className="text-sm text-gray-500 mt-1">Time Logged</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <div className="text-3xl font-semibold text-gray-800 capitalize">
                  {insights.mostFrequentCategory || '—'}
                </div>
                <div className="text-sm text-gray-500 mt-1">Top Category</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <div className="text-3xl font-semibold text-gray-800">
                  {insights.inactiveDays.length}
                </div>
                <div className="text-sm text-gray-500 mt-1">Inactive Days</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="font-medium text-gray-700 mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(insights.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-gray-500 capitalize">{category}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gray-800 h-2 rounded-full"
                        style={{
                          width: `${insights.entryCount > 0 ? (count / insights.entryCount) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stale Projects */}
            {insights.staleProjects.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="font-medium text-gray-700 mb-4">Projects Not Revisited</h3>
                <p className="text-sm text-gray-400 mb-4">
                  These haven't been worked on in 14+ days
                </p>
                <div className="space-y-3">
                  {insights.staleProjects.map((project, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-gray-700">{project.title}</span>
                      <span className="text-sm text-gray-400">
                        {project.daysSince} days ago
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Days */}
            {insights.inactiveDays.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="font-medium text-gray-700 mb-4">Inactive Days</h3>
                <div className="flex flex-wrap gap-2">
                  {insights.inactiveDays.slice(0, 10).map((day) => (
                    <span key={day} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                      {new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  ))}
                  {insights.inactiveDays.length > 10 && (
                    <span className="px-3 py-1 text-gray-400 text-sm">
                      +{insights.inactiveDays.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
