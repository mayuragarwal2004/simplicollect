@echo off
echo 🔄 Starting Logo Asset Generation...

:: Check if cordova-res is installed
where cordova-res >nul 2>nul
IF ERRORLEVEL 1 (
    echo ⚠️  cordova-res not found. Attempting to install...
    npm install -g cordova-res
    IF ERRORLEVEL 1 (
        echo ❌ Failed to install cordova-res. Please install it manually using "npm install -g cordova-res"
        exit /b 1
    )
)

:: Navigate to client directory
cd /d %~dp0\..\client

echo ✅ Generating Capacitor Assets...
npx capacitor-assets generate

echo ✅ Generating Android Icons with cordova-res...
cordova-res android --skip-config --copy

echo ✅ Building project and syncing...
npm run build && npx cap copy && npx cap sync

echo 🎉 Logo asset generation completed successfully!
