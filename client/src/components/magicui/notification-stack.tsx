import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, CheckCircledIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  title: string;
  description: string;
  type: 'success' | 'info';
  icon?: React.ReactNode;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: 'New event',
    description: 'Team meeting scheduled for tomorrow',
    type: 'info',
    icon: <BellIcon className="h-5 w-5" />
  },
  {
    id: 2,
    title: 'Payment received',
    description: 'Successfully processed member fee',
    type: 'success',
    icon: <CheckCircledIcon className="h-5 w-5" />
  }
];

export function NotificationStack() {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < notifications.length) {
        setActiveNotifications(prev => [...prev, notifications[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const removeNotification = (id: number) => {
    setActiveNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {activeNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex w-80 items-center gap-4 rounded-lg bg-white p-4 shadow-lg"
          >
            <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
              {notification.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-500">{notification.description}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <Cross2Icon className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 