#!/bin/bash

echo "🔄 Starting Logo & Splash Asset Generation..."

# Check if cordova-res is installed
if ! command -v cordova-res &> /dev/null; then
    echo "⚠️  cordova-res not found. Installing globally..."
    npm install -g cordova-res || {
        echo "❌ Failed to install cordova-res. Please install it manually using 'npm install -g cordova-res'"
        exit 1
    }
fi

# Move to client directory
cd "$(dirname "$0")/../client" || {
    echo "❌ Failed to locate client directory."
    exit 1
}

# Verify presence of icon and splash image
if [[ ! -f "resources/icon.png" ]]; then
    echo "❌ Missing resources/icon.png. Please place a 1024x1024 app icon there."
    exit 1
fi

if [[ ! -f "resources/splash.png" ]]; then
    echo "❌ Missing resources/splash.png. Please place a splash screen image (2732x2732 recommended) there."
    exit 1
fi

echo "✅ Generating Capacitor Assets..."
npx capacitor-assets generate

# Generate Android resources with adaptive icons
echo "✅ Generating Adaptive Icons for Android..."
# Ensure the directories exist
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Copy foreground icon if it exists
if [[ -f "assets/icon-foregound.png" ]]; then
    echo "✅ Copying Android adaptive icon foreground..."
    for dpi in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
        cp "assets/icon-foregound.png" "android/app/src/main/res/mipmap-$dpi/ic_launcher_foreground.png"
    done
fi

# Now run cordova-res for remaining assets
echo "✅ Generating remaining Icons and Splash for Android..."
cordova-res android --skip-config --copy

echo "✅ Generating Icons and Splash for iOS..."
cordova-res ios --skip-config --copy

# Copy custom notification badge icon for Android
if [[ -f "public/badge-72x72.png" ]]; then
    cp public/badge-72x72.png android/app/src/main/res/drawable/ic_stat_notify.png
    echo "✅ Copied notification badge icon."
fi

echo "🔄 Syncing Capacitor..."
npm run build && npx cap copy && npx cap sync ios && npx cap sync android

echo "🎉 Logo & Splash asset generation completed successfully!"
