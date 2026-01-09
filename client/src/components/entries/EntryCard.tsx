import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, AlertCircle, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { WorkEntry } from '@/types';

interface EntryCardProps {
  entry: WorkEntry;
}

const categoryColors: Record<string, string> = {
  project: 'bg-blue-100 text-blue-800',
  study: 'bg-purple-100 text-purple-800',
  personal: 'bg-green-100 text-green-800',
  client: 'bg-orange-100 text-orange-800',
};

const outcomeIcons: Record<string, React.ReactNode> = {
  done: <CheckCircle className="h-4 w-4 text-green-600" />,
  partial: <Circle className="h-4 w-4 text-yellow-600" />,
  stuck: <AlertCircle className="h-4 w-4 text-red-600" />,
};

export function EntryCard({ entry }: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader 
        className="cursor-pointer py-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {outcomeIcons[entry.outcome]}
              <h3 className="font-medium truncate">{entry.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', categoryColors[entry.category])}>
                {entry.category}
              </span>
              {entry.timeSpent && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {entry.timeSpent} min
                </span>
              )}
              <span>{format(new Date(entry.createdAt), 'h:mm a')}</span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 pb-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {entry.description}
              </p>
            </div>
            {entry.blockers && (
              <div className="p-3 bg-red-50 rounded-md">
                <p className="text-sm font-medium text-red-800 mb-1">Blockers</p>
                <p className="text-sm text-red-700">{entry.blockers}</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
