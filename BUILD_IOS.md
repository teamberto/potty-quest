# Potty Champ — App Store Build Guide

Everything below runs on your Mac. The project files (package.json,
capacitor.config.json, resources/ art) are already in this folder.

## One-time setup (~15 min)

1. **Install Xcode** from the Mac App Store (big download — start it first).
2. **Install Node.js** if you don't have it: https://nodejs.org (LTS).
3. **Install CocoaPods** (Capacitor needs it):
   ```
   sudo gem install cocoapods
   ```
   If that fails, use Homebrew: `brew install cocoapods`

## Build the iOS project (~5 min)

In Terminal, from this folder:

```
cd ~/potty-quest
npm install
npm run build:www
npx cap add ios
npx @capacitor/assets generate --ios
npx cap sync ios
npx cap open ios
```

What each does: installs Capacitor → copies the game into www/ →
creates the native Xcode project in ios/ → generates all app icons and
splash screens from resources/ → copies the game into the app → opens Xcode.

## In Xcode (first time ~20 min)

1. In the left sidebar click **App** (top item), then the **App** target.
2. **Signing & Capabilities** tab → check **Automatically manage signing**
   → Team: pick your Apple Developer team.
3. **General** tab:
   - Display Name: `Potty Champ`
   - Bundle Identifier: `com.teamberto.pottychamp` (already set)
   - Version: `1.0.0`, Build: `1`
   - Deployment: check **iPhone** and **iPad**; iOS 14.0+ is fine.
   - Device Orientation: check all four (the game scales to any).
4. **Test on a real device**: plug in your iPad, select it in the toolbar
   device menu, press ▶. First run: on the iPad go to
   Settings → General → VPN & Device Management → trust your certificate.

## Upload to the App Store (~15 min + review wait)

1. In Xcode toolbar set the device to **Any iOS Device (arm64)**.
2. Menu: **Product → Archive** (takes a few minutes).
3. In the Organizer window that opens: **Distribute App → App Store Connect
   → Upload** → accept defaults → Upload.
4. Go to https://appstoreconnect.apple.com → **My Apps → + → New App**:
   - Platform: iOS, Name: `Potty Champ`, Language: English
   - Bundle ID: com.teamberto.pottychamp, SKU: `pottychamp1`
5. In the app page fill in:
   - Screenshots: run the game on your iPad, take screenshots
     (Top button + Volume Up), drag them in. Needed: 13" iPad and
     6.7" iPhone sizes (use Simulator for iPhone if you don't have one).
   - Description: see `APP_STORE_LISTING.md`
   - Privacy Policy URL: put PRIVACY.md on GitHub Pages, e.g.
     `https://teamberto.github.io/potty-quest/privacy.html`
   - Age rating: answer the questionnaire (all "None") → likely 4+.
   - App Privacy: select **Data Not Collected** (true — the game
     stores the high score on-device only).
   - Pricing: Free (or your choice).
6. Under **Build**, click + and select the build you uploaded.
7. **Submit for Review**. Typical wait: 1–3 days.

## Updating the app later

After changing game files:
```
npm run ios:sync
npx cap open ios
```
Bump Build number (+1), then Product → Archive → upload again.

## Gotchas

- If Apple flags "minimum functionality" (rare for real games), reply in
  Resolution Center noting it's a fully offline custom game engine with
  original art — not a website wrapper.
- Don't enroll in the "Kids Category" unless you want extra review
  requirements; a 4+ age rating alone is simpler and fine.
