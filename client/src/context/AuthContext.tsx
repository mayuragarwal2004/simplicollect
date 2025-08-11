import { axiosInstance } from '@/utils/config';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useNotificationContext } from './NotificationContext';

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    onSuccess?: Function,
  ) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// AuthProvider component to wrap the application
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { fcmToken } = useNotificationContext();

  // Calculate isAuthenticated based on accessToken
  // const isAuthenticated = !!accessToken;

  useEffect(() => {
    setIsAuthenticated(!!accessToken);
  }, [accessToken]);

  // Retrieve accessToken from storage on initial render
  useEffect(() => {
    getToken().then((storedToken) => {
      if (storedToken) setAccessToken(storedToken);
    });
  }, []);

  // Listen for token expiration events from axios interceptor
  useEffect(() => {
    const handleTokenExpired = (event: CustomEvent) => {
      console.log('[AuthContext] Token expired event received:', event.detail);
      
      // Clear local state
      setAccessToken(null);
      setIsAuthenticated(false);
      
      // Show user-friendly message
      toast.error('Your session has expired. Please sign in again.');
      
      // For native apps, we need to programmatically navigate
      if (Capacitor.isNativePlatform()) {
        // If you're using React Router, you can use navigate here
        // For now, we'll use a timeout to allow state to update
        setTimeout(() => {
          window.location.href = '/auth/signin';
        }, 1000);
      }
    };

    // Add event listener
    window.addEventListener('authTokenExpired', handleTokenExpired as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('authTokenExpired', handleTokenExpired as EventListener);
    };
  }, []);

  // Helper functions
  const setToken = async (token: string) => {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key: 'accessToken', value: token });
      console.log("Preferences used to set token:", token);
    } else {
      console.log("SessionStorage used to set token:", token);
      sessionStorage.setItem('accessToken', token);
      document.cookie = `token=${token}; Secure; SameSite=Strict; path=/;`;
    }
  };

  const setRefreshToken = async (refreshToken: string) => {
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key: 'refreshToken', value: refreshToken });
      console.log("Preferences used to set refresh token");
    } else {
      // Web refresh token is handled by httpOnly cookies from server
      console.log("Web refresh token handled by httpOnly cookies");
    }
  };

  const getRefreshToken = async (): Promise<string | null> => {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key: 'refreshToken' });
      return value || null;
    } else {
      // On web, refresh token is in httpOnly cookie, handled by server
      return null;
    }
  };

  const getToken = async (): Promise<string | null> => {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key: 'accessToken' });
      return value || null;
    } else {
      return sessionStorage.getItem('accessToken');
    }
  };

  const removeToken = async () => {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key: 'accessToken' });
      await Preferences.remove({ key: 'refreshToken' });
    } else {
      sessionStorage.removeItem('accessToken');
      document.cookie = 'token=; Max-Age=0; path=/;';
      // Clear refresh token cookie
      document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    }
  };

  const login = async (
    identifier: string,
    password: string,
    onSuccess?: Function,
  ) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        identifier,
        password,
      });

      const data = response.data;
      await setToken(data.accessToken);
      setAccessToken(data.accessToken);
      
      // Store refresh token if provided (for native apps)
      if (data.refreshToken && Capacitor.isNativePlatform()) {
        await setRefreshToken(data.refreshToken);
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unknown error';
      toast.error(message);
      console.error('Login failed:', message);
    }
  };

  const logout = async () => {
    console.log('[AuthContext] Logout initiated');
    
    // Unsubscribe FCM token before logging out
    try {
      if (fcmToken) {
        await axiosInstance.delete('/api/notifications/fcm/unsubscribe', {
          data: { token: fcmToken },
        });
        console.log('[AuthContext] FCM token unsubscribed');
      }
    } catch (e) {
      console.warn('Failed to unsubscribe FCM token on logout:', e);
    }
    
    // Clear tokens and state
    setAccessToken(null);
    setIsAuthenticated(false);
    await removeToken();
    
    console.log('[AuthContext] Logout completed, tokens cleared');
  };

  const refreshToken = async () => {
    try {
      let response;
      
      if (Capacitor.isNativePlatform()) {
        // Native app: send refresh token in request body
        const storedRefreshToken = await getRefreshToken();
        if (!storedRefreshToken) {
          console.error('[AuthContext] No refresh token available for native app');
          await logout(); // Force logout if no refresh token
          return;
        }
        
        response = await axiosInstance.post('/api/auth/refresh', {
          refreshToken: storedRefreshToken,
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Web: rely on httpOnly cookies
        response = await axiosInstance.post(
          '/api/auth/refresh',
          {},
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
      
      const data = response.data;
      await setToken(data.accessToken);
      setAccessToken(data.accessToken);
      
      // Update refresh token if provided (for native apps)
      if (data.refreshToken && Capacitor.isNativePlatform()) {
        await setRefreshToken(data.refreshToken);
      }
      
      console.log('[AuthContext] Token refreshed successfully');
      
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Token refresh failed';
      console.error('[AuthContext] Token refresh failed:', message);
      
      // If refresh fails with 401/403, the axios interceptor will handle logout
      // We don't need to call logout here as it would be redundant
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.log('[AuthContext] Refresh token expired, axios interceptor will handle cleanup');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        refreshToken();
      },
      14 * 60 * 1000,
    ); // Refresh every 14 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, isAuthenticated, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
