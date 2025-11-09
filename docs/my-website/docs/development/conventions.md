---
sidebar_position: 1
---

# Development Conventions

Coding standards and best practices for AI Planner.

## Import Order

```tsx
// 1. React/external libraries
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// 2. Shared imports
import { useTasks } from "@shared/hooks/tasks/useTasks";
import type { TaskInterface } from "@shared/data/Tasks/interfaces";

// 3. Local imports
import TaskItem from "@/components/ui/Tasks/TaskItem";
import { formatDate } from "@/lib/utils";
```

## TypeScript Patterns

- Use `interface` for component props
- Use `type` for unions/intersections
- Component props in `shared/data/*/Components/`
- Enable strict mode

## API Patterns

- Always use `credentials: "include"`
- Use `buildApiUrl()` for endpoints
- Handle errors with try/catch or React Query

## React Patterns

- Prefer function components
- Use hooks for state management
- Memoize expensive computations
- Use `PropsWithChildren` for wrappers

## Naming Conventions

- Components: PascalCase (`TaskItem.tsx`)
- Hooks: camelCase with `use` prefix (`useTasksTs`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)
- Files: kebab-case or PascalCase based on content
