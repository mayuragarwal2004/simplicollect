import { useEffect, useState } from 'react';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [networkType, setNetworkType] = useState<string>('unknown');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Get initial network status
      Network.getStatus().then(status => {
        setIsOnline(status.connected);
        setNetworkType(status.connectionType);
      });

      // Listen for network changes
      let listenerHandle: PluginListenerHandle | null = null;
      Network.addListener('networkStatusChange', status => {
        setIsOnline(status.connected);
        setNetworkType(status.connectionType);
      }).then(handle => {
        listenerHandle = handle;
      });

      return () => {
        if (listenerHandle) {
          listenerHandle.remove();
        }
      };
    } else {
      // Web fallback
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return { isOnline, networkType };
};
