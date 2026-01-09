import { useState } from 'react';
import { momentsApi } from '../../lib/api';
import type { StateAfter, EnergyCost, WorkMomentInput } from '../../types';

interface MomentCaptureProps {
  onSuccess?: () => void;
}

export function MomentCapture({ onSuccess }: MomentCaptureProps) {
  const [effortText, setEffortText] = useState('');
  const [contextNote, setContextNote] = useState('');
  const [stateAfter, setStateAfter] = useState<StateAfter | ''>('');
  const [energyCost, setEnergyCost] = useState<EnergyCost | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!effortText.trim() || !stateAfter || !energyCost) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const moment: WorkMomentInput = {
        effort_text: effortText.trim(),
        context_note: contextNote.trim() || undefined,
        state_after: stateAfter,
        energy_cost: energyCost,
      };

      await momentsApi.create(moment);
      
      // Reset form
      setEffortText('');
      setContextNote('');
      setStateAfter('');
      setEnergyCost('');
      
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to capture moment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stateOptions: { value: StateAfter; label: string; color: string }[] = [
    { value: 'advanced', label: 'Advanced', color: 'bg-emerald-500' },
    { value: 'stuck', label: 'Stuck', color: 'bg-amber-500' },
    { value: 'resolved', label: 'Resolved', color: 'bg-blue-500' },
  ];

  const energyOptions: { value: EnergyCost; label: string; icon: string }[] = [
    { value: 'low', label: 'Low', icon: '○' },
    { value: 'medium', label: 'Medium', icon: '◐' },
    { value: 'heavy', label: 'Heavy', icon: '●' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main prompt */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-700 mb-2">
            What effort did you apply?
          </h2>
          <p className="text-sm text-gray-400">
            Capture a moment of work, not a task
          </p>
        </div>

        {/* Effort text */}
        <div>
          <textarea
            value={effortText}
            onChange={(e) => setEffortText(e.target.value)}
            placeholder="Describe the effort you applied..."
            className="w-full h-32 p-4 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            required
          />
        </div>

        {/* Context note */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Context note (optional)
          </label>
          <input
            type="text"
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
            placeholder="Any additional context..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* State after */}
        <div>
          <label className="block text-sm text-gray-500 mb-3">
            How did it end?
          </label>
          <div className="flex gap-3">
            {stateOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStateAfter(option.value)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  stateAfter === option.value
                    ? `border-gray-800 ${option.color} text-white`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Energy cost */}
        <div>
          <label className="block text-sm text-gray-500 mb-3">
            Energy cost
          </label>
          <div className="flex gap-3">
            {energyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setEnergyCost(option.value)}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  energyCost === option.value
                    ? 'border-gray-800 bg-gray-800 text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !effortText.trim() || !stateAfter || !energyCost}
          className="w-full py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Capturing...' : 'Capture Moment'}
        </button>
      </form>
    </div>
  );
}
