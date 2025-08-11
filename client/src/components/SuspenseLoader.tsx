import React, { useEffect, useState } from 'react';
import { Loader2, Zap, WifiOff } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface SuspenseLoaderProps {
  message?: string;
  showLogo?: boolean;
}

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ 
  message = "Loading...", 
  showLogo = true 
}) => {
  const [isOffline, setIsOffline] = useState(false);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Show offline message after 5 seconds of loading
    const timer = setTimeout(() => {
      if (!navigator.onLine && !Capacitor.isNativePlatform()) {
        setIsOffline(true);
        setShowOfflineMessage(true);
      }
    }, 5000);

    // Listen for network changes (web only)
    if (!Capacitor.isNativePlatform()) {
      const handleOffline = () => setIsOffline(true);
      const handleOnline = () => {
        setIsOffline(false);
        setShowOfflineMessage(false);
      };

      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('online', handleOnline);
      };
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        {/* Animated Logo */}
        {showLogo && (
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-20 h-20 ${isOffline ? 'bg-gray-500' : 'bg-blue-600'} rounded-full flex items-center justify-center animate-pulse`}>
                {isOffline ? (
                  <WifiOff className="w-10 h-10 text-white" />
                ) : (
                  <Zap className="w-10 h-10 text-white" />
                )}
              </div>
              <div className={`absolute inset-0 w-20 h-20 ${isOffline ? 'bg-gray-500' : 'bg-blue-600'} rounded-full animate-ping opacity-75`}></div>
            </div>
          </div>
        )}

        {/* Loading Spinner or Offline Icon */}
        <div className="flex justify-center">
          {isOffline ? (
            <WifiOff className="w-8 h-8 text-gray-500" />
          ) : (
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          )}
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {showOfflineMessage ? "Connection Issue" : message}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {showOfflineMessage 
              ? "Please check your internet connection and try again" 
              : "Please wait while we prepare your content"
            }
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SuspenseLoader;
