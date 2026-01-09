import { useEffect, useState, useCallback } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EntryCard } from '@/components/entries/EntryCard';
import { WorkEntryForm } from '@/components/entries/WorkEntryForm';
import { entriesApi } from '@/lib/api';
import type { WorkEntry } from '@/types';

interface GroupedEntries {
  [date: string]: WorkEntry[];
}

function formatDateHeader(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMMM d, yyyy');
}

function groupEntriesByDate(entries: WorkEntry[]): GroupedEntries {
  return entries.reduce((groups, entry) => {
    const date = format(new Date(entry.createdAt), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as GroupedEntries);
}

export function Timeline() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchEntries = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      const offset = reset ? 0 : entries.length;
      const response = await entriesApi.getAll({ limit: 50, offset });
      
      if (reset) {
        setEntries(response.entries);
      } else {
        setEntries(prev => [...prev, ...response.entries]);
      }
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [entries.length]);

  useEffect(() => {
    fetchEntries(true);
  }, []);

  const handleEntryCreated = () => {
    fetchEntries(true);
  };

  const groupedEntries = groupEntriesByDate(entries);
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Work Memory</h1>
          <p className="text-muted-foreground">A timeline of your efforts and context</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Work
        </Button>
      </div>

      {isLoading && entries.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No work memories yet.</p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Record your first work
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date}>
              <h2 className="text-sm font-semibold text-muted-foreground mb-4 sticky top-0 bg-background py-2">
                {formatDateHeader(date)}
              </h2>
              <div className="space-y-3">
                {groupedEntries[date].map(entry => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center py-4">
              <Button 
                variant="outline" 
                onClick={() => fetchEntries(false)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      <WorkEntryForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSuccess={handleEntryCreated}
      />
    </div>
  );
}
