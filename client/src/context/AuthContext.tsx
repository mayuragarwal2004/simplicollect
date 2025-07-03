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

  // Retrieve accessToken from sessionStorage on initial render
  useEffect(() => {
    getToken().then((storedToken) => {
      if (storedToken) setAccessToken(storedToken);
    });
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
    } else {
      sessionStorage.removeItem('accessToken');
      document.cookie = 'token=; Max-Age=0; path=/;';
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
      // ...existing code...
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unknown error';
      toast.error(message);
      console.error('Login failed:', message);
    }
  };

  const logout = async () => {
    // Unsubscribe FCM token before logging out
    try {
      if (fcmToken) {
        await axiosInstance.delete('/api/notifications/fcm/unsubscribe', {
          data: { token: fcmToken },
        });
      }
    } catch (e) {
      console.warn('Failed to unsubscribe FCM token on logout:', e);
    }
    setAccessToken(null);
    await removeToken();
  };

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post(
        '/api/auth/refresh',
        {},
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      const data = response.data;

      await setToken(data.accessToken);
      setAccessToken(data.accessToken);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unknown error';
      console.error('Token refresh failed:', message);
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
