import { useState, useEffect, useCallback } from 'react';

export interface OnlineStatusState {
  isOnline: boolean;
  isRealOnline: boolean;
  isSimulated: boolean;
  justReconnected: boolean;
  reconnectTimestamp: number | null;
  toggleSimulateOffline: () => void;
  setSimulatedOffline: (value: boolean) => void;
}

export function useOnlineStatus(): OnlineStatusState {
  const [isRealOnline, setIsRealOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isSimulated, setIsSimulated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sg_simulated_offline') === 'true';
    } catch {
      return false;
    }
  });

  const [justReconnected, setJustReconnected] = useState<boolean>(false);
  const [reconnectTimestamp, setReconnectTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsRealOnline(true);
      if (!isSimulated) {
        setJustReconnected(true);
        setReconnectTimestamp(Date.now());
        const timer = setTimeout(() => setJustReconnected(false), 4000);
        return () => clearTimeout(timer);
      }
    };

    const handleOffline = () => {
      setIsRealOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulated]);

  const toggleSimulateOffline = useCallback(() => {
    setIsSimulated((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem('sg_simulated_offline', String(next));
      } catch {}
      if (!next && isRealOnline) {
        setJustReconnected(true);
        setReconnectTimestamp(Date.now());
        setTimeout(() => setJustReconnected(false), 4000);
      } else {
        setJustReconnected(false);
      }
      return next;
    });
  }, [isRealOnline]);

  const setSimulatedOffline = useCallback((val: boolean) => {
    setIsSimulated(val);
    try {
      sessionStorage.setItem('sg_simulated_offline', String(val));
    } catch {}
    if (!val && isRealOnline) {
      setJustReconnected(true);
      setReconnectTimestamp(Date.now());
      setTimeout(() => setJustReconnected(false), 4000);
    }
  }, [isRealOnline]);

  const effectiveIsOnline = isRealOnline && !isSimulated;

  return {
    isOnline: effectiveIsOnline,
    isRealOnline,
    isSimulated,
    justReconnected,
    reconnectTimestamp,
    toggleSimulateOffline,
    setSimulatedOffline,
  };
}
