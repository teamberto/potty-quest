# Potty Champ — App Store Build Guide

Everything below runs on your Mac. The project files (package.json,
capacitor.config.json, resources/ art) are already in this folder.

## ⚠️ Capacitor 6 → 8 upgrade (required for ads/IAP)

`package.json` now points at Capacitor 8 and adds two native plugins
(`@capacitor-community/admob`, `@revenuecat/purchases-capacitor`) — the
current, maintained versions of both only support Capacitor 8, not the 6.x
this project started on. This means:

- **Xcode 26 or newer** is required (Capacitor 8's minimum). Update Xcode
  from the Mac App Store if you're on an older version.
- **iOS 15.0** is the minimum deployment target — the Podfile is already
  set to this, so no change needed there.
- Since `ios/` already exists (committed to git), do **not** run
  `npx cap add ios` again — that's only for a fresh project. Instead run
  `npx cap sync ios` after `npm install` (see below) to pull the new
  plugins' native code into the existing project.
- After syncing, open Xcode and do one **Product → Clean Build Folder**
  before your first build — new native plugins sometimes need it.

If anything looks off after the upgrade (build errors, missing symbols),
check Capacitor's official migration notes: https://capacitorjs.com/docs/updating/8-0

## One-time setup (~15 min)

1. **Install Xcode 26+** from the Mac App Store (big download — start it first).
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
npx cap sync ios
npx cap open ios
```

What each does: installs Capacitor + the new ad/IAP plugins → copies the
game into www/ → copies the game and native plugin code into the existing
ios/ project → opens Xcode.

(`npx cap add ios` is **not** needed — the native project is already
committed to this repo.)

## In Xcode (first time ~20 min)

1. In the left sidebar click **App** (top item), then the **App** target.
2. **Signing & Capabilities** tab → check **Automatically manage signing**
   → Team: pick your Apple Developer team.
3. **General** tab:
   - Display Name: `Potty Champ`
   - Bundle Identifier: `com.teamberto.pottychamp` (already set)
   - Version: `1.0.0`, Build: `1`
   - Deployment: check **iPhone** and **iPad**; iOS 15.0 minimum (set by
     the Podfile — don't lower this, the ad/IAP plugins require it).
   - Device Orientation: check all four (the game scales to any).
4. **Test on a real device**: plug in your iPad, select it in the toolbar
   device menu, press ▶. First run: on the iPad go to
   Settings → General → VPN & Device Management → trust your certificate.

## Monetization setup (ads + Remove Ads purchase)

The game code is already wired up for a rewarded video bonus, an
interstitial between levels, and a "Remove Ads" purchase — but it ships
pointed at Google's public **test** ad IDs and a made-up product ID until
you do the following:

### 1. AdMob (ads)

1. Go to https://admob.google.com and sign in / create an account.
2. **Apps → Add app** → iOS → "Potty Champ" → link it to the App Store
   listing once that exists (or add manually with bundle ID
   `com.teamberto.pottychamp`).
3. Copy the **App ID** (looks like `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)
   and paste it into `ios/App/App/Info.plist`, replacing the value of
   `GADApplicationIdentifier` (currently set to Google's test app ID).
4. **Ad units → Add ad unit** → create one **Interstitial** and one
   **Rewarded** ad unit. Copy each ad unit ID (`ca-app-pub-.../....`).
5. In `game.js`, find `AD_UNIT_INTERSTITIAL` and `AD_UNIT_REWARDED` near
   the "Monetization" section and replace the test IDs with your real ones.
6. Under AdMob → your app → **Content settings**, set "Content rating" to
   suit a family audience if the option exists — the app itself already
   requests `maxAdContentRating: General` and child-directed treatment at
   the API level, but confirm the app-level dashboard setting matches.

Test ads will work in the simulator/on a real device with no setup. Real
ads take up to a few hours to start serving after you first set a real
ad unit ID, and AdMob accounts can take 24–48h to fully activate.

### 2. Remove Ads (in-app purchase, via RevenueCat)

The purchase code uses RevenueCat rather than talking to StoreKit directly
— it's a thin, well-maintained wrapper (a raw StoreKit plugin we tried
first, `@capgo/native-purchases`, turned out to have a broken install
script that blocked `pod install`; RevenueCat's is solid and is the
industry-standard choice for this anyway). RevenueCat's free tier covers
an app this size.

**A. Create the product in App Store Connect** (RevenueCat still needs a
real StoreKit product to sell):
1. Once the app exists in App Store Connect: **Features → In-App
   Purchases → +** → **Non-Consumable**.
2. Reference Name: `Remove Ads`. Product ID:
   `com.teamberto.pottychamp.removeads` (must match exactly — this is
   hardcoded in `game.js` as `REMOVE_ADS_PRODUCT_ID`).
3. Price: pick a tier (e.g. $0.99). Add a screenshot and localized
   description when prompted (required before Apple will review it).
4. Submit it for review — it can go out with your next app version
   review, it doesn't need a separate release.

**B. Set up RevenueCat:**
1. Sign up free at https://app.revenuecat.com and create a project (e.g.
   "Potty Champ").
2. **Apps** → add an iOS app, bundle ID `com.teamberto.pottychamp`.
   Connect it to App Store Connect — RevenueCat will walk you through
   generating an App Store Connect API key (Users and Access → Integrations
   → App Store Connect API in App Store Connect) so it can validate
   receipts.
3. **Products** → add a product with ID `com.teamberto.pottychamp.removeads`
   (matching what you created in App Store Connect — it can take a few
   hours to appear there after creation).
4. **Entitlements** → create one called `remove_ads` (must match
   `REMOVE_ADS_ENTITLEMENT_ID` in `game.js`) → attach the
   `com.teamberto.pottychamp.removeads` product to it.
5. **API keys** (project settings) → copy the **public Apple API key**
   → paste it into `game.js`, replacing the `REVENUECAT_API_KEY`
   placeholder near the top of the "Monetization" section.

**C. iOS project setup (in Xcode):**
1. Select the **App** target → **Signing & Capabilities** → **+
   Capability** → add **In-App Purchase**.
2. **Build Settings** → search "Swift Language Version" → confirm it's
   5.0 or higher (it should already be, but RevenueCat requires it).

**D. Test before release:** create a **Sandbox Tester** Apple ID in App
Store Connect → Users and Access → Sandbox, sign into it on your test
device under Settings → App Store → Sandbox Account, then run the app
from Xcode and tap "Remove Ads" in the menu. RevenueCat's dashboard
(Customers tab) will show the sandbox purchase come through.

### 3. Update App Privacy in App Store Connect

Once ads/IAP are live, go to **App Privacy** in App Store Connect and
re-answer the questionnaire — it can no longer be "Data Not Collected".
See the updated notes in `APP_STORE_LISTING.md` for what to declare.

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
   - Age rating: answer the content questionnaire (all "None") → still 4+.
   - App Privacy: **do not** select "Data Not Collected" anymore — see
     "Monetization setup" above and `APP_STORE_LISTING.md` for what to
     declare now that ads/IAP are in the app.
   - In-App Purchases: attach the "Remove Ads" IAP you created above.
   - Pricing: Free (with the optional Remove Ads purchase).
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
