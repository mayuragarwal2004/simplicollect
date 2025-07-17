import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { openAppOrStore } from '../utils/appDetection';
import { APP_CONFIG } from '../config/appConfig';

interface AppStoreLinks {
  ios: string;
  android: string;
}

interface AppInstallBannerConfig {
  appName: string;
  appStoreLinks: AppStoreLinks;
  showDelay?: number; // Delay in ms before showing banner
  hideAfterDays?: number; // Hide banner if dismissed for X days
}

interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isInApp: boolean; // Whether user is already in the native app
  isSimulated?: boolean; // For development testing
}

export const useAppInstallBanner = (config: AppInstallBannerConfig) => {
  const [showBanner, setShowBanner] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isInApp: false,
    isSimulated: false,
  });

  const STORAGE_KEY = 'app-install-banner-dismissed';
  const isDevelopment = (import.meta as any).env.DEV;
  const devConfig = APP_CONFIG.installBanner.development;

  useEffect(() => {
    detectDevice();
  }, []);

  useEffect(() => {
    if ((deviceInfo.isMobile && !deviceInfo.isInApp) || (isDevelopment && devConfig.forceShow)) {
      checkIfShouldShowBanner();
    }
  }, [deviceInfo]);

  const detectDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isInApp = Capacitor.isNativePlatform();
    
    // Development simulation override
    if (isDevelopment && devConfig.simulateDevice) {
      const simulated = {
        isIOS: devConfig.simulateDevice === 'ios',
        isAndroid: devConfig.simulateDevice === 'android',
        isMobile: true,
        isInApp: false,
        isSimulated: true,
      };
      
      if (devConfig.enableDebugLogs) {
        console.log('🧪 [DEV] Simulating device:', devConfig.simulateDevice, simulated);
      }
      
      setDeviceInfo(simulated);
      return;
    }
    
    // Detect iOS (including iPad on iOS 13+ that reports as desktop)
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Detect Android
    const isAndroid = /android/i.test(userAgent);
    
    // More comprehensive mobile detection
    const isMobile = isIOS || isAndroid || 
                     /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
                     (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
    
    // Additional check for PWA or standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
    
    const detectedInfo = {
      isIOS,
      isAndroid,
      isMobile,
      isInApp: isInApp || isStandalone,
      isSimulated: false,
    };
    
    if (isDevelopment && devConfig.enableDebugLogs) {
      console.log('📱 [DEV] Device detection:', detectedInfo);
      console.log('🔍 [DEV] User agent:', userAgent);
      console.log('⚡ [DEV] Capacitor native platform:', isInApp);
    }
    
    setDeviceInfo(detectedInfo);
  };

  const checkIfShouldShowBanner = () => {
    // Development force show override
    if (isDevelopment && devConfig.forceShow) {
      if (devConfig.enableDebugLogs) {
        console.log('🧪 [DEV] Force showing banner due to development config');
      }
      
      const delay = isDevelopment ? devConfig.showDelay : config.showDelay || 3000;
      setTimeout(() => setShowBanner(true), delay);
      return;
    }
    
    // Don't show if already in native app
    if (deviceInfo.isInApp && !deviceInfo.isSimulated) {
      if (isDevelopment && devConfig.enableDebugLogs) {
        console.log('🚫 [DEV] Not showing banner - user is in native app');
      }
      return;
    }

    // Don't show if not on mobile (unless simulated in dev)
    if (!deviceInfo.isMobile && !(isDevelopment && deviceInfo.isSimulated)) {
      if (isDevelopment && devConfig.enableDebugLogs) {
        console.log('🚫 [DEV] Not showing banner - not on mobile device');
      }
      return;
    }

    // Check if banner was dismissed recently
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const daysSinceDismissed = Math.floor(
        (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceDismissed < (config.hideAfterDays || 7)) {
        if (isDevelopment && devConfig.enableDebugLogs) {
          console.log(`🚫 [DEV] Not showing banner - dismissed ${daysSinceDismissed} days ago`);
        }
        return;
      }
    }

    // Show banner after delay
    const delay = isDevelopment ? devConfig.showDelay : config.showDelay || 3000;
    
    if (isDevelopment && devConfig.enableDebugLogs) {
      console.log(`✅ [DEV] Showing banner after ${delay}ms delay`);
    }
    
    const showTimeout = setTimeout(() => {
      setShowBanner(true);
    }, delay);

    return () => clearTimeout(showTimeout);
  };

  const getDownloadLink = (): string => {
    if (deviceInfo.isIOS) {
      return config.appStoreLinks.ios;
    } else if (deviceInfo.isAndroid) {
      return config.appStoreLinks.android;
    }
    return config.appStoreLinks.android; // Default to Android
  };

  const handleDownload = () => {
    if (isDevelopment && devConfig.enableDebugLogs) {
      console.log('📱 [DEV] Download button clicked');
      console.log('📱 [DEV] Device info used for store selection:', deviceInfo);
    }
    
    // In test mode, just show what would happen
    if (isDevelopment && devConfig.testMode) {
      const storeUrl = deviceInfo.isIOS ? config.appStoreLinks.ios : config.appStoreLinks.android;
      alert(`🧪 TEST MODE: Would open ${deviceInfo.isIOS ? 'App Store' : 'Google Play'}\nURL: ${storeUrl}`);
      dismissBanner();
      return;
    }
    
    // Try to open the app first, then fallback to store
    const currentPath = window.location.pathname + window.location.search;
    const deepLinkUrl = `simplicollect://open${currentPath}`;
    
    if (isDevelopment && devConfig.enableDebugLogs) {
      console.log('🔗 [DEV] Deep link URL:', deepLinkUrl);
      console.log('📱 [DEV] Store URLs:', config.appStoreLinks);
    }
    
    // In development with simulated device, handle store opening directly
    if (isDevelopment && deviceInfo.isSimulated) {
      if (isDevelopment && devConfig.enableDebugLogs) {
        console.log('🎭 [DEV] Using simulated device info for store selection');
        console.log('🎭 [DEV] Simulated device is iOS:', deviceInfo.isIOS);
        console.log('🎭 [DEV] Simulated device is Android:', deviceInfo.isAndroid);
      }
      
      // For simulated devices, open the appropriate store directly
      const storeUrl = deviceInfo.isIOS ? config.appStoreLinks.ios : config.appStoreLinks.android;
      
      if (isDevelopment && devConfig.enableDebugLogs) {
        console.log('🎭 [DEV] Opening store URL:', storeUrl);
      }
      
      window.open(storeUrl, '_blank');
    } else {
      // For real devices, use the existing detection logic
      openAppOrStore(
        deepLinkUrl,
        config.appStoreLinks.ios,
        config.appStoreLinks.android
      );
    }
    
    // Track that user attempted to download
    dismissBanner();
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  };

  const resetBanner = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowBanner(false);
    if (isDevelopment && devConfig.enableDebugLogs) {
      console.log('🔄 [DEV] Banner reset - localStorage cleared');
    }
  };

  // Development helper functions
  const devHelpers = isDevelopment ? {
    forceShow: () => {
      if (devConfig.enableDebugLogs) {
        console.log('🧪 [DEV] Force showing banner');
      }
      setShowBanner(true);
    },
    simulateDevice: (type: 'ios' | 'android' | 'desktop') => {
      if (devConfig.enableDebugLogs) {
        console.log(`🧪 [DEV] Simulating ${type} device`);
      }
      
      if (type === 'desktop') {
        setDeviceInfo({
          isIOS: false,
          isAndroid: false,
          isMobile: false,
          isInApp: false,
          isSimulated: true,
        });
      } else {
        setDeviceInfo({
          isIOS: type === 'ios',
          isAndroid: type === 'android',
          isMobile: true,
          isInApp: false,
          isSimulated: true,
        });
      }
    },
    getDebugInfo: () => ({
      deviceInfo,
      showBanner,
      isDevelopment,
      devConfig,
      dismissedAt: localStorage.getItem(STORAGE_KEY),
    }),
  } : {};

  // Expose debug info to window in development
  if (isDevelopment && typeof window !== 'undefined') {
    (window as any).__APP_INSTALL_BANNER_DEBUG__ = {
      deviceInfo,
      showBanner,
      isDevelopment,
      devConfig,
      dismissedAt: localStorage.getItem(STORAGE_KEY),
    };
  }

  return {
    showBanner,
    deviceInfo,
    handleDownload,
    dismissBanner,
    resetBanner,
    getDownloadLink,
    ...(isDevelopment ? { devHelpers } : {}),
  };
};

export default useAppInstallBanner;
