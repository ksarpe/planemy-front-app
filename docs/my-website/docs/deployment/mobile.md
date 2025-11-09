---
sidebar_position: 3
---

# Mobile Deployment

Deploy React Native app to App Store and Google Play.

## iOS Deployment

### Prerequisites

- Apple Developer Account ($99/year)
- Xcode on macOS
- iOS device or simulator

### Build for iOS

```bash
cd mobile
eas build --platform ios
```

### Submit to App Store

```bash
eas submit --platform ios
```

## Android Deployment

### Prerequisites

- Google Play Developer Account ($25 one-time)
- Android Studio

### Build for Android

```bash
cd mobile
eas build --platform android
```

### Submit to Google Play

```bash
eas submit --platform android
```

## Expo Application Services (EAS)

Install EAS CLI:

```bash
npm install -g eas-cli
eas login
```

Configure `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

## Over-the-Air (OTA) Updates

Update app without app store:

```bash
eas update --branch production
```

## App Store Optimization

- Prepare app screenshots
- Write compelling description
- Add keywords for SEO
- Set pricing and availability
