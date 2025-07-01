import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { initializeMessaging, getToken, onMessage } from '../utils/firebase';
import { axiosInstance } from '../utils/config';

export interface NotificationService {
  isSupported: boolean;
  requestPermission(): Promise<boolean>;
  getToken(): Promise<string | null>;
  subscribeToNotifications(): Promise<void>;
  unsubscribeFromNotifications(): Promise<void>;
  onMessage(callback: (payload: any) => void): void;
}

class WebFCMService implements NotificationService {
  private messaging: any = null;
  public isSupported = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Add a small delay to ensure Firebase is properly initialized
      await new Promise(resolve => setTimeout(resolve, 100));
      this.messaging = await initializeMessaging();
      this.isSupported = !!this.messaging;
      console.log('FCM initialized successfully:', this.isSupported);
    } catch (error) {
      console.error('Error initializing web FCM:', error);
      this.isSupported = false;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) return false;
    
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.isSupported || !this.messaging) return null;
    
    try {
      // Register service worker with retry logic
      let registration;
      try {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service worker registered successfully');
      } catch (swError) {
        console.error('Service worker registration failed:', swError);
        // Try with different path
        registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
      }
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      
      const token = await getToken(this.messaging, {
        vapidKey: (import.meta as any).env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration
      });
      
      console.log('FCM token generated:', token ? 'Success' : 'Failed');
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  async subscribeToNotifications(): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      throw new Error('Permission not granted');
    }

    const token = await this.getToken();
    if (!token) {
      throw new Error('Failed to get FCM token');
    }

    // Send token to backend
    await axiosInstance.post('/api/notifications/fcm/subscribe', {
      token,
      platform: 'web'
    });
  }

  async unsubscribeFromNotifications(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      await axiosInstance.delete('/api/notifications/fcm/unsubscribe', {
        data: { token }
      });
    }
  }

  onMessage(callback: (payload: any) => void): void {
    if (!this.isSupported || !this.messaging) return;
    
    onMessage(this.messaging, (payload) => {
      console.log('Message received (foreground):', payload);
      callback(payload);
    });
  }
}

class CapacitorNotificationService implements NotificationService {
  public isSupported = true;

  async requestPermission(): Promise<boolean> {
    try {
      const result = await PushNotifications.requestPermissions();
      return result.receive === 'granted';
    } catch (error) {
      console.error('Error requesting Capacitor permissions:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      // For Capacitor, we need to wait for the registration event
      return new Promise((resolve, reject) => {
        // Set up listeners first
        PushNotifications.addListener('registration', (token: Token) => {
          console.log('Capacitor push registration success, token: ' + token.value);
          resolve(token.value);
        });

        PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Capacitor registration error: ' + JSON.stringify(error));
          reject(error);
        });

        // Then register
        PushNotifications.register().catch(reject);
        
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Token registration timeout')), 10000);
      });
    } catch (error) {
      console.error('Error getting Capacitor token:', error);
      return null;
    }
  }

  async subscribeToNotifications(): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      throw new Error('Permission not granted');
    }

    // Register for push notifications
    await PushNotifications.register();

    // Listen for registration
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      
      // Send token to backend
      await axiosInstance.post('/api/notifications/fcm/subscribe', {
        token: token.value,
        platform: Capacitor.getPlatform()
      });
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Listen for push notifications
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received: ', notification);
    });

    // Listen for notification actions
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push notification action performed', notification);
    });
  }

  async unsubscribeFromNotifications(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      await axiosInstance.delete('/api/notifications/fcm/unsubscribe', {
        data: { token }
      });
    }
    
    // Remove all listeners
    PushNotifications.removeAllListeners();
  }

  onMessage(callback: (payload: any) => void): void {
    PushNotifications.addListener('pushNotificationReceived', callback);
  }
}

// Factory function to get the appropriate service
export const getNotificationService = (): NotificationService => {
  if (Capacitor.isNativePlatform()) {
    return new CapacitorNotificationService();
  } else {
    return new WebFCMService();
  }
};

export default getNotificationService;
