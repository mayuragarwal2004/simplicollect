// Firebase configuration for web and Capacitor apps
import { initializeApp, getApps } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from 'firebase/messaging';

// Your Firebase config
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || 'AIzaSyBSKQ6vRxJreWTh5XMYTv9hiywwzEUmOIY',
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || 'simplicollect-cdbae.firebaseapp.com',
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || 'simplicollect-cdbae',
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || 'simplicollect-cdbae.firebasestorage.app',
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1028966778168',
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || '1:1028966778168:web:458e23fb140468628c6dcd',
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging: any = null;

// Check if messaging is supported (not supported in all environments)
const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      return messaging;
    }
    return null;
  } catch (error) {
    console.error('Error initializing Firebase messaging:', error);
    return null;
  }
};

export { app, messaging, initializeMessaging, getToken, onMessage };
