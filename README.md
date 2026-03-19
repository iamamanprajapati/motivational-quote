# Daily Motivation

Offline **React Native CLI** app ( **React Native 0.81.0**, **not Expo**).  
1000 bundled quotes, 100 bundled background images, daily quote logic, favorites, categories, search, streaks, themes, shareable cards (`react-native-view-shot` + `react-native-share`), gallery save (`@react-native-camera-roll/camera-roll`), and optional local reminders (`@notifee/react-native`).

## Prerequisites

- Node ≥ 18  
- Xcode + CocoaPods (iOS)  
- Android Studio + SDK (Android)  
- Watchman (recommended)

Follow the official [environment setup](https://reactnative.dev/docs/set-up-your-environment).

## Install

```bash
cd /path/to/motivation-quote
npm install
```

### Regenerate quotes & images (optional)

The repo already includes `assets/quotes.json` (1000 quotes) and `assets/images` (100 PNGs). To rebuild:

```bash
npm run generate-assets
```

This runs `scripts/generate-quotes.js` and `scripts/generate-images.js`, and regenerates `src/assets/imageMap.js`.

### Sample quotes (20 entries)

See **`assets/quotes.sample.json`** — same structure as `quotes.json`, first 20 handcrafted quotes.

---

## iOS

```bash
cd ios
bundle install   # first time, if you use Bundler
bundle exec pod install   # or: npx pod-install
cd ..
npm run ios
```

**Info.plist** already includes photo-library usage strings and `LSApplicationQueriesSchemes` for WhatsApp, Instagram, Facebook, X, Telegram.

---

## Android

**AsyncStorage 3.x** ships a small Maven repo under `node_modules`. The project adds it in **`android/build.gradle`**:

```gradle
allprojects {
    repositories {
        maven {
            url = uri("${rootDir}/../node_modules/@react-native-async-storage/async-storage/android/local_repo")
        }
    }
}
```

**`MainApplication.kt`** implements `cl.json.ShareApplication` so `react-native-share` can resolve `content://` URIs for images.

```bash
npm run android
```

Permissions in **`AndroidManifest.xml`**: `POST_NOTIFICATIONS`, storage / media as needed for older APIs.

---

## React Native Reanimated 4

This template uses **`react-native-reanimated` 4.x**, which requires **`react-native-worklets`** (already in `package.json`).  
Babel: `react-native-reanimated/plugin` is last in `babel.config.js`.

---

## Project layout

```
/assets
  /images          # motivation-001.png … motivation-100.png
  quotes.json      # 1000 quotes
  quotes.sample.json
/src
  /assets          # imageMap.js (generated)
  /components
  /constants
  /context
  /hooks
  /navigation
  /screens
  /theme
  /utils
/scripts
  generate-quotes.js
  generate-images.js
App.js
```

## Features (checklist)

| Feature | Implementation |
|--------|----------------|
| Offline | All data in `assets/` |
| Daily quote | `dayOfYear % quotes.length`, persisted per calendar day (`KEYS.DAILY_SLOT`) |
| Same quote all day | AsyncStorage slot `{ ymd, quoteIndex }` |
| Image mapping | `quoteListIndex % 100` via `imageForIndex` |
| Share card capture | `ViewShot` + `captureRef` |
| Share | `react-native-share` (`Share.open` + `shareSingle` per app) |
| Save to gallery | `CameraRoll.saveAsset` |
| Favorites | AsyncStorage JSON array of quote ids |
| Categories & filter | `CategoriesScreen` → `QuoteList` |
| Search | Search field on Discover tab |
| Streak | Daily open tracking |
| Dark / light | Theme toggle + persistence |
| Reminder | Notifee daily trigger ~9:00 |
| Onboarding | 3 slides |
| Extras | Shuffle, copy, widget mock UI, progress % |

## Scripts

| Command | Description |
|--------|-------------|
| `npm start` | Metro |
| `npm run android` / `npm run ios` | Run app |
| `npm test` | Jest |
| `npm run generate-assets` | Rebuild quotes + images + `imageMap.js` |

## Tech stack (dependencies)

- `@react-navigation/native`, native stack, bottom tabs  
- `@react-native-async-storage/async-storage`  
- `react-native-share`, `react-native-view-shot`  
- `react-native-fs` (available if you extend file workflows)  
- `react-native-linear-gradient`  
- `react-native-reanimated`, `react-native-worklets`  
- `@react-native-camera-roll/camera-roll`, `@react-native-clipboard/clipboard`  
- `@notifee/react-native`  

---

## Troubleshooting

- **Android: `storage-android:1.0.0` not found** — ensure the `allprojects` `maven { local_repo }` block is present in `android/build.gradle`.  
- **iOS build** — run `pod install` after adding native modules.  
- **Reanimated** — clear Metro cache: `npx react-native start --reset-cache`.  

## License

Quotes/images you add are your responsibility; app scaffold is for your use.
