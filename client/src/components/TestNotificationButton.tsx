import React, { useState } from 'react';
import { axiosInstance } from '../utils/config';
import { toast } from 'react-toastify';

const TestNotificationButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/api/notifications/send', {
        title: 'Test Notification',
        message: 'This is a test notification to verify the system is working!',
        type: 'info',
        priority: 'medium',
        isPersistent: true,
        targetType: 'self'
      });
      
      toast.success('Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={sendTestNotification}
      disabled={loading}
      className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
    >
      {loading ? 'Sending...' : 'Send Test Notification'}
    </button>
  );
};

export default TestNotificationButton;
