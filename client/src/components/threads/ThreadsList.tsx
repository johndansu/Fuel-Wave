import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { threadsApi } from '../../lib/api';
import { ThreadCard } from './ThreadCard';
import type { Thread } from '../../types';

export function ThreadsList() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'dormant'>('all');

  useEffect(() => {
    loadThreads();
  }, [filter]);

  const loadThreads = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : undefined;
      const { threads: data } = await threadsApi.getAll(params);
      setThreads(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load threads');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-400">Loading threads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadThreads}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Context Threads</h2>
          <p className="text-sm text-gray-400">
            Lines of continued effort over time
          </p>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2">
          {(['all', 'active', 'dormant'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded capitalize ${
                filter === f 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Threads list */}
      {threads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No threads yet</p>
          <p className="text-gray-300 text-sm mt-2">
            Threads emerge naturally from your work moments
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {threads.map((thread) => (
            <ThreadCard 
              key={thread.id} 
              thread={thread}
              onClick={() => navigate(`/threads/${thread.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
