import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../utils/config';
import { toast } from 'react-toastify';
import ClickOutside from '../ClickOutside';
import usePushNotifications from '../../hooks/usePushNotifications';

interface Notification {
  notificationId: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
}

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const { isSupported, isSubscribed, subscribeToPush } = usePushNotifications();

  useEffect(() => {
    fetchUnreadCount();
    checkNotificationPermission();
  }, []);

  useEffect(() => {
    if (dropdownOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [dropdownOpen]);

  const checkNotificationPermission = () => {
    if (isSupported && !isSubscribed && Notification.permission === 'default') {
      setShowPermissionPrompt(true);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/api/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/notifications?limit=5');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif.notificationId === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      await subscribeToPush();
      toast.success('Push notifications enabled successfully!');
      setShowPermissionPrompt(false);
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable push notifications');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return '💰';
      case 'report':
        return '📊';
      case 'meeting':
        return '📅';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-gray-400';
      default:
        return 'border-l-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <button
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
            if (unreadCount > 0) {
              fetchNotifications();
            }
          }}
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
            </span>
          )}

          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80">
            <div className="px-4.5 py-3 border-b border-stroke dark:border-strokedark">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-bodydark2">
                  Notifications
                </h5>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* Permission Prompt */}
            {showPermissionPrompt && (
              <div className="p-4 bg-blue-50 border-b border-stroke dark:border-strokedark dark:bg-blue-900/20">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Enable push notifications to stay updated on important events
                    </p>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={handleEnableNotifications}
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Enable
                      </button>
                      <button
                        onClick={() => setShowPermissionPrompt(false)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex h-auto flex-col overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-bodydark2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-bodydark2">
                  <svg className="mx-auto h-10 w-10 text-bodydark2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5V9.5a6.5 6.5 0 1 0-13 0V12l-5 5h5m13 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
                  </svg>
                  <p className="mt-2 text-sm">No notifications</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.notificationId}>
                      <div
                        className={`flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                          !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => !notification.isRead && markAsRead(notification.notificationId)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2 flex-1">
                            <span className="text-lg flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">
                                <span className={`${!notification.isRead ? 'font-semibold text-black dark:text-white' : 'text-black dark:text-white'}`}>
                                  {notification.title}
                                </span>
                              </p>
                              <p className="text-sm text-bodydark2 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-bodydark2">
                          <span>{formatDate(notification.createdAt)}</span>
                          {notification.senderName && (
                            <span>From: {notification.senderName}</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-stroke dark:border-strokedark p-3">
                <Link
                  to="/member/notifications"
                  className="block text-center text-sm text-primary hover:underline"
                  onClick={() => setDropdownOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
