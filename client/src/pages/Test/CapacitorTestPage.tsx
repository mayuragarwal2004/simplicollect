import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useCapacitorNotifications } from '../../hooks/useCapacitorNotifications';
import usePushNotifications from '../../hooks/usePushNotifications';

const CapacitorTestPage: React.FC = () => {
  const [platform, setPlatform] = useState<string>('');
  const [isNative, setIsNative] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  
  const capacitorNotifications = useCapacitorNotifications();
  const webNotifications = usePushNotifications();

  useEffect(() => {
    // Get platform information
    const currentPlatform = Capacitor.getPlatform();
    const isNativePlatform = Capacitor.isNativePlatform();
    
    setPlatform(currentPlatform);
    setIsNative(isNativePlatform);

    // Get additional device info
    setDeviceInfo({
      platform: currentPlatform,
      isNative: isNativePlatform,
      isPluginAvailable: Capacitor.isPluginAvailable('PushNotifications'),
    });
  }, []);

  const testWebNotifications = async () => {
    try {
      await webNotifications.subscribeToPush();
    } catch (error) {
      console.error('Web notification test failed:', error);
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
            <strong>Environment:</strong> {import.meta.env.MODE}
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

      {/* Test Buttons */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Test Functions
        </h2>
        <div className="space-x-4">
          {isNative ? (
            <button
              onClick={testCapacitorNotifications}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={!capacitorNotifications.isSupported}
            >
              Test Capacitor Notifications
            </button>
          ) : (
            <button
              onClick={testWebNotifications}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              disabled={!webNotifications.isSupported || webNotifications.loading}
            >
              {webNotifications.loading ? 'Testing...' : 'Test Web Notifications'}
            </button>
          )}
        </div>
      </div>

      {/* Firebase Configuration */}
      <div className="mb-8 p-4 bg-purple-50 rounded-lg">
        <h2 className="text-xl font-semibold text-purple-800 mb-3">
          Firebase Configuration
        </h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Project ID:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID}
          </div>
          <div>
            <strong>App ID:</strong> {import.meta.env.VITE_FIREBASE_APP_ID}
          </div>
          <div>
            <strong>Sender ID:</strong> {import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}
          </div>
          <div>
            <strong>VAPID Key:</strong>{' '}
            {import.meta.env.VITE_FIREBASE_VAPID_KEY ? 'Configured' : 'Missing'}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-800 mb-3">
          Next Steps
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            {isNative
              ? 'Test push notifications using Firebase Console'
              : 'Enable notifications and test in browser'}
          </li>
          <li>
            Check the browser/device console for detailed logs
          </li>
          <li>
            Verify Firebase configuration files are in place:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>android/app/google-services.json</li>
              <li>ios/App/App/GoogleService-Info.plist</li>
            </ul>
          </li>
          <li>
            Test on real devices for full functionality
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CapacitorTestPage;
