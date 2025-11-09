---
sidebar_position: 5
---

# State Management

How AI Planner manages application state.

## Server State (React Query)

For API data:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

## Client State (React Context)

For cross-component state:
- Authentication (AuthContext)
- User preferences (PreferencesContext)
- UI state (modals, drawers)

## Local State (useState)

For component-specific state:
- Form inputs
- Temporary UI state
- Component toggles

## No Redux/Zustand

We keep it simple with React Query + Context!

## Example

```typescript
// Server state
const { data: tasks } = useTasks(listId);

// Client state
const { user } = useAuthContext();

// Local state
const [isOpen, setIsOpen] = useState(false);
```
