# Capacitor Integration Guide for SimpliCollect

This guide will help you complete the Capacitor integration and convert your React web app to native Android and iOS apps with push notification support.

## Prerequisites

- Node.js and npm installed
- Android Studio (for Android development)
- Xcode (for iOS development - Mac only)
- Firebase project with FCM enabled

## 1. Current Status

✅ **Completed:**
- Capacitor CLI and platforms installed
- Android and iOS platforms added
- Basic configuration set up
- Push notification service integrated

## 2. Platform-Specific Configuration

### Android Configuration

1. **Add Firebase Configuration for Android:**
   - Download `google-services.json` from your Firebase project console
   - Place it in: `client/android/app/google-services.json`

2. **Update Android Manifest:**
   Edit `client/android/app/src/main/AndroidManifest.xml`:
   ```xml
   <!-- Add these permissions -->
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
   <uses-permission android:name="android.permission.VIBRATE" />
   <uses-permission android:name="android.permission.WAKE_LOCK" />
   
   <!-- Add notification channel for Android 8+ -->
   <receiver android:name="com.google.firebase.iid.FirebaseInstanceIdInternalReceiver" android:exported="false" />
   <receiver android:name="com.google.firebase.iid.FirebaseInstanceIdReceiver" android:exported="true" android:permission="com.google.android.c2dm.permission.SEND">
     <intent-filter>
       <action android:name="com.google.android.c2dm.intent.RECEIVE" />
       <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
       <category android:name="${applicationId}" />
     </intent-filter>
   </receiver>
   ```

3. **Configure Build Gradle:**
   Edit `client/android/app/build.gradle`:
   ```gradle
   // Add at the bottom of the file
   apply plugin: 'com.google.gms.google-services'
   ```

   Edit `client/android/build.gradle`:
   ```gradle
   dependencies {
     classpath 'com.google.gms:google-services:4.3.15'
     // ... other dependencies
   }
   ```

### iOS Configuration

1. **Add Firebase Configuration for iOS:**
   - Download `GoogleService-Info.plist` from Firebase console
   - Open `client/ios/App/App.xcworkspace` in Xcode
   - Drag and drop `GoogleService-Info.plist` into the App folder in Xcode
   - Make sure it's added to the target

2. **Configure Push Notifications:**
   - In Xcode, select your App target
   - Go to "Signing & Capabilities"
   - Add "Push Notifications" capability
   - Add "Background Modes" capability and enable "Remote notifications"

3. **Update Info.plist:**
   Add Firebase configuration to `client/ios/App/App/Info.plist`:
   ```xml
   <key>UIBackgroundModes</key>
   <array>
     <string>remote-notification</string>
   </array>
   ```

## 3. Development Workflow

### Running the App

1. **Build the web app:**
   ```bash
   cd client
   npm run build
   ```

2. **Copy assets to native projects:**
   ```bash
   npx cap copy
   ```

3. **Sync native dependencies:**
   ```bash
   npx cap sync
   ```

4. **Open in native IDE:**
   ```bash
   # For Android
   npx cap open android
   
   # For iOS
   npx cap open ios
   ```

### Testing Push Notifications

1. **Web Testing:**
   - Run the web app: `npm run dev`
   - Open browser dev tools to see console logs
   - Test notification permissions and token generation

2. **Android Testing:**
   - Connect an Android device or use emulator
   - Build and run from Android Studio
   - Test notifications using Firebase Console

3. **iOS Testing:**
   - Connect an iOS device (push notifications don't work on simulator)
   - Build and run from Xcode
   - Test notifications using Firebase Console

## 4. Push Notification Setup

### Backend Configuration

1. **Environment Variables:**
   Make sure your backend `.env` has:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY=your-private-key
   ```

2. **FCM Service Account:**
   - Generate a service account key from Firebase Console
   - Download the JSON file
   - Extract the required fields for your `.env`

### Frontend Configuration

1. **Environment Variables:**
   Update `client/.env`:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_VAPID_KEY=your-vapid-key
   ```

## 5. Build and Deployment

### Android Build

1. **Debug Build:**
   ```bash
   cd client/android
   ./gradlew assembleDebug
   ```

2. **Release Build:**
   ```bash
   cd client/android
   ./gradlew assembleRelease
   ```

### iOS Build

1. **Debug Build:**
   - Open Xcode
   - Select your device or simulator
   - Press Cmd+R to build and run

2. **Release Build:**
   - Archive the app in Xcode
   - Export for distribution

## 6. Troubleshooting

### Common Issues

1. **Service Worker Registration Failed:**
   - Ensure `firebase-messaging-sw.js` is in the `public` folder
   - Check browser console for errors
   - Verify VAPID key is correct

2. **Android Build Errors:**
   - Clean and rebuild: `./gradlew clean && ./gradlew build`
   - Check Java version compatibility
   - Verify google-services.json is in the correct location

3. **iOS Push Notifications Not Working:**
   - Ensure you're testing on a real device
   - Check provisioning profile includes push notifications
   - Verify APNs certificates are configured in Firebase

4. **Token Not Generated:**
   - Check browser/device permissions
   - Verify Firebase configuration
   - Check console logs for specific errors

### Debugging Tips

1. **Enable Verbose Logging:**
   ```javascript
   // Add to your app initialization
   if (import.meta.env.DEV) {
     console.log('Development mode - enabling verbose logging');
   }
   ```

2. **Test Token Generation:**
   ```javascript
   // Add to your component for testing
   const testToken = async () => {
     const service = getNotificationService();
     const token = await service.getToken();
     console.log('Current token:', token);
   };
   ```

## 7. Next Steps

1. **Test on Real Devices:**
   - Set up Android device for testing
   - Set up iOS device for testing
   - Test push notifications end-to-end

2. **Optimize Performance:**
   - Implement code splitting
   - Optimize bundle size
   - Add loading states

3. **Add Advanced Features:**
   - Rich notifications with images
   - Notification categories
   - Deep linking from notifications
   - Analytics and tracking

4. **Production Deployment:**
   - Set up CI/CD pipeline
   - Configure app signing
   - Submit to app stores

## 8. Commands Reference

```bash
# Build web app
npm run build

# Copy assets to native projects
npx cap copy

# Sync native dependencies
npx cap sync

# Open in native IDE
npx cap open android
npx cap open ios

# Run on device
npx cap run android
npx cap run ios

# Live reload during development
npx cap run android --livereload
npx cap run ios --livereload

# Clean and rebuild
npx cap clean
npx cap sync --force
```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Firebase Push Notifications](https://firebase.google.com/docs/cloud-messaging)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Guide](https://developer.apple.com/documentation)
