# AiPlanner Mobile & Web - Monorepo Setup

## 📋 Struktura Projektu

```
aiplanner-app/
├── package.json          # Root workspace configuration
├── shared/               # Shared code between web and mobile
│   ├── api/             # API functions (Firebase, etc.)
│   ├── data/            # TypeScript interfaces and types
│   └── index.ts         # Exports for shared modules
├── web/                 # React web application
│   ├── src/            # Web-specific components
│   ├── package.json    # Web dependencies
│   └── vite.config.ts  # Vite configuration with aliases
└── mobile/             # React Native Expo application
    ├── src/            # Mobile-specific components
    ├── app.json        # Expo configuration
    ├── package.json    # Mobile dependencies
    └── babel.config.js # Babel with module resolver
```

## 🚀 Dostępne Komendy

### Główne komendy (z root folder)

```bash
# Uruchomienie aplikacji webowej
npm run dev:web

# Uruchomienie aplikacji mobilnej
npm run dev:mobile

# Uruchomienie na Android
npm run android

# Uruchomienie na iOS (tylko macOS)
npm run ios

# Build aplikacji webowej
npm run build:web

# Lint sprawdzenie
npm run lint
```

### Lokalne komendy

```bash
# W folderze web/
npm run dev
npm run build
npm run preview

# W folderze mobile/
npm run start
npm run android
npm run ios
npm run web
```

## 📦 Shared Modules

### API Functions

Wszystkie funkcje API są dostępne w folderze `shared/api/`:

- `auth.ts` - Uwierzytelnianie
- `tasks.ts` - Zarządzanie zadaniami
- `shopping.ts` - Lista zakupów
- `events.ts` - Wydarzenia kalendarzowe
- `payments.ts` - Płatności
- `config.ts` - Konfiguracja Firebase

### Interfejsy TypeScript

Interfejsy i typy w folderze `shared/data/`:

- `Auth/` - Typy związane z uwierzytelnianiem
- `Tasks/` - Interfejsy zadań
- `Shopping/` - Typy list zakupów
- `User/` - Profile użytkowników
- `Common/` - Wspólne interfejsy UI

## 🔧 Importowanie Shared Modules

### W aplikacji webowej

```typescript
import { signIn, UserProfile } from "@shared";
// lub bezpośrednio
import { signIn } from "@shared/api/auth";
import { UserProfile } from "@shared/data/User";
```

### W aplikacji mobilnej

```typescript
import { signIn, UserProfile } from "@shared";
// lub bezpośrednio
import { signIn } from "@shared/api/auth";
import { UserProfile } from "@shared/data/User";
```

## 📱 Desenvolvimento Mobile

### Wymagania

- Node.js 18+
- Expo CLI
- Android Studio (dla Android development)
- Xcode (dla iOS development, tylko macOS)

### Pierwsze uruchomienie

```bash
# Instalacja zależności
npm install

# Uruchomienie na Android
npm run android

# Uruchomienie na iOS (macOS)
npm run ios

# Uruchomienie w przeglądarce
npm run dev:mobile
```

## 🌐 Desenvolvimento Web

### Wymagania

- Node.js 18+
- Nowoczesna przeglądarka

### Pierwsze uruchomienie

```bash
# Instalacja zależności
npm install

# Uruchomienie dev server
npm run dev:web

# Build do produkcji
npm run build:web
```

## 🔄 Workflow

1. **Shared Code**: Wszystkie zmiany w API i interfejsach wprowadzaj w folderze `shared/`
2. **Web Components**: Komponenty specyficzne dla web w `web/src/components/`
3. **Mobile Components**: Komponenty React Native w `mobile/src/components/`
4. **Testing**: Testuj na obu platformach przed commit
5. **Deployment**: Web deploy poprzez Vercel, mobile przez Expo/EAS

## 🛠️ Konfiguracja

### TypeScript Aliases

Zarówno web jak i mobile mają skonfigurowane aliasy:

- `@shared/*` - wskazuje na shared modules
- `@/*` - wskazuje na lokalne src folder

### Babel (Mobile)

Konfiguracja w `mobile/babel.config.js` obsługuje module resolution.

### Vite (Web)

Konfiguracja w `web/vite.config.ts` obsługuje aliasy i shared modules.

## 📝 Przykłady Użycia

### Komponenty wykorzystujące shared API

```typescript
// mobile/src/screens/TasksScreen.tsx
import React from "react";
import { View } from "react-native";
import { getTasks, Task } from "@shared";

export default function TasksScreen() {
  // Używaj shared API functions i types
}
```

```typescript
// web/src/components/TasksList.tsx
import React from "react";
import { getTasks, Task } from "@shared";

export function TasksList() {
  // Te same API functions i types co w mobile
}
```

## 🐛 Troubleshooting

### Metro Bundle Issues

```bash
cd mobile && npx expo start --clear
```

### TypeScript Path Issues

Sprawdź czy aliasy są poprawnie skonfigurowane w `tsconfig.json` obu projektów.

### Build Issues

Upewnij się że wszystkie dependencies są zainstalowane:

```bash
npm install # w root
cd web && npm install
cd ../mobile && npm install
```
