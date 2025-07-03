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
  private pendingToken: string | null = null;
  private authStateChangeCallbacks: Array<(isAuthenticated: boolean) => void> = [];
  private isAuthenticated = false;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds

  constructor() {
    // Don't check auth state in constructor since hooks can't be used here
  }

  public static getInstance(): CapacitorPushService {
    if (!CapacitorPushService.instance) {
      CapacitorPushService.instance = new CapacitorPushService();
    }
    return CapacitorPushService.instance;
  }

  // Method to be called when authentication state changes
  public onAuthStateChange(isAuthenticated: boolean): void {
    console.log('CapacitorPushService: Auth state changed:', isAuthenticated);
    
    const wasAuthenticated = this.isAuthenticated;
    this.isAuthenticated = isAuthenticated;
    
    if (isAuthenticated && !wasAuthenticated && this.pendingToken) {
      console.log('CapacitorPushService: User authenticated, sending pending token to backend');
      this.sendTokenToBackendWithRetry(this.pendingToken);
    }
    
    // Notify all callbacks about auth state change
    this.authStateChangeCallbacks.forEach(callback => callback(isAuthenticated));
  }

  // Method to register for auth state change notifications
  public registerAuthStateCallback(callback: (isAuthenticated: boolean) => void): void {
    this.authStateChangeCallbacks.push(callback);
  }

  // Method to check current auth state (to be called from React components)
  public checkAuthAndSendToken(isAuthenticated: boolean): void {
    console.log('CapacitorPushService: checkAuthAndSendToken called', { isAuthenticated, hasPendingToken: !!this.pendingToken });
    
    this.isAuthenticated = isAuthenticated;
    
    if (isAuthenticated && this.pendingToken) {
      console.log('CapacitorPushService: Sending pending token to backend');
      this.sendTokenToBackendWithRetry(this.pendingToken);
    }
  }

  // Method to force send token regardless of auth state (for testing)
  public forceSendToken(): void {
    if (this.pendingToken) {
      console.log('CapacitorPushService: Force sending token to backend');
      this.sendTokenToBackendWithRetry(this.pendingToken);
    } else {
      console.log('CapacitorPushService: No token to send');
    }
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
      // Store token and try to send to backend
      this.handleTokenReceived(token.value);
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

  private handleTokenReceived(token: string): void {
    console.log('CapacitorPushService: Received push token:', token);
    
    // Always store the token
    this.pendingToken = token;
    this.retryCount = 0; // Reset retry count for new token
    
    // Try to send immediately if user is authenticated
    if (this.isAuthenticated) {
      console.log('CapacitorPushService: User is authenticated, sending token immediately');
      this.sendTokenToBackendWithRetry(token);
    } else {
      console.log('CapacitorPushService: User not authenticated, token stored as pending');
    }
  }

  private async sendTokenToBackendWithRetry(token: string): Promise<void> {
    try {
      await this.sendTokenToBackend(token);
      // Success - clear pending token and reset retry count
      this.pendingToken = null;
      this.retryCount = 0;
      console.log('CapacitorPushService: Token sent successfully');
    } catch (error) {
      console.error('CapacitorPushService: Failed to send token, attempt', this.retryCount + 1, error);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`CapacitorPushService: Retrying in ${this.retryDelay}ms...`);
        
        setTimeout(() => {
          this.sendTokenToBackendWithRetry(token);
        }, this.retryDelay);
      } else {
        console.error('CapacitorPushService: Max retries reached, keeping token as pending');
        this.pendingToken = token; // Keep as pending for next auth state change
        this.retryCount = 0; // Reset for next attempt
      }
    }
  }

  private async sendTokenToBackend(token: string): Promise<void> {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await axiosInstance.post(
        '/api/notifications/fcm/subscribe',
        {
          token,
          platform: Capacitor.getPlatform(),
        },
      );

      console.log('CapacitorPushService: Token sent to backend successfully', response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'CapacitorPushService: Error sending token to backend:',
          error.message
        );
        throw error;
      } else {
        console.error('CapacitorPushService: Error sending token to backend:', JSON.stringify(error));
        throw new Error('Failed to send token to backend');
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

  // Getter methods for debugging
  public getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      isAuthenticated: this.isAuthenticated,
      hasPendingToken: !!this.pendingToken,
      pendingToken: this.pendingToken ? this.pendingToken.substring(0, 20) + '...' : null,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
      isNativePlatform: Capacitor.isNativePlatform(),
    };
  }

  public getPendingToken(): string | null {
    return this.pendingToken;
  }

  public getAuthState(): boolean {
    return this.isAuthenticated;
  }
}

export default CapacitorPushService;
