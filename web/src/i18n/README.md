# Internationalization (i18n) Structure

This directory contains the internationalization setup for the AI Planner App.

## Structure

```
src/i18n/
├── index.ts          # Main i18n configuration
└── locales/          # Translation files
    ├── en.json       # English translations
    └── pl.json       # Polish translations (default)
```

## Usage

Import and use the `useT` hook in any component:

```tsx
import { useT } from "@shared/hooks/useT";

function MyComponent() {
  const { t } = useT();

  return (
    <div>
      <h1>{t("common.save")}</h1>
      <p>{t("profile.loadingProfile")}</p>
      <span>{t("notifications.email.title")}</span>
    </div>
  );
}
```

## Translation Key Structure

The translation keys are organized hierarchically:

- `common.*` - Common UI elements (save, cancel, delete, etc.)
- `profile.*` - Profile-related messages
- `personalInformation.*` - User information section
- `notifications.*` - Notification settings
- `security.*` - Security section
- `appearance.*` - Theme and appearance settings
- `languageAndRegion.*` - Language and timezone settings
- `dashboard.*` - Dashboard-specific texts
- `payments.*` - Payment-related messages
- `labels.*` - Label/tag management
- `feedback.*` - Feedback section

## Adding New Translations

1. Add the key-value pair to both `en.json` and `pl.json`
2. Use the nested structure for better organization
3. Update the component to use the new translation key

Example:

```json
// In en.json and pl.json
{
  "newSection": {
    "title": "New Section Title",
    "description": "Section description"
  }
}
```

```tsx
// In component
{
  t("newSection.title");
}
{
  t("newSection.description");
}
```

## Supported Languages

- **Polish (pl)** - Default language
- **English (en)** - Secondary language

The app automatically detects the user's preference and falls back to Polish if needed.
