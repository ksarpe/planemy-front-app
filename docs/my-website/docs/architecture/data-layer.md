---
sidebar_position: 3
---

# Data Layer

TypeScript interfaces and types organization.

## Structure

Each domain has:
- `interfaces.ts`: Data structures
- `types.ts`: Enums, unions, type aliases
- `Components/`: Component prop types

Example for Tasks:
```
shared/data/Tasks/
├── index.ts
├── interfaces.ts
├── types.ts
└── Components/
    └── TaskItemProps.ts
```

## Type Conventions

- Use `interface` for object shapes
- Use `type` for unions/intersections
- Export all types from `index.ts`

## Example

```typescript
// interfaces.ts
export interface TaskInterface {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}

// types.ts
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
```
