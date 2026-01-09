import { Timeline } from '../components/moments/Timeline';

export function TimelinePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-700">Timeline</h1>
          <p className="text-sm text-gray-400 mt-1">
            What has your work looked like recently?
          </p>
        </div>
        
        <Timeline />
      </div>
    </div>
  );
}
