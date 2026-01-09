import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { threadsApi } from '../../lib/api';
import { MomentCard } from '../moments/MomentCard';
import type { Thread } from '../../types';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

export function ThreadView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) loadThread();
  }, [id]);

  const loadThread = async () => {
    try {
      setLoading(true);
      const data = await threadsApi.getById(id!);
      setThread(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load thread');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!thread) return;
    try {
      const newStatus = thread.status === 'active' ? 'dormant' : 'active';
      const updated = await threadsApi.update(thread.id, { status: newStatus });
      setThread(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-400">Loading thread...</div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Thread not found'}</p>
        <button 
          onClick={() => navigate('/threads')}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Back to threads
        </button>
      </div>
    );
  }

  const moments = thread.moments || [];
  const stuckCount = moments.filter(m => m.state_after === 'stuck').length;
  const advancedCount = moments.filter(m => m.state_after === 'advanced').length;
  const resolvedCount = moments.filter(m => m.state_after === 'resolved').length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/threads')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={18} />
          Back to threads
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{thread.name}</h1>
            <p className="text-gray-500 mt-1">
              Started {format(new Date(thread.first_seen), 'MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={toggleStatus}
            className={`px-3 py-1 rounded text-sm ${
              thread.status === 'active'
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {thread.status === 'active' ? 'Active' : 'Dormant'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <div className="text-2xl font-semibold text-gray-800">{moments.length}</div>
          <div className="text-sm text-gray-500">Moments</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg text-center">
          <div className="text-2xl font-semibold text-emerald-600">{advancedCount}</div>
          <div className="text-sm text-gray-500">Advanced</div>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg text-center">
          <div className="text-2xl font-semibold text-amber-600">{stuckCount}</div>
          <div className="text-sm text-gray-500">Stuck</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <div className="text-2xl font-semibold text-blue-600">{resolvedCount}</div>
          <div className="text-sm text-gray-500">Resolved</div>
        </div>
      </div>

      {/* Friction indicator */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Friction Score</span>
          <span className={`font-medium ${
            thread.friction_score >= 0.5 ? 'text-red-500' :
            thread.friction_score >= 0.25 ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {Math.round(thread.friction_score * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              thread.friction_score >= 0.5 ? 'bg-red-500' :
              thread.friction_score >= 0.25 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${thread.friction_score * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Based on how often moments end as "Stuck"
        </p>
      </div>

      {/* Journey */}
      <div>
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          The Journey
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          How this thread actually unfolded over time
        </p>

        {moments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No moments linked to this thread yet
          </p>
        ) : (
          <div className="space-y-4">
            {moments.map((moment, index) => (
              <div key={moment.id} className="relative">
                {index < moments.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-px bg-gray-200" />
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 text-xs text-gray-400 pt-4">
                    {format(new Date(moment.created_at), 'MMM d')}
                  </div>
                  <div className="flex-1">
                    <MomentCard moment={moment} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
