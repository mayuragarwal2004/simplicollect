/**
 * Utility functions for app detection and deep linking
 */

interface AppDetectionResult {
  isAppInstalled: boolean;
  canOpenApp: boolean;
  deepLinkUrl?: string;
}

/**
 * Attempts to detect if the native app is installed and can handle deep links
 */
export const detectAppInstallation = async (
  deepLinkScheme: string = 'simplicollect',
  fallbackUrl?: string
): Promise<AppDetectionResult> => {
  // For web browsers, we can't reliably detect if an app is installed
  // But we can try to open a deep link and provide fallback behavior
  
  const result: AppDetectionResult = {
    isAppInstalled: false,
    canOpenApp: false,
  };

  // Create a deep link URL for the current page
  const currentPath = window.location.pathname + window.location.search;
  const deepLinkUrl = `${deepLinkScheme}://open${currentPath}`;
  result.deepLinkUrl = deepLinkUrl;

  return result;
};

/**
 * Attempts to open the app with a deep link, falls back to app store if app is not installed
 */
export const openAppOrStore = (
  deepLinkUrl: string,
  appStoreUrl: string,
  playStoreUrl: string
) => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(userAgent);

  if (isIOS || isAndroid) {
    // Try to open the app with deep link
    const startTime = Date.now();
    
    // Create a hidden iframe to attempt the deep link
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deepLinkUrl;
    document.body.appendChild(iframe);

    // Set a timer to check if the app opened
    const timer = setTimeout(() => {
      const endTime = Date.now();
      
      // If we're still here after a short time, the app probably isn't installed
      if (endTime - startTime < 2000) {
        // App didn't open, redirect to app store
        const storeUrl = isIOS ? appStoreUrl : playStoreUrl;
        window.open(storeUrl, '_blank');
      }
      
      // Clean up
      document.body.removeChild(iframe);
    }, 1500);

    // Clean up if page becomes hidden (app opened successfully)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timer);
        document.body.removeChild(iframe);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also try direct window location as backup
    setTimeout(() => {
      try {
        window.location.href = deepLinkUrl;
      } catch (e) {
        // Ignore errors
      }
    }, 100);
  } else {
    // Desktop - just redirect to the appropriate store
    window.open(appStoreUrl, '_blank');
  }
};

/**
 * Checks if the current environment supports app installation
 */
export const canInstallApp = (): boolean => {
  // Check if it's a mobile device
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
                   (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);

  // Check if it's not already a PWA or native app
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone;

  return isMobile && !isStandalone;
};

export default {
  detectAppInstallation,
  openAppOrStore,
  canInstallApp,
};
