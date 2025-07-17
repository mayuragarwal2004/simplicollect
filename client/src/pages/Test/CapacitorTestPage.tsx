import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useCapacitorNotifications } from '../../hooks/useCapacitorNotifications';
import useCapacitorPushNotifications from '../../hooks/useCapacitorPushNotifications';
import usePushNotifications from '../../hooks/usePushNotifications';
import { axiosInstance, getPlatformInfo } from '../../utils/config';
import AppBannerDevTester from '../../components/Development/AppBannerDevTester';

const CapacitorTestPage: React.FC = () => {
  const [platform, setPlatform] = useState<string>('');
  const [isNative, setIsNative] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  const [configInfo, setConfigInfo] = useState<any>({});
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isBackendRunning, setIsBackendRunning] = useState<boolean | null>(null);
  
  const capacitorNotifications = useCapacitorNotifications();
  const newCapacitorNotifications = useCapacitorPushNotifications();
  const webNotifications = usePushNotifications();

  // Add a log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // Helper function to check if browser notifications are available
  const isBrowserNotificationAvailable = () => {
    return !isNative && typeof window !== 'undefined' && 'Notification' in window;
  };

  // Get browser notification permission safely
  const getBrowserNotificationPermission = () => {
    if (isBrowserNotificationAvailable()) {
      return Notification.permission;
    }
    return isNative ? 'n/a-native' : 'unavailable';
  };

  // Check if backend is running
  const checkBackendStatus = async () => {
    try {
      const response = await axiosInstance.get('/api/notifications/health');
      setIsBackendRunning(response.status === 200);
      addLog(`Backend health check: ${response.status === 200 ? 'OK' : 'Failed'}`);
    } catch (error) {
      setIsBackendRunning(false);
      addLog(`Backend health check failed: ${error}`);
    }
  };

  useEffect(() => {
    // Get platform information
    const currentPlatform = Capacitor.getPlatform();
    const isNativePlatform = Capacitor.isNativePlatform();
    const platformInfo = getPlatformInfo();
    
    setPlatform(currentPlatform);
    setIsNative(isNativePlatform);
    setConfigInfo(platformInfo);

    // Get additional device info
    setDeviceInfo({
      platform: currentPlatform,
      isNative: isNativePlatform,
      isPluginAvailable: Capacitor.isPluginAvailable('PushNotifications'),
      hasBrowserNotifications: !isNativePlatform && typeof window !== 'undefined' && 'Notification' in window,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    });

    // Check backend status
    checkBackendStatus();

    // Add initial log
    addLog(`Initialized - Platform: ${currentPlatform}, Native: ${isNativePlatform}`);
    addLog(`Browser Notifications: ${!isNativePlatform && typeof window !== 'undefined' && 'Notification' in window ? 'Available' : 'Not Available'}`);
    addLog(`Push Plugin: ${Capacitor.isPluginAvailable('PushNotifications') ? 'Available' : 'Not Available'}`);
  }, []);

  const testWebNotifications = async () => {
    addLog('Starting web notification test...');
    
    try {
      // Step 0: Check if we're running on a web platform
      if (isNative) {
        addLog('❌ Web notifications test not applicable on native platform');
        addLog('ℹ️ Use "Test New Push Service" for native notifications');
        return;
      }

      // Step 1: Check if notifications are supported
      if (!webNotifications.isSupported) {
        addLog('❌ Web notifications not supported');
        return;
      }
      addLog('✓ Web notifications supported');

      // Step 2: Check current permission status
      const currentPermission = getBrowserNotificationPermission();
      addLog(`Current permission: ${currentPermission}`);

      // Step 3: Check if service worker can be registered
      if (!('serviceWorker' in navigator)) {
        addLog('❌ Service Worker not supported');
        return;
      }
      addLog('✓ Service Worker supported');

      // Step 4: Check backend status
      if (isBackendRunning === false) {
        addLog('❌ Backend not running - start your backend server');
        return;
      }

      // Step 5: Attempt to subscribe
      addLog('Attempting to subscribe to notifications...');
      await webNotifications.subscribeToPush();
      addLog('✓ Successfully subscribed to notifications!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`❌ Test failed: ${errorMessage}`);
      console.error('Web notification test failed:', error);
    }
  };

  const testBackendConnection = async () => {
    addLog('Testing backend connection...');
    await checkBackendStatus();
  };

  const testServiceWorker = async () => {
    addLog('Testing service worker registration...');
    
    try {
      if (!('serviceWorker' in navigator)) {
        addLog('❌ Service Worker not supported');
        return;
      }

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      addLog('✓ Service worker registered successfully');
      
      const ready = await navigator.serviceWorker.ready;
      addLog(`✓ Service worker ready: ${ready.active?.scriptURL}`);
      
    } catch (error) {
      addLog(`❌ Service worker registration failed: ${error}`);
    }
  };

  const clearLogs = () => {
    setTestLogs([]);
  };

  const testSimplifiedCapacitorNotifications = async () => {
    addLog('Starting simplified Capacitor notification test...');
    
    try {
      const debugInfo = newCapacitorNotifications.getDebugInfo();
      addLog(`Debug Info: ${JSON.stringify(debugInfo, null, 2)}`);
      
      if (!debugInfo.isSupported) {
        addLog('❌ Capacitor push notifications not supported');
        return;
      }
      addLog('✓ Capacitor push notifications supported');

      if (!debugInfo.isAuthenticated) {
        addLog('⚠️ User not authenticated - please log in first');
        return;
      }
      addLog('✓ User is authenticated');

      if (debugInfo.hasStoredToken) {
        addLog(`✓ FCM token found: ${debugInfo.storedToken}`);
        
        if (debugInfo.tokenSent) {
          addLog('✓ Token already sent to backend');
        } else {
          addLog('⚠️ Token not yet sent to backend');
          
          addLog('Attempting to force send token...');
          await newCapacitorNotifications.forceSendToken();
        }
      } else {
        addLog('⚠️ No FCM token found - try restarting the app');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`❌ Test failed: ${errorMessage}`);
      console.error('Simplified Capacitor notification test failed:', error);
    }
  };

  const testCapacitorNotifications = async () => {
    try {
      if (capacitorNotifications.isSupported) {
        console.log('Capacitor notifications are supported');
        // The hook handles initialization automatically
      } else {
        console.log('Capacitor notifications not supported on this platform');
      }
    } catch (error) {
      console.error('Capacitor notification test failed:', error);
    }
  };

  const getNotificationStatus = () => {
    if (isNative) {
      return {
        service: 'Capacitor Native',
        supported: capacitorNotifications.isSupported,
        initialized: capacitorNotifications.isInitialized,
        error: capacitorNotifications.error,
      };
    } else {
      return {
        service: 'Web FCM',
        supported: webNotifications.isSupported,
        subscribed: webNotifications.isSubscribed,
        loading: webNotifications.loading,
      };
    }
  };

  const status = getNotificationStatus();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Capacitor Integration Test
      </h1>

      {/* App Install Banner Tester */}
      <AppBannerDevTester />

      {/* Platform Information */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          Platform Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Platform:</strong> {platform}
          </div>
          <div>
            <strong>Is Native:</strong> {isNative ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Push Plugin Available:</strong>{' '}
            {deviceInfo.isPluginAvailable ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Browser Notifications:</strong>{' '}
            <span className={`px-1 py-0.5 rounded text-xs ${
              deviceInfo.hasBrowserNotifications ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
            }`}>
              {deviceInfo.hasBrowserNotifications ? 'Available' : 'Not Available'}
            </span>
          </div>
          <div>
            <strong>Browser Notifications:</strong>{' '}
            {deviceInfo.hasBrowserNotifications ? 'Available' : 'Not Available'}
          </div>
          <div>
            <strong>Environment:</strong> {(import.meta as any).env.MODE}
          </div>
          <div>
            <strong>Backend Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              isBackendRunning === true 
                ? 'bg-green-200 text-green-800' 
                : isBackendRunning === false
                ? 'bg-red-200 text-red-800'
                : 'bg-yellow-200 text-yellow-800'
            }`}>
              {isBackendRunning === true ? 'Running ✓' : isBackendRunning === false ? 'Not Running ✗' : 'Checking...'}
            </span>
          </div>
          <div>
            <strong>Browser Permission:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              getBrowserNotificationPermission() === 'granted'
                ? 'bg-green-200 text-green-800' 
                : getBrowserNotificationPermission() === 'denied'
                ? 'bg-red-200 text-red-800'
                : 'bg-yellow-200 text-yellow-800'
            }`}>
              {(() => {
                const permission = getBrowserNotificationPermission();
                if (permission === 'n/a-native') return 'N/A (Native App)';
                if (permission === 'unavailable') return 'Unavailable';
                return permission;
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Status */}
      <div className="mb-8 p-4 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-3">
          Notification Service Status
        </h2>
        <div className="space-y-2">
          <div>
            <strong>Service Type:</strong> {status.service}
          </div>
          <div>
            <strong>Supported:</strong>{' '}
            <span
              className={`px-2 py-1 rounded text-sm ${
                status.supported
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {status.supported ? 'Yes' : 'No'}
            </span>
          </div>
          {isNative && (
            <>
              <div>
                <strong>Initialized:</strong>{' '}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    status.initialized
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {status.initialized ? 'Yes' : 'No'}
                </span>
              </div>
              {status.error && (
                <div className="text-red-600">
                  <strong>Error:</strong> {status.error}
                </div>
              )}
            </>
          )}
          {!isNative && (
            <>
              <div>
                <strong>Subscribed:</strong>{' '}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    status.subscribed
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {status.subscribed ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <strong>Loading:</strong> {status.loading ? 'Yes' : 'No'}
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Simplified Service Debug Info */}
      {isNative && (
        <div className="mb-8 p-4 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800 mb-3">
            Simplified Push Service Debug Info
          </h2>
          <div className="space-y-2">
            {(() => {
              const debugInfo = newCapacitorNotifications.getDebugInfo();
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Supported:</strong>{' '}
                    <span className={`px-2 py-1 rounded text-sm ${
                      debugInfo.isSupported ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {debugInfo.isSupported ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <strong>Authenticated:</strong>{' '}
                    <span className={`px-2 py-1 rounded text-sm ${
                      debugInfo.isAuthenticated ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {debugInfo.isAuthenticated ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <strong>Has Token:</strong>{' '}
                    <span className={`px-2 py-1 rounded text-sm ${
                      debugInfo.hasStoredToken ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {debugInfo.hasStoredToken ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <strong>Token Sent:</strong>{' '}
                    <span className={`px-2 py-1 rounded text-sm ${
                      debugInfo.tokenSent ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {debugInfo.tokenSent ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <strong>Platform:</strong> {debugInfo.platform}
                  </div>
                  {debugInfo.storedToken && (
                    <div>
                      <strong>Token:</strong> {debugInfo.storedToken}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Test Buttons */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Test Functions
        </h2>
        
        {/* Platform-specific guidance */}
        <div className="mb-4 p-3 bg-blue-100 rounded-lg text-sm">
          <strong>Platform Guidance:</strong>
          <ul className="list-disc list-inside ml-4 mt-1">
            {isNative ? (
              <>
                <li><strong>"Test New Push Service"</strong> - Use this for native push notifications (recommended)</li>
                <li><strong>"Test Old Capacitor Service"</strong> - Legacy implementation for comparison</li>
                <li><strong>Note:</strong> Web notification tests don't work on native platforms</li>
              </>
            ) : (
              <>
                <li><strong>"Test Web Notifications"</strong> - Use this for browser push notifications</li>
                <li><strong>"Test Service Worker"</strong> - Verify service worker registration</li>
                <li><strong>Note:</strong> Native notification tests don't work in browsers</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          {isNative ? (
            <>
              <button
                onClick={testSimplifiedCapacitorNotifications}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                disabled={!newCapacitorNotifications.isSupported}
              >
                Test New Push Service
              </button>
              <button
                onClick={testCapacitorNotifications}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={!capacitorNotifications.isSupported}
              >
                Test Old Capacitor Service
              </button>
              <button
                onClick={testBackendConnection}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Test Backend
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear Logs
              </button>
            </>
          ) : (
            <>
              <button
                onClick={testWebNotifications}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                disabled={!webNotifications.isSupported || webNotifications.loading}
              >
                {webNotifications.loading ? 'Testing...' : 'Test Web Notifications'}
              </button>
              <button
                onClick={testBackendConnection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Test Backend
              </button>
              <button
                onClick={testServiceWorker}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Test Service Worker
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear Logs
              </button>
            </>
          )}
        </div>

        {/* Platform-specific guidance */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
          {isNative ? (
            <div>
              <strong>📱 Native App Testing:</strong>
              <ul className="mt-1 ml-4 list-disc">
                <li>Use "Test New Push Service" for authentication-aware notifications</li>
                <li>Make sure you're logged in to test token registration</li>
                <li>Check that Firebase config files are in place for production builds</li>
              </ul>
            </div>
          ) : (
            <div>
              <strong>🌐 Web Testing:</strong>
              <ul className="mt-1 ml-4 list-disc">
                <li>Use "Test Web Notifications" for browser-based FCM notifications</li>
                <li>Allow notifications when prompted by the browser</li>
                <li>Check that service worker is properly registered</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Test Logs */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Test Logs
        </h2>
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-64 overflow-y-auto">
          {testLogs.length === 0 ? (
            <div className="text-gray-500">No logs yet. Click a test button to start debugging.</div>
          ) : (
            testLogs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* API Configuration */}
      <div className="mb-8 p-4 bg-orange-50 rounded-lg">
        <h2 className="text-xl font-semibold text-orange-800 mb-3">
          API Configuration (Backend Calls)
        </h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Base URL:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              configInfo.baseURL 
                ? 'bg-green-200 text-green-800' 
                : 'bg-blue-200 text-blue-800'
            }`}>
              {configInfo.baseURL || '(empty - using relative URLs)'}
            </span>
          </div>
          <div>
            <strong>Platform:</strong> {isNative ? 'Native (Capacitor)' : 'Web Browser'}
          </div>
          <div>
            <strong>Is Development:</strong> {configInfo.isDevelopment ? 'Yes' : 'No'}
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {isNative 
              ? '✓ Native apps use absolute URLs to reach your backend server'
              : '✓ Web browser uses relative URLs (e.g., /api/notifications)'}
          </div>
          {!isNative && (
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
              <strong>In Capacitor (native app), this would be:</strong><br/>
              <code className="text-blue-800">{(import.meta as any).env.VITE_API_URL || 'http://localhost:5000'}</code>
            </div>
          )}
        </div>
      </div>

      {/* Firebase Configuration */}
      <div className="mb-8 p-4 bg-purple-50 rounded-lg">
        <h2 className="text-xl font-semibold text-purple-800 mb-3">
          Firebase Configuration (Push Notifications)
        </h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Project ID:</strong> 
            <span className="ml-2 text-green-600">
              {(import.meta as any).env.VITE_FIREBASE_PROJECT_ID}
            </span>
          </div>
          <div>
            <strong>App ID:</strong> 
            <span className="ml-2 text-green-600">
              {(import.meta as any).env.VITE_FIREBASE_APP_ID}
            </span>
          </div>
          <div>
            <strong>Sender ID:</strong> 
            <span className="ml-2 text-green-600">
              {(import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID}
            </span>
          </div>
          <div>
            <strong>VAPID Key:</strong>{' '}
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              (import.meta as any).env.VITE_FIREBASE_VAPID_KEY 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}>
              {(import.meta as any).env.VITE_FIREBASE_VAPID_KEY ? 'Configured ✓' : 'Missing ✗'}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            ✓ Firebase configuration is properly set up for push notifications
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-800 mb-3">
          Troubleshooting Guide
        </h2>
        <div className="space-y-3 text-sm">
          <div>
            <strong>If Test Web Notifications isn't working:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>
                <strong>Backend not running:</strong> Start your backend server: 
                <code className="bg-gray-200 px-2 py-1 rounded ml-1">cd .. && npm run dev</code>
              </li>
              <li>
                <strong>Permission denied:</strong> Check browser notification settings and allow notifications for this site
              </li>
              <li>
                <strong>Service worker issues:</strong> Check browser console for errors, try refreshing the page
              </li>
              <li>
                <strong>HTTPS required:</strong> Some browsers require HTTPS for notifications (localhost usually works)
              </li>
            </ul>
          </div>
          
          <div>
            <strong>For testing on native devices:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Build and sync: <code className="bg-gray-200 px-2 py-1 rounded">npm run cap:sync</code></li>
              <li>Open in IDE: <code className="bg-gray-200 px-2 py-1 rounded">npm run cap:android</code> or <code className="bg-gray-200 px-2 py-1 rounded">npm run cap:ios</code></li>
              <li>Add Firebase config files (google-services.json, GoogleService-Info.plist)</li>
              <li>Test on real devices (push notifications don't work on simulators)</li>
              <li><strong>Note:</strong> Native apps don't use browser Notification API - they use Capacitor's PushNotifications plugin</li>
            </ul>
          </div>

          <div>
            <strong>Quick checks:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Backend Status: {isBackendRunning === true ? '✅' : '❌'} Backend running</li>
              <li>Browser Permission: {
                (() => {
                  const permission = getBrowserNotificationPermission();
                  if (permission === 'n/a-native') return '➖ N/A (Native App)';
                  if (permission === 'granted') return '✅ Notifications allowed';
                  return '❌ Notifications not allowed';
                })()
              }</li>
              <li>Service Worker: Use "Test Service Worker" button to verify</li>
              <li>Firebase Config: {(import.meta as any).env.VITE_FIREBASE_VAPID_KEY ? '✅' : '❌'} VAPID key configured</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacitorTestPage;
