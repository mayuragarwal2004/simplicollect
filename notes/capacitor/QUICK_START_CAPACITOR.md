# Quick Start Guide: Testing Your Capacitor App

## Current Status ✅

Your Capacitor integration is now complete! Here's what has been set up:

### ✅ Completed Setup
- Capacitor CLI and platforms installed
- Android and iOS platforms added and configured
- Push notification service integrated
- Firebase configuration prepared
- Build scripts added to package.json
- Native push notification services implemented

## 🚀 Next Steps to Test Your App

### 1. Test Web Version First
```bash
cd client
npm run dev
```
- Open http://localhost:5173
- Test push notification functionality in browser
- Check browser console for any errors

### 2. Download Firebase Configuration Files

You need to download these files from your Firebase Console:

#### For Android:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `simplicollect-cdbae`
3. Go to Project Settings → General
4. Scroll to "Your apps" section
5. Click on your Android app (or add one if not exists)
6. Download `google-services.json`
7. Place it in: `client/google-services.json` (root of client folder)

#### For iOS:
1. In the same Firebase Console section
2. Click on your iOS app (or add one if not exists)
3. Download `GoogleService-Info.plist`
4. Place it in: `client/GoogleService-Info.plist` (root of client folder)

### 3. Copy Firebase Configuration Files
```bash
cd client
# Run the PowerShell script (Windows)
./setup-firebase-config.ps1

# Or manually copy:
# cp google-services.json android/app/
# cp GoogleService-Info.plist ios/App/App/
```

### 4. Test Android App

#### Requirements:
- Android Studio installed
- Android device or emulator

#### Steps:
```bash
cd client

# Build and open Android Studio
npm run cap:android

# Or run directly on device
npm run cap:run:android
```

In Android Studio:
1. Wait for Gradle sync to complete
2. Connect Android device or start emulator
3. Click "Run" button
4. Test push notifications

### 5. Test iOS App (Mac only)

#### Requirements:
- Xcode installed
- iOS device or simulator
- Apple Developer account (for push notifications on device)

#### Steps:
```bash
cd client

# Build and open Xcode
npm run cap:ios
```

In Xcode:
1. Open the project: `ios/App/App.xcworkspace`
2. Add `GoogleService-Info.plist` to the App target
3. Configure signing & capabilities
4. Add Push Notifications capability
5. Connect iOS device
6. Build and run

## 🔧 Development Workflow

### Making Changes to Your App:
```bash
# After making changes to your React code:
npm run build          # Build the web app
npx cap copy           # Copy to native platforms
npx cap sync           # Sync changes and dependencies

# Or use the combined scripts:
npm run cap:sync       # Build + sync
npm run cap:android    # Build + sync + open Android Studio
npm run cap:ios        # Build + sync + open Xcode
```

### Live Reload During Development:
```bash
# Android with live reload
npm run cap:run:android:dev

# iOS with live reload
npm run cap:run:ios:dev
```

## 📱 Testing Push Notifications

### 1. Web Browser Testing:
- Go to your web app
- Click on notification settings in profile
- Enable push notifications
- Use Firebase Console to send test messages

### 2. Native App Testing:
- Install app on device
- Grant notification permissions
- App will automatically register for push notifications
- Use Firebase Console → Cloud Messaging to send test notifications

### 3. Backend Testing:
Make sure your backend server is running:
```bash
# In root directory
npm run dev
```

Test the notification endpoints:
- POST `/api/notifications/fcm/subscribe` - Subscribe to notifications
- POST `/api/notifications/send` - Send notifications (admin)

## 🐛 Troubleshooting

### Common Issues:

1. **Build Errors:**
   ```bash
   # Clean and rebuild
   npm run build
   npx cap sync --force
   ```

2. **Firebase Configuration Missing:**
   - Ensure `google-services.json` is in `android/app/`
   - Ensure `GoogleService-Info.plist` is in `ios/App/App/`
   - Check Firebase project settings

3. **Push Notifications Not Working:**
   - Check device permissions
   - Verify Firebase server key in backend `.env`
   - Check console logs for errors
   - Test on real device (not simulator for iOS)

4. **Android Build Issues:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew build
   ```

5. **iOS Build Issues:**
   - Clean build folder in Xcode (Product → Clean Build Folder)
   - Check provisioning profiles
   - Ensure Push Notifications capability is enabled

### Debug Logs:
- Web: Browser Developer Console
- Android: Android Studio Logcat
- iOS: Xcode Console

## 🎯 Key Features Implemented

### Web App Features:
- ✅ FCM web push notifications
- ✅ Service worker for background notifications
- ✅ Notification permission management
- ✅ Firebase integration

### Native App Features:
- ✅ Capacitor push notifications
- ✅ Platform detection (iOS/Android)
- ✅ Native notification handling
- ✅ Deep linking support
- ✅ Background notification support

### Backend Features:
- ✅ FCM token management
- ✅ Cross-platform notification sending
- ✅ Admin notification interface
- ✅ Notification templates and campaigns

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Firebase Push Notifications](https://firebase.google.com/docs/cloud-messaging)
- [Android Developer Guide](https://developer.android.com/guide/topics/ui/notifiers/notifications)
- [iOS Push Notifications](https://developer.apple.com/documentation/usernotifications)

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Web app loads without console errors
- ✅ Push notification permissions can be granted
- ✅ Android app builds and runs
- ✅ iOS app builds and runs
- ✅ Push notifications are received on all platforms
- ✅ Backend can send notifications successfully

Ready to test your native apps! 🚀
