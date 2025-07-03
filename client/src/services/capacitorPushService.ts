import { useAuth } from '@/context/AuthContext';
import { axiosInstance } from '@/utils/config';
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  Token,
  ActionPerformed,
  PushNotificationSchema,
} from '@capacitor/push-notifications';

export class CapacitorPushService {
  private static instance: CapacitorPushService;
  private isInitialized = false;
  private isAuthenticated: boolean = false;

  constructor() {
    // Use the hook in a workaround way since hooks can't be used in classes directly
    try {
      // This will only work if called inside a React component context
      // If you use this service outside React, you need to pass isAuthenticated as a parameter
      const auth = useAuth();
      this.isAuthenticated = auth.isAuthenticated;
    } catch {
      // Not in a React context, fallback to false
      this.isAuthenticated = false;
    }
  }

  public static getInstance(): CapacitorPushService {
    if (!CapacitorPushService.instance) {
      CapacitorPushService.instance = new CapacitorPushService();
    }
    return CapacitorPushService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || !Capacitor.isNativePlatform()) {
      return;
    }

    try {
      // Request permissions
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') {
        throw new Error('Push notification permission not granted');
      }

      // Register for push notifications
      await PushNotifications.register();

      // Set up listeners
      this.setupListeners();

      this.isInitialized = true;
      console.log('Capacitor push service initialized successfully');
    } catch (error) {
      console.error('Error initializing Capacitor push service:', error);
      throw error;
    }
  }

  private setupListeners(): void {
    // Registration success
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      // Send token to your backend
      this.sendTokenToBackend(token.value);
    });

    // Registration error
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Push registration error: ', error);
    });

    // Notification received while app is in foreground
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received (foreground): ', notification);

        // You can show a custom UI here or trigger a toast
        this.handleForegroundNotification(notification);
      },
    );

    // Notification action performed (user tapped notification)
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push notification action performed: ', notification);

        // Handle deep linking or navigation here
        this.handleNotificationAction(notification);
      },
    );
  }

  private async sendTokenToBackend(token: string): Promise<void> {
    // Only send if user is authenticated
    if (!this.isAuthenticated) {
      console.log('User not authenticated, not sending push token to backend');
      return;
    }
    try {
      const response = await axiosInstance.post(
        '/api/notifications/fcm/subscribe',
        {
          token,
          platform: Capacitor.getPlatform(),
        },
      );

      console.log('Token sent to backend successfully');
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Error sending token to backend:',
          error.message,
          error.stack,
        );
      } else {
        console.error('Error sending token to backend:', JSON.stringify(error));
      }
    }
  }

  private handleForegroundNotification(
    notification: PushNotificationSchema,
  ): void {
    // Show a toast or custom notification UI
    // You can integrate with your existing toast system
    console.log(
      'Handling foreground notification:',
      notification.title,
      notification.body,
    );

    // Example: Show native alert (you might want to use your toast system instead)
    if (notification.title && notification.body) {
      // You can dispatch a custom event here that your React components can listen to
      window.dispatchEvent(
        new CustomEvent('foregroundNotification', {
          detail: notification,
        }),
      );
    }
  }

  private handleNotificationAction(notification: ActionPerformed): void {
    const data = notification.notification.data;

    // Handle deep linking based on notification data
    if (data?.route) {
      // Navigate to specific route
      window.dispatchEvent(
        new CustomEvent('notificationNavigation', {
          detail: { route: data.route },
        }),
      );
    }

    if (data?.url) {
      // Open URL
      window.open(data.url, '_blank');
    }

    // You can add more custom actions here
    console.log('Notification action handled:', data);
  }

  async getDeliveredNotifications(): Promise<any[]> {
    if (!Capacitor.isNativePlatform()) {
      return [];
    }

    try {
      const result = await PushNotifications.getDeliveredNotifications();
      return result.notifications;
    } catch (error) {
      console.error('Error getting delivered notifications:', error);
      return [];
    }
  }

  async removeDeliveredNotifications(ids: string[]): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
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
      console.log('Delivered notifications removed:', ids);
    } catch (error) {
      console.error('Error removing delivered notifications:', error);
    }
  }

  async removeAllDeliveredNotifications(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await PushNotifications.removeAllDeliveredNotifications();
      console.log('All delivered notifications removed');
    } catch (error) {
      console.error('Error removing all delivered notifications:', error);
    }
  }

  destroy(): void {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.removeAllListeners();
    }
    this.isInitialized = false;
  }
}

export default CapacitorPushService;
