import React, { createContext, useContext, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';

export type PlatformType = 'web' | 'android' | 'ios' | 'unknown';

interface EnvContextType {
  isWeb: boolean;
  isNative: boolean;
  platform: PlatformType;
  envMode: string;
  userAgent: string;
  isDev: boolean;
  isProd: boolean;
}

const EnvContext = createContext<EnvContextType | undefined>(undefined);

export const EnvProvider = ({ children }: { children: ReactNode }) => {
  let platform: PlatformType = 'unknown';
  let isWeb = false;
  let isNative = false;
  if (typeof window !== 'undefined' && 'Notification' in window) {
    platform = 'web';
    isWeb = true;
  } else if (Capacitor.isNativePlatform()) {
    const capPlatform = Capacitor.getPlatform();
    if (capPlatform === 'android') platform = 'android';
    else if (capPlatform === 'ios') platform = 'ios';
    isNative = true;
  }
  const envMode = (import.meta as any).env?.MODE || process.env.NODE_ENV || 'unknown';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isDev = envMode === 'development';
  const isProd = envMode === 'production';

  return (
    <EnvContext.Provider value={{ isWeb, isNative, platform, envMode, userAgent, isDev, isProd }}>
      {children}
    </EnvContext.Provider>
  );
};

export const useEnvContext = () => {
  const ctx = useContext(EnvContext);
  if (!ctx) throw new Error('useEnvContext must be used within EnvProvider');
  return ctx;
};
