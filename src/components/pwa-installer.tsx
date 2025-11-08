'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    console.log('Setting up PWA installer...');

    // Check if app is already in standalone mode
    const isInStandaloneMode = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      );
    };

    if (isInStandaloneMode()) {
      console.log('App is already in standalone mode');
      return;
    }

    const handler = (e: Event) => {
      console.log('🔔 beforeinstallprompt event fired');

      // Store the event but don't prevent default
      const beforeInstallEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(beforeInstallEvent);

      // Let the browser handle the prompt automatically
      // We'll just store the event in case we want to trigger it manually later
    };

    const installedHandler = () => {
      console.log('✅ App installed successfully');
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, [isClient]);

  // This component doesn't render anything
  // It just sets up the event listeners and lets the browser handle the prompt
  return null;
}
