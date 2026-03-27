#!/bin/bash
# Build script for RinkBuddy native apps
# Usage: ./build.sh [ios|android|both]

set -e
export PATH="/opt/homebrew/bin:$PATH"

echo "📦 Copying web assets to www/..."
cp index.html www/
cp manifest.json www/
cp sw.js www/
[ -f icon-192.png ] && cp icon-192.png www/
[ -f icon-512.png ] && cp icon-512.png www/

echo "🔄 Syncing Capacitor..."
npx cap sync

TARGET=${1:-both}

if [ "$TARGET" = "ios" ] || [ "$TARGET" = "both" ]; then
  echo ""
  echo "🍎 Opening Xcode..."
  echo "   In Xcode: Product → Archive → Distribute App → App Store Connect"
  npx cap open ios
fi

if [ "$TARGET" = "android" ] || [ "$TARGET" = "both" ]; then
  echo ""
  echo "🤖 Opening Android Studio..."
  echo "   In Android Studio: Build → Generate Signed Bundle/APK"
  npx cap open android
fi

echo ""
echo "✅ Done! Build and submit from the IDE."
