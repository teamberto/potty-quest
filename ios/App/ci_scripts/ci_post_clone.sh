#!/bin/sh
set -e

export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install node@18
brew link node@18 --force

cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install

cd ios/App
pod install
