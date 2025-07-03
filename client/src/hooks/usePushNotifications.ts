import { useState, useEffect } from 'react';
import { getNotificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const notificationService = getNotificationService();

  useEffect(() => {
    setIsSupported(notificationService.isSupported);
    checkSubscriptionStatus();
    
    // Listen for foreground messages
    notificationService.onMessage((payload) => {
      console.log('Foreground message received:', payload);
      
      // Show toast notification for foreground messages
      if (payload.notification) {
        toast.info(`${payload.notification.title}: ${payload.notification.body}`);
      }
    });
  }, []);

  // Watch for authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('usePushNotifications: User authenticated, checking subscription status');
      checkSubscriptionStatus();
    }
  }, [isAuthenticated]);

  const checkSubscriptionStatus = async () => {
    try {
      const token = await notificationService.getToken();
      setIsSubscribed(!!token);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    }
  };

  const subscribeToPush = async () => {
    if (!isSupported) {
      throw new Error('Push notifications not supported on this platform');
    }

    if (!isAuthenticated) {
      throw new Error('You must be logged in to enable push notifications');
    }

    setLoading(true);
    try {
      await notificationService.subscribeToNotifications();
      setIsSubscribed(true);
      toast.success('Push notifications enabled successfully!');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast.error('Failed to enable push notifications');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setLoading(true);
    try {
      await notificationService.unsubscribeFromNotifications();
      setIsSubscribed(false);
      toast.success('Push notifications disabled successfully!');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    loading,
    subscribeToPush,
    unsubscribeFromPush,
  };
};

export default usePushNotifications;
