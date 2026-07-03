import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { registerDeviceTokenApi } from '../api/notificationApi';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let messaging = null;
try {
  // getMessaging only runs in browser environments that support it
  messaging = getMessaging(app);
} catch (err) {
  console.warn('Firebase Messaging not supported or failed to initialize:', err);
}

export { app, messaging };

/**
 * Request notification permission and register FCM device token.
 */
export async function requestNotificationPermissionAndRegister() {
  if (!messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Get registration token
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.warn('VITE_FIREBASE_VAPID_KEY is missing in your frontend .env file. Skipping token generation.');
        return;
      }

      const token = await getToken(messaging, { vapidKey });
      if (token) {
        console.log('FCM token generated successfully:', token);
        await registerDeviceTokenApi(token);
      } else {
        console.warn('No registration token available. Request permission to generate one.');
      }
    } else {
      console.warn('Notification permission denied.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
  }
}

/**
 * Set up foreground push notification listener.
 */
export function setupForegroundMessageListener(onNotificationReceived) {
  if (!messaging) return;

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    if (onNotificationReceived && typeof onNotificationReceived === 'function') {
      onNotificationReceived(payload);
    }
  });
}
