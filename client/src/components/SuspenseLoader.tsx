import React from 'react';
import { Loader2, Zap } from 'lucide-react';

interface SuspenseLoaderProps {
  message?: string;
  showLogo?: boolean;
}

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ 
  message = "Loading...", 
  showLogo = true 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        {/* Animated Logo */}
        {showLogo && (
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-blue-600 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {message}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare your content
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
