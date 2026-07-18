#!/bin/sh
set -e

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
# Node 22+ required: @capacitor-community/admob@8 declares "engines": { "node": ">=22.0.0" }.
brew install node@22
brew link node@22 --force

cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install --ignore-scripts
npm run ios:sync

cd ios/App
pod install
