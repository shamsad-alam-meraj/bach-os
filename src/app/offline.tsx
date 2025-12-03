'use client';

import { useEffect } from 'react';

export default function OfflinePage() {
  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online!');
      // Trigger sync for all data types
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          const syncManager = (registration as any).sync;
          if (syncManager) {
            syncManager.register('sync-meals');
            syncManager.register('sync-expenses');
            syncManager.register('sync-members');
            syncManager.register('sync-deposits');
            syncManager.register('sync-profile');
          }
        });
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">You're Offline</h1>
        <p className="text-text-muted mb-6">
          You can still access all cached pages and continue working with your data.
        </p>

        <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold mb-2 text-sm">What you can do offline:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Navigate all dashboard pages (analytics, reports, settings)</li>
            <li>• View and manage members (add, edit, view profiles)</li>
            <li>• Track meals (view records, add new entries)</li>
            <li>• Manage expenses (view, add, categorize)</li>
            <li>• Handle deposits (view stats, add transactions)</li>
            <li>• Access user management and profiles</li>
            <li>• Review cached data and statistics</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold"
        >
          Retry
        </button>

        <p className="text-xs text-muted-foreground mt-4">
          <strong>Tip:</strong> All pages are cached for offline use. Your changes will sync automatically when you're back online.
        </p>
      </div>
    </main>
  );
}
