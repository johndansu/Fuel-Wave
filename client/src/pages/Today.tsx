import { useState } from 'react';
import { MomentCapture } from '../components/moments/MomentCapture';
import { Timeline } from '../components/moments/Timeline';

export function Today() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    // Optionally show timeline after capture
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setShowTimeline(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showTimeline 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Capture
            </button>
            <button
              onClick={() => setShowTimeline(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showTimeline 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Today's Moments
            </button>
          </div>
        </div>

        {/* Content */}
        {showTimeline ? (
          <Timeline refreshTrigger={refreshTrigger} />
        ) : (
          <MomentCapture onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
}
