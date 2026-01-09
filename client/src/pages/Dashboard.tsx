import { Timeline } from '@/components/timeline/Timeline';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-700">Work Entries</h1>
          <p className="text-sm text-gray-400 mt-1">
            Your work memory with categories, time tracking, and outcomes
          </p>
        </div>
        
        <Timeline />
      </div>
    </div>
  );
}
