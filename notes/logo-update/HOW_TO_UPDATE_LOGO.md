# 🖼️ Logo Update Guide

If you are updating the logo of this project, please **replace the appropriate image files** and run the logo generation script to ensure all platforms are updated correctly.

---

## 📁 Locations to Replace Logo Files

Update the following files with your new logo assets:

```

client/assets/
├── icon-only.png
├── icon-foreground.png
├── icon-background.png
├── splash.png
└── splash-dark.png

client/resources/
├── icon.png
├── splash.png
└── android/
    ├── icon-foreground.png
    └── icon-background.png

client/public/
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── apple-touch-icon.png
├── favicon-16x16.png
├── favicon-32x32.png
└── favicon.ico

client/src/images/logo/
├── logo-dark.svg
├── logo-icon.svg
└── logo.svg

````

---

## ⚙️ Running the Logo Generator

Once the above files are replaced, run the script depending on your OS:

- **macOS/Linux**: `./scripts/generate-logo.sh`
- **Windows**: `scripts\generate-logo.bat`

This script will:
- Navigate into the `client` directory.
- Run Capacitor and Cordova asset generation commands.
- Build and sync the app.

---

## 🚨 Prerequisites

The script assumes the following tools are installed globally:

- `npx` (comes with Node.js)
- `cordova-res`

If `cordova-res` is not installed, the script will attempt to install it automatically. If it fails, install it manually:

```bash
npm install -g cordova-res
````

---

## 🔁 Commands Executed by Script

```bash
npx capacitor-assets generate
cordova-res android --skip-config --copy
npm run build && npx cap copy && npx cap sync
```