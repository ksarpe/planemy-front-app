---
sidebar_position: 1
---

# Architecture Overview

AI Planner follows a **monorepo architecture** with shared business logic between web and mobile platforms.

## Core Principles

### 1. Business Logic in `shared/`

All platform-agnostic code lives in the `shared/` package:
- API functions
- React Query hooks
- Context providers
- Type definitions
- Data transformations

### 2. Platform-Specific Rendering

Web and mobile packages only handle:
- UI components and layouts
- Platform-specific APIs
- Navigation/routing
- Platform optimizations

### 3. Module Resolution

Both platforms use `@shared` alias to import from shared package.

## Tech Stack

- **React 19**: Latest React features
- **TanStack Query v5**: Server state management
- **TypeScript**: Type safety throughout
- **Vite**: Fast build tool for web
- **Expo**: Mobile development framework

## Next Steps

- [Monorepo Details](/architecture/monorepo)
- [Data Layer](/architecture/data-layer)
- [API Layer](/architecture/api-layer)
