import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

/**
 * Simple hook for Capacitor push notifications
 * Works with PushNotificationManager component for auth-aware token handling
 */
export const useCapacitorPushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    setIsSupported(isNative);
    setIsInitialized(isNative); // Native platform means it can be initialized
  }, []);

  useEffect(() => {
    if (isSupported) {
      // Listen for foreground notifications and show toasts
      const handleForegroundNotification = (event) => {
        const { title, body } = event.detail;
        if (title && body) {
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

      const handleNotificationNavigation = (event) => {
        const { route } = event.detail;
        console.log('Navigate to route:', route);
        toast.info(`Navigating to: ${route}`);
      };

      window.addEventListener('foregroundNotification', handleForegroundNotification);
      window.addEventListener('notificationNavigation', handleNotificationNavigation);

      return () => {
        window.removeEventListener('foregroundNotification', handleForegroundNotification);
        window.removeEventListener('notificationNavigation', handleNotificationNavigation);
      };
    }
  }, [isSupported]);

  const getDeliveredNotifications = async () => {
    if (!isSupported) {
      return [];
    }

    try {
      const result = await PushNotifications.getDeliveredNotifications();
      return result.notifications;
    } catch (err) {
      console.error('Error getting delivered notifications:', err);
      return [];
    }
  };

  const removeDeliveredNotifications = async (ids) => {
    if (!isSupported) {
      return;
    }

    try {
      await PushNotifications.removeDeliveredNotifications({
        notifications: ids.map((id) => ({
          id,
          title: '',
          body: '',
          data: {},
        })),
      });
      toast.success('Notifications cleared');
    } catch (err) {
      console.error('Error removing notifications:', err);
      toast.error('Failed to clear notifications');
    }
  };

  const removeAllDeliveredNotifications = async () => {
    if (!isSupported) {
      return;
    }

    try {
      await PushNotifications.removeAllDeliveredNotifications();
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Error removing all notifications:', err);
      toast.error('Failed to clear all notifications');
    }
  };

  const getDebugInfo = () => {
    if (!isSupported) {
      return { error: 'Capacitor not supported' };
    }

    const storedToken = localStorage.getItem('fcm_token');
    const tokenSent = localStorage.getItem('fcm_token_sent');

    return {
      isSupported,
      isInitialized,
      isAuthenticated,
      hasStoredToken: !!storedToken,
      tokenSent: tokenSent === 'true',
      storedToken: storedToken ? storedToken.substring(0, 20) + '...' : null,
      isNativePlatform: Capacitor.isNativePlatform(),
      platform: Capacitor.getPlatform(),
    };
  };

  const forceSendToken = async () => {
    if (!isSupported || !isAuthenticated) {
      toast.error('Cannot send token: not supported or not authenticated');
      return;
    }

    const storedToken = localStorage.getItem('fcm_token');
    if (!storedToken) {
      toast.error('No token found to send');
      return;
    }

    try {
      const { axiosInstance } = await import('@/utils/config');
      
      const response = await axiosInstance.post('/api/notifications/fcm/subscribe', {
        token: storedToken,
        platform: Capacitor.getPlatform(),
      });

      localStorage.setItem('fcm_token_sent', 'true');
      toast.success('Token sent successfully!');
      console.log('Force send token response:', response.data);
    } catch (error) {
      console.error('Error force sending token:', error);
      toast.error('Failed to send token');
    }
  };

  return {
    isSupported,
    isInitialized,
    error,
    getDeliveredNotifications,
    removeDeliveredNotifications,
    removeAllDeliveredNotifications,
    getDebugInfo,
    forceSendToken,
  };
};

export default useCapacitorPushNotifications;
