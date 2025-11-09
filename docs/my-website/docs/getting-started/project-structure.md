---
sidebar_position: 2
---

# Project Structure

Understanding the AI Planner codebase organization.

## Monorepo Layout

```
aiplanner-app/
├── web/                    # Web application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── config/         # Configuration files
│   │   ├── hooks/          # Web-specific hooks
│   │   ├── styles/         # CSS files
│   │   └── main.tsx        # Entry point
│   ├── .env.development    # Dev environment variables
│   ├── .env.production     # Prod environment variables
│   └── vite.config.ts      # Vite configuration
│
├── mobile/                 # Mobile application
│   ├── src/
│   │   ├── screens/        # Mobile screens
│   │   ├── navigation/     # Navigation setup
│   │   └── config/         # Mobile config
│   ├── App.tsx             # Entry point
│   └── app.json            # Expo configuration
│
├── shared/                 # Shared business logic
│   ├── api/                # API functions
│   ├── hooks/              # React Query hooks
│   ├── context/            # Context providers
│   ├── data/               # Type definitions
│   ├── i18n/               # Internationalization
│   └── lib/                # Utilities
│
└── package.json            # Root workspace config
```

## Key Directories

### `shared/api/`
Pure fetch functions for backend API calls. Each file represents a domain (e.g., `tasks.ts`, `auth.ts`).

### `shared/hooks/`
React Query wrappers around API functions. Provides caching, loading states, and mutations.

### `shared/context/`
Global state providers (AuthContext, PreferencesContext, etc.)

### `shared/data/`
TypeScript interfaces and types organized by domain.

### `web/src/components/`
React components specific to the web application.

## Module Resolution

Both platforms use path aliases:

```typescript
import { useTasks } from "@shared/hooks/tasks/useTasks";
import type { TaskInterface } from "@shared/data/Tasks/interfaces";
```

## Next Steps

- [First Changes](/getting-started/first-changes) - Start modifying the code
- [Architecture Overview](/architecture/overview) - Deep dive into the architecture
