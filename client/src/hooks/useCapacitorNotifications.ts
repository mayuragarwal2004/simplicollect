import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import CapacitorPushService from '../services/capacitorPushService';
import { useAuth } from '../context/AuthContext';
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
  const { isAuthenticated } = useAuth();

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

  // Watch for authentication state changes
  useEffect(() => {
    if (isSupported) {
      const service = CapacitorPushService.getInstance();
      
      console.log('useCapacitorNotifications: Auth state changed:', isAuthenticated);
      console.log('useCapacitorNotifications: Service debug info:', service.getDebugInfo());
      
      // Notify the service about auth state change
      service.onAuthStateChange(isAuthenticated);
      
      // Also manually check and send token if needed
      service.checkAuthAndSendToken(isAuthenticated);
    }
  }, [isAuthenticated, isSupported]);

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

  const handleNotificationNavigation = (event: CustomEvent<{ 
    route: string; 
    originalRoute?: string; 
    customData?: any; 
    action?: string; 
    source?: string; 
  }>) => {
    const { route, originalRoute, customData, action, source } = event.detail;
    
    console.log('Capacitor notification navigation:', {
      route,
      originalRoute,
      customData,
      action,
      source
    });
    
    // Use global navigation instead of React Router's navigate
    if (route) {
      // Check if we're already on the target route
      if (route !== window.location.pathname + window.location.search) {
        // Use window.location for navigation (will work regardless of router context)
        window.location.href = route;
      }
      
      // Show a toast with context about the navigation
      const actionText = action === 'approve_payment' ? 'Payment approval' 
                        : action === 'view_meeting_details' ? 'Meeting details'
                        : action === 'view_report' ? 'Report'
                        : 'Notification';
      
      toast.success(`Navigating to ${actionText}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      console.warn('No route provided in notification navigation event');
      toast.warn('Unable to navigate - no route specified');
    }
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

  const getDebugInfo = () => {
    if (!isSupported) {
      return { error: 'Capacitor not supported' };
    }
    return CapacitorPushService.getInstance().getDebugInfo();
  };

  const forceSendToken = () => {
    if (!isSupported) {
      return;
    }
    CapacitorPushService.getInstance().forceSendToken();
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

export default useCapacitorNotifications;
