# AI Planner Codebase Guide

## Architecture Overview

This is a **monorepo workspace** with three platform targets sharing common business logic:

- `web/` - Vite + React 19 + TailwindCSS 4 web app
- `mobile/` - Expo/React Native mobile app
- `shared/` - Platform-agnostic business logic (APIs, hooks, contexts, data types)

**Key principle**: All business logic lives in `shared/`. Platform-specific code only handles rendering and platform APIs.

## Critical Workflows

### Development Commands (from root)

```bash
npm run dev:web      # Start web dev server (Vite on :5173)
npm run dev:mobile   # Start Expo dev server
npm run android      # Run Android emulator
npm run ios          # Run iOS simulator
npm run build:web    # Production build
```

### Module Resolution

Both platforms use path aliases to import from `shared/`:

- **Web**: Vite alias `@shared` → `../shared` (see `web/vite.config.ts`)
- **Mobile**: Babel module-resolver `@shared` → `../shared` (see `mobile/babel.config.js`)
- Local imports use `@/` prefix (e.g., `@/components`)

## Shared Package Structure

### Data Layer (`shared/data/`)

- Each domain has `interfaces.ts` (types) and `types.ts` (enums/unions)
- Export pattern: `index.ts` re-exports all interfaces/types
- Component interfaces in nested `Components/` folders
- Example: `@shared/data/Tasks/interfaces` for TaskInterface

### API Layer (`shared/api/`)

- Pure fetch functions, one file per domain (e.g., `auth.ts`, `tasks.ts`)
- **Always** use `credentials: "include"` for cookie-based session management
- Backend URL: `http://localhost:8080/api/v1/*` (hardcoded, no env vars yet)
- Error handling via custom `APIError` class

### Hooks Layer (`shared/hooks/`)

- React Query wrappers around API functions
- Pattern: `useTasks()` for queries, `useCreateTask()` for mutations
- Mutations auto-invalidate queries via `queryClient.invalidateQueries()`
- Context hooks in `hooks/context/` (e.g., `useTaskViewContext()`)

### Context Layer (`shared/context/`)

- Global state providers: `AuthContext`, `PreferencesContext`, `ShoppingContext`, `PaymentsContext`, `TaskViewContext`
- All wrapped in `AllProviders.tsx` component
- Consumed via custom hooks in `shared/hooks/context/`

### i18n (`shared/i18n/`)

- i18next with 3 locales: `en`, `pl` (primary), `de`
- Initialized in `shared/i18n/index.ts`, imported in `web/src/main.tsx`
- Use `useT()` hook from `@shared/hooks/utils/useT` (wraps react-i18next)

### Storage Abstraction (`shared/lib/`)

- Unified async storage API with platform-specific implementations:
  - `storage.web.ts` → wraps localStorage
  - `storage.native.ts` → wraps AsyncStorage
- Import as `persistentStorage` to work cross-platform

## Web-Specific Patterns

### Routing

- React Router 7 with route protection via `<ProtectedRoute>`
- Lazy-loaded views except `MainLayout` (used everywhere)
- Routes defined in `web/src/main.tsx`

### UI Components

- Radix UI + TailwindCSS 4 for primitives
- Custom components in `web/src/components/ui/` organized by domain
- Import shared types: `import type { TaskItemProps } from "@shared/data/Tasks/interfaces"`

- colors fetched from colors.css file.
- in className for background use bg-[value from colors.css] for example bg-primary, or bg-bg. DON'T use It is handled automatically based on system preference.

### State Management

- React Query for server state (queries/mutations)
- Context for cross-component state (auth, preferences)
- No Redux/Zustand - keep it simple

## Mobile-Specific Patterns

### Navigation

- React Navigation bottom tabs (see `mobile/src/navigation/SimpleTabNavigator.tsx`)
- Screens in `mobile/src/screens/`

### Firebase

- Firebase config in `mobile/src/config/firebase.ts`
- Web uses same Firebase SDK (v12.0.0) via `shared/` imports

## Development Conventions

### TypeScript

- Strict mode enabled in all packages
- Use `interface` for component props, `type` for unions/intersections
- Component prop types should be defined in `shared/data/*/Components/` for reusability

### React Patterns

- React 19 throughout (new JSX transform, no need for `import React`)
- Prefer function components with hooks
- Use `PropsWithChildren` for wrapper components

### Import Order Convention

```tsx
// 1. React/external libraries
import { useState } from "react";
// 2. Shared imports
import { useTasks } from "@shared/hooks/tasks/useTasks";
import type { TaskInterface } from "@shared/data/Tasks/interfaces";
// 3. Local imports
import TaskItem from "@/components/ui/Tasks/TaskItem";
```

### Mutation Pattern

```tsx
const { mutate: updateTask } = useUpdateTask();
// ... in handler:
updateTask({ id: task.id, data: { title: newTitle } });
```

## Integration Points

- **Backend**: Go-based API (see `aiplanner-documentation/Backend/README.md`)
- **Auth**: Cookie-based sessions, all API calls include credentials
- **Query Invalidation**: Mutations auto-invalidate related queries for cache consistency
- **i18n**: Centralized translations, fallback to Polish

## Things to Avoid

- Don't create API functions without `credentials: "include"`
- Don't bypass `shared/` for business logic - keep it reusable
- Don't hardcode strings - use i18n keys (see `shared/i18n/locales/*.json`)
- Don't access localStorage/AsyncStorage directly - use `persistentStorage` abstraction
- Don't create separate data types for web/mobile - put them in `shared/data/`

## Key Files Reference

- `shared/context/AllProviders.tsx` - Provider composition pattern
- `shared/hooks/tasks/useTasks.ts` - React Query hook pattern example
- `shared/api/auth.ts` - API fetch pattern with error handling
- `web/src/main.tsx` - Web app entry point and routing
- `mobile/App.tsx` - Mobile app entry point
- `shared/i18n/index.ts` - i18n configuration
