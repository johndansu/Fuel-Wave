import { useState, useEffect } from 'react';
import { momentsApi } from '../../lib/api';
import { MomentCard } from './MomentCard';
import type { WorkMoment } from '../../types';
import { format, isToday, isYesterday } from 'date-fns';

interface TimelineProps {
  refreshTrigger?: number;
}

export function Timeline({ refreshTrigger }: TimelineProps) {
  const [timeline, setTimeline] = useState<Record<string, WorkMoment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadTimeline();
  }, [days, refreshTrigger]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const { timeline: data } = await momentsApi.getTimeline(days);
      setTimeline(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  const formatDayHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d');
  };

  const sortedDays = Object.keys(timeline).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-400">Loading timeline...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadTimeline}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (sortedDays.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No moments captured yet</p>
        <p className="text-gray-300 text-sm mt-2">
          Start by capturing your first work moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time range selector */}
      <div className="flex justify-end gap-2">
        {[7, 14, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-3 py-1 text-sm rounded ${
              days === d 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {d} days
          </button>
        ))}
      </div>

      {/* Timeline */}
      {sortedDays.map((day) => (
        <div key={day}>
          <h3 className="text-sm font-medium text-gray-500 mb-3 sticky top-0 bg-white py-2">
            {formatDayHeader(day)}
          </h3>
          <div className="space-y-3">
            {timeline[day].map((moment) => (
              <MomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
