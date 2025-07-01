import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Capacitor } from '@capacitor/core';
import usePushNotifications from '../hooks/usePushNotifications';

const PushNotificationSettings: React.FC = () => {
  const { isSupported, isSubscribed, loading, subscribeToPush, unsubscribeFromPush } = usePushNotifications();

  const handleToggleSubscription = async () => {
    try {
      if (isSubscribed) {
        await unsubscribeFromPush();
      } else {
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      toast.error('Failed to update push notification settings');
    }
  };

  const getPlatformInfo = () => {
    if (Capacitor.isNativePlatform()) {
      const platform = Capacitor.getPlatform();
      return {
        name: platform === 'ios' ? 'iOS' : 'Android',
        type: 'Native App',
        service: 'Firebase Cloud Messaging'
      };
    } else {
      return {
        name: 'Web',
        type: 'Browser',
        service: 'Firebase Cloud Messaging'
      };
    }
  };

  const platformInfo = getPlatformInfo();

  if (!isSupported) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
              Push Notifications Not Supported
            </h3>
            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Push Notifications
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Receive notifications even when you're not using the app
          </p>
          <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {platformInfo.service}
            </span>
            <span>{platformInfo.name} {platformInfo.type}</span>
          </div>
        </div>
        
        <button
          onClick={handleToggleSubscription}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 ${
            isSubscribed 
              ? 'bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
          role="switch"
          aria-checked={isSubscribed}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
              isSubscribed ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {isSubscribed && (
        <div className="mt-4 rounded-md bg-green-50 p-4 dark:bg-green-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Push notifications are enabled
              </p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                You'll receive notifications for important updates, payment requests, and more.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Notification Types
        </h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <span className="text-lg mr-2">💰</span>
            <span>Payment requests and approvals</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg mr-2">📊</span>
            <span>Chapter reports and updates</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg mr-2">📅</span>
            <span>Meeting reminders</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg mr-2">🔔</span>
            <span>General announcements</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Updating settings...
          </span>
        </div>
      )}
    </div>
  );
};

export default PushNotificationSettings;
