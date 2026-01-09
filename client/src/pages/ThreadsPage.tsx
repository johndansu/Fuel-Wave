import { ThreadsList } from '../components/threads/ThreadsList';

export function ThreadsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ThreadsList />
      </div>
    </div>
  );
}
