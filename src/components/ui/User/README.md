# User Profile Components

This directory contains modular components for the user profile management interface.

## Components

### ProfileHeader

Header section displaying user avatar, name, email, and bio with edit functionality.

**Props:**

- `userInfo`: Object containing user's basic information (firstName, lastName, email, bio)

### PersonalInformationSection

Form section for editing personal user information.

**Props:**

- `userInfo`: User information object
- `handleUserInfoChange`: Function to handle form field changes

### AppearanceThemeSection

Settings for appearance preferences including dark mode and color themes.

**Props:**

- `isDark`: Boolean indicating current theme state
- `toggleTheme`: Function to toggle dark/light theme
- `selectedTheme`: Index of currently selected color theme
- `setSelectedTheme`: Function to change color theme
- `colorThemes`: Array of available color theme options

### NotificationSettingsSection

Settings for managing different types of notifications.

**Props:**

- `notifications`: Object containing current notification preferences
- `handleNotificationChange`: Function to handle notification setting changes

### LanguageRegionSection

Settings for language and timezone preferences.

**Props:**

- `language`: Current language setting
- `setLanguage`: Function to change language
- `timezone`: Current timezone setting
- `setTimezone`: Function to change timezone

### SecuritySection

Security-related actions like password change, 2FA setup, and account deletion.

**Props:** None (currently uses placeholder actions)

## Usage

```tsx
import {
  ProfileHeader,
  PersonalInformationSection,
  AppearanceThemeSection,
  NotificationSettingsSection,
  LanguageRegionSection,
  SecuritySection,
} from "@/components/ui/User";
```

All components follow the same design system and styling patterns used throughout the application.
