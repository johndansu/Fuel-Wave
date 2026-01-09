import { ThreadView } from '../components/threads/ThreadView';

export function ThreadDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ThreadView />
      </div>
    </div>
  );
}
