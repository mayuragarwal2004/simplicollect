#!/bin/bash

echo "🔄 Starting Logo Asset Generation..."

# Check if cordova-res is installed
if ! command -v cordova-res &> /dev/null
then
    echo "⚠️  cordova-res not found. Attempting to install it globally..."
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

echo "✅ Generating Capacitor Assets..."
npx capacitor-assets generate

echo "✅ Generating Android Icons with cordova-res..."
cordova-res android --skip-config --copy

echo "✅ Building project and syncing..."
npm run build && npx cap copy && npx cap sync

echo "🎉 Logo asset generation completed successfully!"
