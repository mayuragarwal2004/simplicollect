/* eslint-disable no-restricted-globals */

// Service Worker for handling push notifications
const CACHE_NAME = 'simplicollect-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/badge-72x72.png',
      tag: data.tag || 'general',
      data: data.data || {},
      requireInteraction: data.data?.priority === 'urgent',
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

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error handling push event:', error);
    
    // Fallback notification
    event.waitUntil(
      self.registration.showNotification('New Notification', {
        body: 'You have a new notification from SimpliCollect',
        icon: '/icon-192x192.png',
        tag: 'fallback'
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Handle notification click
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        // Check if there's already an open window/tab
        for (const client of clients) {
          if (client.url.includes(self.location.origin)) {
            // Focus existing window and navigate to the URL
            client.focus();
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              url: urlToOpen,
              data: event.notification.data
            });
            return;
          }
        }
        
        // If no window is open, open a new one
        return self.clients.openWindow(urlToOpen);
      })
  );
});

// Background sync (optional - for offline support)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    // Sync notifications when back online
    console.log('Syncing notifications...');
    // You can implement offline notification queuing here
  } catch (error) {
    console.error('Error syncing notifications:', error);
  }
}

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data.type === 'UPDATE_BADGE') {
    // Update notification badge count
    if ('setAppBadge' in navigator) {
      navigator.setAppBudge(event.data.count);
    }
  }
});

// Fetch event (optional - for caching)
self.addEventListener('fetch', (event) => {
  // You can implement caching strategies here if needed
  // For now, just pass through all requests
  return;
});
