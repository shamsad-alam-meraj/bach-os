'use client';

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">You're Offline</h1>
        <p className="text-text-muted mb-8">
          You can still view cached content. Your changes will sync when you're back online.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
