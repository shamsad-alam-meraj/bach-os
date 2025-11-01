export const isPWAInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check if running as PWA
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

export const requestPWAInstall = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  const event = (window as any).deferredPrompt;
  if (!event) return false;

  event.prompt();
  const { outcome } = await event.userChoice;
  return outcome === 'accepted';
};

export const syncData = async (endpoint: string, data: any): Promise<any> => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
};

export const getOfflineData = (key: string): any => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(`offline_${key}`);
  return data ? JSON.parse(data) : null;
};

export const setOfflineData = (key: string, data: any): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`offline_${key}`, JSON.stringify(data));
};
