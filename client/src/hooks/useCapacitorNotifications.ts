import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import CapacitorPushService from '../services/capacitorPushService';
import { toast } from 'react-toastify';

interface NotificationEvent {
  title?: string;
  body?: string;
  data?: any;
}

export const useCapacitorNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    setIsSupported(isNative);

    if (isNative) {
      initializeService();
      setupEventListeners();
    }

    return () => {
      // Cleanup listeners when component unmounts
      if (isNative) {
        CapacitorPushService.getInstance().destroy();
      }
    };
  }, []);

  const initializeService = async () => {
    try {
      await CapacitorPushService.getInstance().initialize();
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize push notifications';
      setError(errorMessage);
      console.error('Capacitor push service initialization error:', err);
    }
  };

  const setupEventListeners = () => {
    // Listen for foreground notifications
    window.addEventListener('foregroundNotification', handleForegroundNotification);
    
    // Listen for notification navigation
    window.addEventListener('notificationNavigation', handleNotificationNavigation);
  };

  const handleForegroundNotification = (event: CustomEvent<NotificationEvent>) => {
    const { title, body } = event.detail;
    
    if (title && body) {
      // Show toast notification
      toast.info(`${title}: ${body}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleNotificationNavigation = (event: CustomEvent<{ route: string }>) => {
    const { route } = event.detail;
    
    // You can use React Router or your navigation system here
    // For example, if using React Router:
    // history.push(route);
    
    console.log('Navigate to route:', route);
    
    // For now, we'll just show a toast with the route
    toast.info(`Navigating to: ${route}`);
  };

  const getDeliveredNotifications = async () => {
    if (!isSupported || !isInitialized) {
      return [];
    }

    try {
      return await CapacitorPushService.getInstance().getDeliveredNotifications();
    } catch (err) {
      console.error('Error getting delivered notifications:', err);
      return [];
    }
  };

  const removeDeliveredNotifications = async (ids: string[]) => {
    if (!isSupported || !isInitialized) {
      return;
    }

    try {
      await CapacitorPushService.getInstance().removeDeliveredNotifications(ids);
      toast.success('Notifications cleared');
    } catch (err) {
      console.error('Error removing notifications:', err);
      toast.error('Failed to clear notifications');
    }
  };

  const removeAllDeliveredNotifications = async () => {
    if (!isSupported || !isInitialized) {
      return;
    }

    try {
      await CapacitorPushService.getInstance().removeAllDeliveredNotifications();
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Error removing all notifications:', err);
      toast.error('Failed to clear all notifications');
    }
  };

  return {
    isSupported,
    isInitialized,
    error,
    getDeliveredNotifications,
    removeDeliveredNotifications,
    removeAllDeliveredNotifications,
  };
};

export default useCapacitorNotifications;
