/**
 * App configuration for SimpliCollect
 */

export const APP_CONFIG = {
  appName: 'SimpliCollect',
  packageId: 'com.simplium.simplicollect',
  deepLinkScheme: 'simplicollect',
  
  // App Store Links
  storeLinks: {
    // iOS App Store - Replace with your actual App Store ID
    ios: 'https://apps.apple.com/app/simplicollect/id6738824043',
    
    // Google Play Store - Using the package ID from capacitor.config.json
    android: 'https://play.google.com/store/apps/details?id=com.simplium.simplicollect',
  },
  
  // App install banner configuration
  installBanner: {
    showDelay: 5000, // Show after 5 seconds
    hideAfterDays: 7, // Hide for 7 days if dismissed
    
    // Conditions for showing the banner
    minSessionTime: 30000, // Show only after user has been on site for 30 seconds
    excludePaths: ['/auth/', '/privacy-policy', '/terms-and-conditions'], // Don't show on these paths
    
    // Development/Testing settings
    development: {
      forceShow: false, // Set to true to always show banner in dev
      showDelay: 2000, // Faster delay for development testing
      simulateDevice: null, // Set to 'ios' or 'android' to simulate device
      enableDebugLogs: true, // Show console logs for debugging
      testMode: false, // Enable test mode with mock behaviors
    },
  },
  
  // Feature flags
  features: {
    enableAppInstallBanner: true,
    enableDeepLinking: true,
    enablePushNotifications: true,
  },
};

export default APP_CONFIG;
