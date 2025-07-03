import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';

interface NotificationContextType {
  isSupported: boolean;
  isEnabled: boolean;
  permission: NotificationPermission | null;
    setPermission: (permission: NotificationPermission | null) => void; 
  loading: boolean;
  error: string | null;
  notificationsBlocked: boolean;
  refreshStatus: () => void; 
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      setIsSupported(true);
      setIsEnabled(Notification.permission === 'granted');
    } else if (Capacitor.isNativePlatform()) {
      setPermission(null);
      setIsSupported(true);
      // For native, you may want to check using Capacitor APIs if notifications are enabled
      setIsEnabled(true); // Assume enabled for now, can be improved
    } else {
      setPermission(null);
      setIsSupported(false);
      setIsEnabled(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Listen for pushPermissionChanged events from CapacitorPushService
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail && typeof detail.permission === 'string') {
        console.log("Push permission changed:", detail.permission);
        setPermission(detail.permission);
        setIsEnabled(detail.permission === 'granted');
      }
    };
    window.addEventListener('pushPermissionChanged', handler);
    return () => {
      window.removeEventListener('pushPermissionChanged', handler);
    };
  }, []);

  const refreshStatus = () => {
    checkStatus();
  };

  const notificationsBlocked = permission === 'denied';

  return (
    <NotificationContext.Provider
      value={{
        isSupported,
        isEnabled: isEnabled && !notificationsBlocked,
        permission,
        setPermission,
        loading,
        error,
        notificationsBlocked,
        refreshStatus,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
  return ctx;
};
