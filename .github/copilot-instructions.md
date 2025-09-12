# AI Planner App - GitHub Copilot Instructions

## Project Overview

AI Planner App is a comprehensive personal productivity application built with React, TypeScript, and Firebase. It combines calendar management, task tracking, shopping lists, and payment reminders in a unified interface.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom CSS variables
- **Backend**: Firebase (Auth, Firestore) (But moving to go backend with postgresql)
- **State Management**: React Context + TanStack Query
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: MSW (Mock Service Worker) for API mocking

## Architecture Patterns

### Current Data Layer Structure

```
src/data/
├── Auth/         # Authentication interfaces
├── Calendar/     # Event and calendar types
├── Events/       # Hook-specific event interfaces
├── Layout/       # UI component interfaces
├── Payments/     # Payment-related types
├── Shopping/     # Shopping list interfaces
├── Tasks/        # Task management types
├── User/         # User profile types
└── Utils/        # Shared utilities
```

### Component Organization

- **Views**: Page-level components in `src/components/views/`
- **UI Components**: Reusable components in `src/components/ui/` (organized by domain)
- **Layout**: Layout components in `src/components/layout/`
- **Hooks**: Custom hooks in `src/hooks/` (organized by domain)
- **Context**: Global state in `src/context/`

### API Integration

- Use TanStack Query for all API calls
- Custom hooks pattern: `useEvents`, `useTasks`, `useShoppingLists`, etc.

## Styling Guidelines

### Design System

Use ONLY CSS variables from `src/index.css`:

### Tailwind Classes

- Backgrounds: `bg-bg`, `bg-bg-alt`, `dark:bg-bg-dark`, `dark:bg-bg-alt-dark`
- Text: `text-text`, `dark:text-text-dark`, `text-primary`
- Hover: `bg-bg-hover`, `dark:bg-bg-hover-dark`
- Always include dark mode variants for proper theme switching

### Responsive Design

- Mobile-first approach with conditional rendering for significant mobile/desktop differences
- Use `useTheme` hook for theme detection: `const { isDark, toggleTheme } = useTheme();`
- Standard breakpoints: `md:`, `lg:`, `xl:`

## Component Patterns

### Modal Components

```tsx
// Use conditional rendering for mobile vs desktop
{
  isMobile ? (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed inset-x-4 top-20 bottom-4 bg-bg dark:bg-bg-dark rounded-lg">
        {/* Mobile fullscreen content */}
      </div>
    </div>
  ) : (
    <div className="fixed z-50" style={positionStyles}>
      {/* Desktop positioned modal */}
    </div>
  );
}
```

### Event Components

- Events use `EventInterface` from `@/data/types`
- Current EventColor type: `"bg-red-500" | "bg-blue-400" | "bg-yellow-500" | "bg-green-500"`
- Always include time formatting with date-fns
- Event properties: `id`, `title`, `category`, `start`, `end`, `allDay`, `classNames`, `color`

### Form Patterns

```tsx
// Standard form structure with dark mode support
<div className="space-y-4">
  <input
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-bg dark:bg-bg-dark text-text dark:text-text-dark"
    // ... props
  />
</div>
```

## State Management Rules

### Context Usage

- Use contexts only for truly global state
- Avoid business logic in contexts, keep only necessary state and actions, no "add" "remove" etc.
- Example contexts: `PreferencesContext`, `CalendarContext`, `TaskContext`, `ShoppingContext`, `PaymentsContext`, `ToastContext`

### TanStack Query

- All API calls use TanStack Query hooks
- Custom hooks pattern: `src/hooks/api/useEvents.ts`, `src/hooks/api/useTasks.ts`
- Proper error handling and loading states
- Set appropriate `staleTime` for data freshness

### Local State

- Use `useState` for component-specific state
- Use `useCallback` for event handlers to prevent re-renders
- Use `useMemo` for expensive calculations

## Naming Conventions

### Files and Components

- PascalCase for components: `QuickEventCreator.tsx`, `MainLayout.tsx`
- camelCase for hooks: `useEvents.ts`, `useTheme.tsx`
- camelCase for utilities: `dateUtils.ts`
- Views end with `View`: `CalendarView.tsx`, `DashboardView.tsx`

### Props and Variables

- Descriptive names: `selectedDate`, `isLoading`, `onEventCreate`
- Boolean props start with `is`, `has`, `can`: `isOpen`, `hasEvents`, `isInitialized`
- Event handlers start with `handle`: `handleDayClick`, `handleSubmit`
- Context props often end with `Context`: `CalendarClickContent`

## Calendar-Specific Guidelines

### Event Positioning

- Use preview events for better UX during creation
- Position modals relative to event blocks, not cursor
- Implement smart positioning to avoid viewport overflow

### Date Handling

```tsx
import { format, startOfDay, endOfDay } from "date-fns";

// Always use date-fns for date operations
const formattedDate = format(date, "yyyy-MM-dd");
const dayStart = startOfDay(selectedDate);
```

### Event Colors

```tsx
// Current EventColor implementation uses Tailwind classes
export type EventColor = "bg-red-500" | "bg-blue-400" | "bg-yellow-500" | "bg-green-500";

// Map colors appropriately in components
const getEventColorClass = (color: EventColor | string) => {
  // Handle both EventColor enum and custom color strings
  return color;
};
```

## Performance Guidelines

### Re-render Prevention

- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive calculations
- Avoid creating objects in render: use CSS classes instead of inline styles

### Optimization Patterns

```tsx
// Good - stable reference
const handleClick = useCallback(
  (id: string) => {
    // handler logic
  },
  [dependency],
);

// Good - memoized calculation
const sortedEvents = useMemo(() => events.sort((a, b) => compareAsc(new Date(a.start), new Date(b.start))), [events]);
```

## Error Handling

### API Errors

- Use TanStack Query's error handling
- Display user-friendly error messages
- Implement proper loading states with skeletons/spinners

### Auth Errors

- Use Firebase error handling
- Polish error messages for better UX
- Handle auth state properly

## Data Types Reference

### Key Interfaces

```tsx
export interface EventInterface {
  id: number;
  title: string;
  category: EventCategory;
  start: string; // ISO date string
  end: string; // ISO date string
  allDay: boolean;
  classNames: string;
  color: string;
  colSpan?: number;
}

export interface TaskInterface {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  completed: boolean;
}

export interface PaymentInterface {
  id: number;
  name: string;
  amount: number;
  cycle: "monthly" | "yearly";
  nextPayment: string; // ISO date string
  isActive: boolean;
  isPaid: boolean;
}

export interface ShoppingListInterface {
  id: number;
  name: string;
  items: ShoppingItemInterface[];
  type: string;
}
```

## Testing Guidelines

- Test responsive behavior for mobile/desktop
- Focus on user interactions and API integrations

## Development Workflow

### Hook Creation

```tsx
export const useFeatureName = () => {
  return useQuery({
    queryKey: ["feature", ...deps],
    queryFn: async () => {
      const res = await fetch("/api/endpoint");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 5000, // Set appropriate staleness
  });
};
```

### Component Structure

```tsx
interface ComponentProps {
  // Props interface with descriptive names
}

export default function Component({ ...props }: ComponentProps) {
  // 1. Hooks (useState, useEffect, custom hooks)
  // 2. Event handlers (useCallback)
  // 3. Computed values (useMemo)
  // 4. Render logic

  return <div className="component-container bg-bg dark:bg-bg-dark">{/* Always include dark mode classes */}</div>;
}
```

## Code Quality Rules

- Always use TypeScript interfaces from `src/data/types.ts`
- Prefer function components over class components
- Use proper semantic HTML elements
- Include proper accessibility attributes where needed
- Keep components focused and single-responsibility
- Always handle loading and error states in API calls
- Use the scrollbar-hide CSS class for custom scrollbars

## When Adding New Features

1. Add interfaces to `src/data/types.ts`
2. Create API functions with proper error handling
3. Create custom hooks using TanStack Query in `src/hooks/api/`
4. Build UI components following design system in `src/components/ui/`
5. Add proper TypeScript types throughout
6. Test mobile and desktop experiences
7. Ensure dark mode compatibility
8. Add MSW handlers for development if needed

## File Path Aliases

- Use `@/` for imports from `src/` directory
- Examples: `@/data/types`, `@shared/hooks/utils/useTheme`, `@/components/ui/Calendar`

## Important Notes

- Remove StrictMode for production to avoid double logging
- MSW is configured for development environment only
- Project uses React Router for navigation with nested routes under MainLayout
- All contexts are properly typed and use error boundaries
- Theme switching is handled globally via PreferencesContext
