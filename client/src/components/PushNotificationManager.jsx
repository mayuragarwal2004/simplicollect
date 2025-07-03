import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { useAuth } from '@/context/AuthContext';
import { useNotificationContext } from '@/context/NotificationContext';
import { axiosInstance } from '@/utils/config';

/**
 * PushNotificationManager - A React component that handles authentication-aware push notifications
 * This component should be placed in your App.jsx or main component to automatically handle
 * push notification token registration when users login/logout.
 */
export const PushNotificationManager = () => {
  const { isAuthenticated } = useAuth();
  const { setFcmToken } = useNotificationContext();

  useEffect(() => {
    // Only initialize on native platforms
    if (!Capacitor.isNativePlatform()) {
      console.log('PushNotificationManager: Not a native platform, skipping initialization');
      return;
    }

    initializePushNotifications();
  }, []);

  // Watch for authentication state changes
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      console.log('PushNotificationManager: Auth state changed:', isAuthenticated);
      
      if (isAuthenticated) {
        // User just logged in, try to get the current token and send it
        handleAuthenticationChange();
      }
    }
  }, [isAuthenticated]);

  const initializePushNotifications = async () => {
    try {
      console.log('PushNotificationManager: Initializing push notifications...');

      // Request permissions
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') {
        console.warn('PushNotificationManager: Push notification permission not granted');
        return;
      }

      // Register for push notifications
      await PushNotifications.register();

      // Set up listeners
      setupPushNotificationListeners();

      console.log('PushNotificationManager: Push notifications initialized successfully');
    } catch (error) {
      console.error('PushNotificationManager: Error initializing push notifications:', error);
    }
  };

  const setupPushNotificationListeners = () => {
    // Remove any existing listeners first
    PushNotifications.removeAllListeners();

    // Registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('PushNotificationManager: Registration success, token:', token.value);
      handleTokenReceived(token.value);
    });

    // Registration error
    PushNotifications.addListener('registrationError', (error) => {
      console.error('PushNotificationManager: Registration error:', error);
    });

    // Notification received while app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('PushNotificationManager: Foreground notification received:', notification);
      handleForegroundNotification(notification);
    });

    // Notification action performed (user tapped notification)
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('PushNotificationManager: Notification action performed:', notification);
      handleNotificationAction(notification);
    });
  };

  const handleTokenReceived = (token) => {
    console.log('PushNotificationManager: Token received:', token.substring(0, 20) + '...');
    setFcmToken(token);
    // Store token for web only
    if (!Capacitor.isNativePlatform()) {
      localStorage.setItem('fcm_token', token);
    }
    // If user is authenticated, send token immediately
    if (isAuthenticated) {
      sendTokenToBackend(token);
    } else {
      console.log('PushNotificationManager: User not authenticated, token stored for later');
    }
  };

  const handleAuthenticationChange = () => {
    // When user logs in, check if we have a stored token and send it
    let storedToken = null;
    if (!Capacitor.isNativePlatform()) {
      storedToken = localStorage.getItem('fcm_token');
    } else {
      // On native, use context (already set by handleTokenReceived)
      storedToken = null;
    }
    if (storedToken && isAuthenticated) {
      console.log('PushNotificationManager: User authenticated, sending stored token');
      sendTokenToBackend(storedToken);
    }
  };

  const sendTokenToBackend = async (token) => {
    if (!isAuthenticated) {
      console.log('PushNotificationManager: User not authenticated, not sending token');
      return;
    }

    try {
      console.log('PushNotificationManager: Sending token to backend...');
      
      const response = await axiosInstance.post('/api/notifications/fcm/subscribe', {
        token,
        platform: Capacitor.getPlatform(),
      });

      console.log('PushNotificationManager: Token sent successfully:', response.data);
      
      // Mark token as sent
      localStorage.setItem('fcm_token_sent', 'true');
      
    } catch (error) {
      console.error('PushNotificationManager: Error sending token to backend:', error);
      
      // Remove the sent flag so we can retry later
      localStorage.removeItem('fcm_token_sent');
    }
  };

  const handleForegroundNotification = (notification) => {
    console.log('PushNotificationManager: Handling foreground notification:', {
      title: notification.title,
      body: notification.body,
    });

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent('foregroundNotification', {
        detail: notification,
      })
    );
  };

  const handleNotificationAction = (notification) => {
    const data = notification.notification.data;
    
    console.log('PushNotificationManager: Handling notification action:', data);

    // Handle deep linking
    if (data?.route) {
      window.dispatchEvent(
        new CustomEvent('notificationNavigation', {
          detail: { route: data.route },
        })
      );
    }

    if (data?.url) {
      window.open(data.url, '_blank');
    }
  };

  // This component renders nothing, it's just for handling push notifications
  return null;
};

export default PushNotificationManager;
