interface OfflineData {
  id: string;
  type: 'meal' | 'expense' | 'member' | 'deposit' | 'profile';
  operation: 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  data?: any;
  timestamp: number;
  synced: boolean;
}

let db: IDBDatabase | null = null;

export const initOfflineStorage = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bachOSDB', 2);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains('offlineData')) {
        database.createObjectStore('offlineData', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('syncQueue')) {
        database.createObjectStore('syncQueue', { keyPath: 'id' });
      }
      // Handle migration from version 1 to 2
      if (event.oldVersion < 2) {
        // The interface change is backward compatible as we added optional fields
      }
    };
  });
};

export const saveOfflineData = async (
  type: 'meal' | 'expense' | 'member' | 'deposit' | 'profile',
  operation: 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<void> => {
  if (!db) await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(['offlineData'], 'readwrite');
    const store = transaction.objectStore('offlineData');
    const offlineData: OfflineData = {
      id: `${type}-${operation}-${Date.now()}`,
      type,
      operation,
      endpoint,
      data,
      timestamp: Date.now(),
      synced: false,
    };

    const request = store.add(offlineData);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getOfflineData = async (
  type?: 'meal' | 'expense' | 'member' | 'deposit' | 'profile',
  operation?: 'POST' | 'PUT' | 'DELETE'
): Promise<OfflineData[]> => {
  if (!db) await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(['offlineData'], 'readonly');
    const store = transaction.objectStore('offlineData');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const data = request.result;
      let filtered = data.filter((item) => !item.synced);

      if (type) {
        filtered = filtered.filter((item) => item.type === type);
      }

      if (operation) {
        filtered = filtered.filter((item) => item.operation === operation);
      }

      resolve(filtered);
    };
  });
};

export const deleteOfflineData = async (id: string): Promise<void> => {
  if (!db) await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(['offlineData'], 'readwrite');
    const store = transaction.objectStore('offlineData');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const markAsSynced = async (id: string): Promise<void> => {
  if (!db) await initOfflineStorage();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction(['offlineData'], 'readwrite');
    const store = transaction.objectStore('offlineData');
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        data.synced = true;
        const updateRequest = store.put(data);
        updateRequest.onerror = () => reject(updateRequest.error);
        updateRequest.onsuccess = () => resolve();
      }
    };
  });
};

export const isOnline = (): boolean => {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
};

export const registerSyncListener = (callback: () => void): void => {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
};
