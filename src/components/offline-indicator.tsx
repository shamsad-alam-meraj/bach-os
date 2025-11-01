'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg shadow-lg z-40 md:bottom-6 md:left-6">
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium">You're offline - using cached data</span>
    </div>
  );
}
