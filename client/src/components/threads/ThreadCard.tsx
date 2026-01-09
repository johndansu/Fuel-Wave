import type { Thread } from '../../types';
import { format, formatDistanceToNow } from 'date-fns';

interface ThreadCardProps {
  thread: Thread;
  onClick?: () => void;
}

export function ThreadCard({ thread, onClick }: ThreadCardProps) {
  const frictionLevel = thread.friction_score >= 0.5 ? 'high' : 
                        thread.friction_score >= 0.25 ? 'medium' : 'low';

  const frictionColors = {
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-emerald-500',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
        thread.status === 'active' 
          ? 'border-gray-200 bg-white' 
          : 'border-gray-100 bg-gray-50 opacity-75'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-800">{thread.name}</h3>
        <span className={`text-xs px-2 py-1 rounded ${
          thread.status === 'active' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-gray-200 text-gray-600'
        }`}>
          {thread.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span title="Last activity">
          {formatDistanceToNow(new Date(thread.last_seen), { addSuffix: true })}
        </span>
        
        <span className={frictionColors[frictionLevel]} title="Friction score">
          {frictionLevel === 'high' ? '⚠️' : frictionLevel === 'medium' ? '◐' : '○'} 
          {' '}{Math.round(thread.friction_score * 100)}% friction
        </span>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Started {format(new Date(thread.first_seen), 'MMM d, yyyy')}
      </div>
    </div>
  );
}
