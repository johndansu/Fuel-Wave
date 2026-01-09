import { useState } from 'react';
import { momentsApi, threadsApi } from '../../lib/api';
import { MomentCard } from '../moments/MomentCard';
import { ThreadCard } from '../threads/ThreadCard';
import { useNavigate } from 'react-router-dom';
import type { WorkMoment, Thread } from '../../types';
import { Search } from 'lucide-react';

export function Recall() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [moments, setMoments] = useState<WorkMoment[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      // Search moments - get all and filter client-side for now
      // In production, you'd add a search endpoint
      const [momentsRes, threadsRes] = await Promise.all([
        momentsApi.getAll({ limit: 100 }),
        threadsApi.getAll({ limit: 50 })
      ]);

      const q = query.toLowerCase();
      
      // Filter moments by effort_text or context_note
      const filteredMoments = momentsRes.moments.filter(m => 
        m.effort_text.toLowerCase().includes(q) ||
        (m.context_note && m.context_note.toLowerCase().includes(q))
      );

      // Filter threads by name
      const filteredThreads = threadsRes.threads.filter(t =>
        t.name.toLowerCase().includes(q)
      );

      setMoments(filteredMoments);
      setThreads(filteredThreads);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-gray-700 mb-2">
          Find the moment you're thinking about
        </h2>
        <p className="text-sm text-gray-400">
          Search through your work memory
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search moments and threads..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-400">Searching...</div>
        </div>
      ) : searched ? (
        <div className="space-y-8">
          {/* Threads */}
          {threads.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Threads ({threads.length})
              </h3>
              <div className="space-y-3">
                {threads.map((thread) => (
                  <ThreadCard 
                    key={thread.id} 
                    thread={thread}
                    onClick={() => navigate(`/threads/${thread.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Moments */}
          {moments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Moments ({moments.length})
              </h3>
              <div className="space-y-3">
                {moments.map((moment) => (
                  <MomentCard key={moment.id} moment={moment} />
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {moments.length === 0 && threads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No results found for "{query}"</p>
              <p className="text-sm text-gray-300 mt-2">
                Try different keywords
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-300">
          <p>Start typing to search your work memory</p>
        </div>
      )}
    </div>
  );
}
