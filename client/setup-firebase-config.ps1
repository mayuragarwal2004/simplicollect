# Firebase Configuration Setup for Windows
# PowerShell script to copy Firebase config files to native platforms

Write-Host "Setting up Firebase configuration files for native platforms..." -ForegroundColor Cyan

# Function to check if file exists
function Test-ConfigFile {
    param($Path)
    if (Test-Path $Path) {
        Write-Host "✓ Found: $Path" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ Missing: $Path" -ForegroundColor Red
        return $false
    }
}

# Function to copy file with confirmation
function Copy-ConfigFile {
    param($Source, $Destination)
    
    if (Test-Path $Source) {
        # Create directory if it doesn't exist
        $destDir = Split-Path $Destination -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        Copy-Item $Source $Destination -Force
        Write-Host "✓ Copied: $Source -> $Destination" -ForegroundColor Green
    } else {
        Write-Host "✗ Source file not found: $Source" -ForegroundColor Red
        Write-Host "  Please download this file from Firebase Console" -ForegroundColor Yellow
    }
}

Write-Host "Checking for Firebase configuration files..." -ForegroundColor White

# Check for google-services.json (Android)
if (Test-ConfigFile "google-services.json") {
    Copy-ConfigFile "google-services.json" "android\app\google-services.json"
} else {
    Write-Host "  Download google-services.json from Firebase Console -> Project Settings -> General -> Your Apps (Android)" -ForegroundColor Yellow
}

# Check for GoogleService-Info.plist (iOS)
if (Test-ConfigFile "GoogleService-Info.plist") {
    Copy-ConfigFile "GoogleService-Info.plist" "ios\App\App\GoogleService-Info.plist"
} else {
    Write-Host "  Download GoogleService-Info.plist from Firebase Console -> Project Settings -> General -> Your Apps (iOS)" -ForegroundColor Yellow
}

# Create directories if they don't exist
if (!(Test-Path "android\app")) {
    New-Item -ItemType Directory -Path "android\app" -Force | Out-Null
}
if (!(Test-Path "ios\App\App")) {
    New-Item -ItemType Directory -Path "ios\App\App" -Force | Out-Null
}

Write-Host ""
Write-Host "Configuration file setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Download the missing Firebase configuration files from Firebase Console"
Write-Host "2. Place google-services.json in the root directory and run this script again"
Write-Host "3. Place GoogleService-Info.plist in the root directory and run this script again"
Write-Host "4. For iOS: Open ios/App/App.xcworkspace in Xcode and add GoogleService-Info.plist to the App target"
Write-Host ""
Write-Host "Ready to build your native apps!" -ForegroundColor Green
