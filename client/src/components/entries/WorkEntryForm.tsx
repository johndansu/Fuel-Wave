import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { entriesApi } from '@/lib/api';
import type { WorkEntryInput } from '@/types';

interface WorkEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WorkEntryForm({ open, onOpenChange, onSuccess }: WorkEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<WorkEntryInput>({
    title: '',
    description: '',
    category: 'project',
    timeSpent: null,
    outcome: 'done',
    blockers: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await entriesApi.create(formData);
      setFormData({
        title: '',
        description: '',
        category: 'project',
        timeSpent: null,
        outcome: 'done',
        blockers: null,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save work entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>What did you work on?</DialogTitle>
          <DialogDescription>
            Capture this moment of work as a memory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What did you work on?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you did, decisions made, context..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Outcome</Label>
              <Select
                value={formData.outcome}
                onValueChange={(value: any) => setFormData({ ...formData, outcome: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="stuck">Stuck</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeSpent">Time spent (minutes, optional)</Label>
            <Input
              id="timeSpent"
              type="number"
              placeholder="e.g., 60"
              value={formData.timeSpent || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                timeSpent: e.target.value ? parseInt(e.target.value) : null 
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blockers">Blockers (optional)</Label>
            <Textarea
              id="blockers"
              placeholder="Any blockers or challenges?"
              value={formData.blockers || ''}
              onChange={(e) => setFormData({ ...formData, blockers: e.target.value || null })}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Memory'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
