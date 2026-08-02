#!/bin/sh
set -e

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
# Node 22+ required: @capacitor-community/admob@8 declares "engines": { "node": ">=22.0.0" }.
brew install node@22
brew link node@22 --force

cd "$CI_PRIMARY_REPOSITORY_PATH"

# Use the Xcode Cloud build number as the app build number so every upload
# to TestFlight is unique — no more manual bumping or duplicate-build errors.
if [ -n "$CI_BUILD_NUMBER" ]; then
  sed -i '' "s/CURRENT_PROJECT_VERSION = [0-9]*;/CURRENT_PROJECT_VERSION = $CI_BUILD_NUMBER;/g" ios/App/App.xcodeproj/project.pbxproj
  echo "Set app build number to $CI_BUILD_NUMBER"
fi

npm install --ignore-scripts
npm run ios:sync

cd ios/App
pod install
