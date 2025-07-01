#!/bin/bash

echo "Setting up Firebase configuration files for native platforms..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo -e "${YELLOW}Detected Windows environment${NC}"
fi

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓ Found: $1${NC}"
        return 0
    else
        echo -e "${RED}✗ Missing: $1${NC}"
        return 1
    fi
}

# Function to copy file with confirmation
copy_file() {
    local src="$1"
    local dest="$2"
    
    if [ -f "$src" ]; then
        cp "$src" "$dest"
        echo -e "${GREEN}✓ Copied: $src -> $dest${NC}"
    else
        echo -e "${RED}✗ Source file not found: $src${NC}"
        echo -e "${YELLOW}  Please download this file from Firebase Console${NC}"
    fi
}

echo "Checking for Firebase configuration files..."

# Check for google-services.json (Android)
if check_file "google-services.json"; then
    copy_file "google-services.json" "android/app/google-services.json"
else
    echo -e "${YELLOW}  Download google-services.json from Firebase Console -> Project Settings -> General -> Your Apps (Android)${NC}"
fi

# Check for GoogleService-Info.plist (iOS)
if check_file "GoogleService-Info.plist"; then
    copy_file "GoogleService-Info.plist" "ios/App/App/GoogleService-Info.plist"
else
    echo -e "${YELLOW}  Download GoogleService-Info.plist from Firebase Console -> Project Settings -> General -> Your Apps (iOS)${NC}"
fi

# Create directories if they don't exist
mkdir -p android/app
mkdir -p ios/App/App

echo ""
echo "Configuration file setup complete!"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Download the missing Firebase configuration files from Firebase Console"
echo "2. Place google-services.json in the root directory and run this script again"
echo "3. Place GoogleService-Info.plist in the root directory and run this script again"
echo "4. For iOS: Open ios/App/App.xcworkspace in Xcode and add GoogleService-Info.plist to the App target"
echo ""
echo -e "${GREEN}Ready to build your native apps!${NC}"
