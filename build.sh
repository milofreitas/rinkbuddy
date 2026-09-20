#!/bin/bash
# Build script for RinkBuddy native apps
# Usage: ./build.sh [ios|android|both]

set -e
export PATH="/opt/homebrew/bin:$PATH"

echo "📦 Copying web assets to www/..."
cp index.html www/
cp manifest.json www/
cp sw.js www/
cp skill-diagrams.js www/
for asset in favicon.svg favicon-32.png favicon-16.png apple-touch-icon-180.png \
             icon-192.png icon-512.png icon-maskable-512.png og-image.png; do
  cp "$asset" www/
done

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
