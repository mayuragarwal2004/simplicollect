// FCM Service Worker for handling background notifications
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBSKQ6vRxJreWTh5XMYTv9hiywwzEUmOIY',
  authDomain: 'simplicollect-cdbae.firebaseapp.com',
  projectId: 'simplicollect-cdbae',
  storageBucket: 'simplicollect-cdbae.firebasestorage.app',
  messagingSenderId: '1028966778168',
  appId: '1:1028966778168:web:458e23fb140468628c6dcd',
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.tag || 'general',
    data: payload.data,
    requireInteraction: payload.data?.priority === 'urgent',
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-dismiss.png'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event);

  event.notification.close();

  if (event.action === 'view') {
    // Handle view action
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Handle dismiss action
    console.log('Notification dismissed');
  } else {
    // Handle default click
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
