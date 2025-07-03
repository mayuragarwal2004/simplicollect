const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
let firebaseApp = null;

const initializeFirebase = () => {
  if (!firebaseApp) {
    try {
      // Path to your service account key file
      const serviceAccountPath = path.join(__dirname, '../../config/firebase-service-account.json');
      
      // Alternative: Use environment variables for the key
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
    }
  }
  return firebaseApp;
};

// Send notification to a single token
const sendToToken = async (token, notificationData) => {
  const app = initializeFirebase();
  if (!app) {
    throw new Error('Firebase not initialized');
  }

  const message = {
    token,
    notification: {
      title: notificationData.title,
      body: notificationData.message,
      imageUrl: notificationData.imageUrl,
    },
    data: {
      notificationId: notificationData.notificationId || '',
      type: notificationData.type || 'general',
      priority: notificationData.priority || 'medium',
      clickAction: notificationData.clickAction || '/',
      ...notificationData.customData
    },
    android: {
      notification: {
        channelId: 'simplicollect_notifications',
        priority: notificationData.priority === 'urgent' ? 'high' : 'default',
        sound: 'default',
        clickAction: notificationData.clickAction || 'FLUTTER_NOTIFICATION_CLICK'
      }
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: 'default',
          category: notificationData.type || 'general'
        }
      }
    },
    webpush: {
      headers: {
        TTL: '86400' // 24 hours
      },
      notification: {
        title: notificationData.title,
        body: notificationData.message,
        icon: notificationData.icon || '/android-chrome-192x192.png',
        badge: notificationData.badge || '/badge-72x72.png',
        tag: notificationData.type || 'general',
        requireInteraction: notificationData.priority === 'urgent',
        actions: [
          {
            action: 'view',
            title: 'View'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Send notification to multiple tokens
const sendToMultipleTokens = async (tokens, notificationData) => {
  const app = initializeFirebase();
  if (!app) {
    throw new Error('Firebase not initialized');
  }

  if (!tokens || tokens.length === 0) {
    throw new Error('No tokens provided');
  }

  const message = {
    tokens,
    notification: {
      title: notificationData.title,
      body: notificationData.message,
      imageUrl: notificationData.imageUrl,
    },
    data: {
      notificationId: notificationData.notificationId || '',
      type: notificationData.type || 'general',
      priority: notificationData.priority || 'medium',
      clickAction: notificationData.clickAction || '/',
      ...notificationData.customData
    },
    android: {
      notification: {
        channelId: 'simplicollect_notifications',
        priority: notificationData.priority === 'urgent' ? 'high' : 'default',
        sound: 'default'
      }
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: 'default',
          category: notificationData.type || 'general'
        }
      }
    },
    webpush: {
      headers: {
        TTL: '86400'
      },
      notification: {
        title: notificationData.title,
        body: notificationData.message,
        icon: notificationData.icon || '/icon-192x192.png',
        badge: notificationData.badge || '/badge-72x72.png',
        tag: notificationData.type || 'general',
        requireInteraction: notificationData.priority === 'urgent'
      }
    }
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('Successfully sent multicast message:', response);
    
    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error('Failed to send to token:', tokens[idx], resp.error);
        }
      });
      
      // You might want to remove invalid tokens from your database here
      console.log('Failed tokens:', failedTokens);
    }
    
    return response;
  } catch (error) {
    console.error('Error sending multicast message:', error);
    throw error;
  }
};

// Send to topic (for broadcast messages)
const sendToTopic = async (topic, notificationData) => {
  const app = initializeFirebase();
  if (!app) {
    throw new Error('Firebase not initialized');
  }

  const message = {
    topic,
    notification: {
      title: notificationData.title,
      body: notificationData.message,
    },
    data: {
      notificationId: notificationData.notificationId || '',
      type: notificationData.type || 'general',
      priority: notificationData.priority || 'medium',
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent topic message:', response);
    return response;
  } catch (error) {
    console.error('Error sending topic message:', error);
    throw error;
  }
};

module.exports = {
  initializeFirebase,
  sendToToken,
  sendToMultipleTokens,
  sendToTopic
};
