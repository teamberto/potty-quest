#!/bin/sh
   set -e

   cd "$CI_PRIMARY_REPOSITORY_PATH"
   npm install

   cd ios/App
   pod install
