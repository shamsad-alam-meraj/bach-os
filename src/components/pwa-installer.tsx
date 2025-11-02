'use client';

import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Install bachOS</h3>
            <p className="text-sm opacity-90">Install bachOS for quick access</p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-primary-foreground hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleInstall}
          className="flex-1 bg-primary-foreground text-primary px-4 py-2 rounded font-semibold hover:opacity-90 transition-opacity text-sm"
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-1 bg-primary-foreground/20 text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary-foreground/30 transition-colors text-sm"
        >
          Later
        </button>
      </div>
    </div>
  );
}
