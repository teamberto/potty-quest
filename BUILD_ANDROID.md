# Potty Champ — Google Play Build Guide

Everything below runs on your Mac (Android Studio runs fine on Mac). The
Android platform hasn't been added to this project yet — this guide starts
from zero, unlike BUILD_IOS.md which picks up an existing `ios/` folder.

## Before you start

- This project already has AdMob ads and a "Remove Ads" purchase
  (RevenueCat) wired up for iOS. Both need Android-specific setup too —
  they don't carry over automatically. See the AdMob/RevenueCat sections
  below.
- Since this is a kids' app (potty-training theme), Google Play requires
  going through their **Designed for Families** program, which is stricter
  and slower than the App Store's simple age-rating questionnaire. Budget
  extra review time for this — see the Families section near the end.

## One-time setup (~30–45 min)

1. **Install Android Studio**: https://developer.android.com/studio
   (includes the Android SDK, a bundled JDK, and Gradle — you don't need
   to install Java separately).
2. **Create a Google Play Console developer account**:
   https://play.google.com/console/signup — $25 one-time fee, and Google
   now requires a short identity verification step that can take a day or
   two, so do this early.

## Add the Android platform (~10 min)

From Terminal, in this project folder:

```
npm install @capacitor/android
npx cap add android
npx @capacitor/assets generate --android
npm run build:www
npx cap sync android
npx cap open android
```

What each does: installs the Android runtime → generates the native
`android/` project (parallel to `ios/`) → generates all launcher icons and
splash screens from `resources/` → builds the web bundle → copies it into
the Android project and installs Gradle dependencies → opens Android
Studio.

First time Android Studio opens this project it will download some
Gradle/SDK components — let that finish before doing anything else.

## Configure AdMob for Android

The iOS AdMob App ID does **not** work on Android — you need a second,
Android-specific App ID from the same AdMob account.

1. https://apps.admob.com → **Apps** → **Add app** → choose **Android** →
   link it to this app once it exists in Play Console (or add it as
   unlinked initially, link later).
2. Copy the Android **App ID** (format `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`).
3. Add it to `android/app/src/main/AndroidManifest.xml` inside the
   `<application>` tag:
   ```xml
   <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
   ```
4. Keep the same child-directed / non-personalized ad settings used on iOS
   (`tagForChildDirectedTreatment`, `tagForUnderAgeOfConsent`,
   `maxAdContentRating: 'G'`, `npa: true`) — the AdMob JS init call in
   `game.js` should already apply to both platforms since it's the same
   Capacitor plugin call, but double check the ad unit IDs are the
   Android-specific ones (ad units are per-platform too, not just the App ID).

## Configure RevenueCat for Android

1. RevenueCat dashboard → your project → **Add app** → **Google Play**.
2. Play Console → **Setup → API access** → create/link a Google Cloud
   service account with access to your app, and paste its credentials
   into RevenueCat (this lets RevenueCat verify purchases server-side).
3. Play Console → your app → **Monetize → Products → In-app products** →
   create a product matching the same ID used on iOS (e.g. `remove_ads`).
4. In RevenueCat, attach this Android product to the existing
   `remove_ads` **Entitlement** (same entitlement id as iOS — don't create
   a second one, or the app will think Android purchases don't unlock
   anything).
5. Keep the parental-gate math question in front of the purchase button —
   same reasoning as iOS.

## Signing

Unlike iOS (where Xcode/App Store Connect manage signing certificates for
you), Android needs a keystore file that you generate once and **must
never lose** — losing it means you can never update the app again under
the same listing.

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Choose **Android App Bundle** (`.aab`, not `.apk` — Play Store requires
   AAB for new apps)
3. Click **Create new...** under Key store path — save it somewhere
   **outside** the git repo (e.g. `~/keys/potty-champ-upload.jks`), set a
   strong password, and back both the file and password up somewhere
   safe (password manager). Do **not** commit this file to git.
4. Fill in the certificate details (name, organization — can be anything)
5. Finish the wizard — this produces a signed `.aab` file
6. Enroll in **Play App Signing** when Play Console prompts you on first
   upload — Google then manages the actual signing key that reaches
   users, and your upload keystore just proves uploads come from you.

## Google Play Console listing

1. Play Console → **Create app** → fill in name (`Potty Champ`), default
   language, app/game type, free or paid.
2. **Store listing**: short description, full description (see
   `APP_STORE_LISTING.md` for iOS copy — adapt as needed), screenshots
   (phone required, 7" and 10" tablet recommended given this plays on
   iPad too), feature graphic (1024×500, required — you don't have this
   for iOS since Apple doesn't require it).
3. **Content rating questionnaire**: answer honestly — should land at
   "Everyone" or similar given no violence/mature content.
4. **Data safety** section: matches the iOS "App Privacy" answers — no
   data collected/shared beyond what AdMob/RevenueCat require, disclose
   ad ID usage if `npa: true` doesn't fully suppress it.
5. **Privacy Policy URL**: reuse the same one from iOS
   (`https://teamberto.github.io/potty-quest/privacy.html` or wherever
   you hosted `privacy.html`).
6. **App content → Target audience and content**: mark that the app is
   directed at children — this triggers the Families program requirements
   below.

## Designed for Families requirements (kids' apps specifically)

This is the part with no iOS equivalent — plan for extra review time here.

- Ads must come only from **Families Ads Program certified** networks.
  AdMob itself is fine when configured for child-directed treatment (which
  you're already doing), but double check any mediation networks if you
  add them later.
- No external links (privacy policy excepted) that leave the app without
  a parental gate.
- In-app purchases (your "Remove Ads" button) must sit behind a parental
  gate — you already have the math-question gate from iOS, reuse it here.
- Target API level and permissions get extra scrutiny — request nothing
  beyond internet access.
- Review for family-flagged apps commonly takes longer than standard
  review (sometimes 1-2 weeks vs a few days) — don't expect App
  Store-speed turnaround.

## Upload and release

1. Play Console → your app → **Testing → Internal testing** (recommended
   first stop — instant, no review) → **Create release** → upload the
   `.aab` → add release notes → save and roll out.
2. Install it via the internal testing link on a real Android device or
   emulator and play through it once before going wider.
3. Once happy: **Production** track → **Create release** → upload the
   same (or a new) `.aab` → submit. This is the one that goes through full
   review, including the Families program checks above.

## Updating the app later

```
npm run build:www
npx cap sync android
npx cap open android
```
Bump `versionCode` (integer, always increasing) and `versionName` in
`android/app/build.gradle` before generating a new signed bundle.
