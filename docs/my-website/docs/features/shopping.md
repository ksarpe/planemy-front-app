---
sidebar_position: 3
---

# Shopping

Smart shopping list management.

## Features

- 🛒 Create shopping lists
- ✅ Check off purchased items
- 🏷️ Categorize with labels
- 📱 Share lists (future feature)

## API Hooks

```typescript
// Get shopping lists
const { data: lists } = useShoppingLists();

// Create item
const { mutate: addItem } = useCreateShoppingItem();
addItem({ name, quantity, category });

// Toggle purchased
const { mutate: toggleItem } = useToggleShoppingItem();
toggleItem(itemId);
```

## Shopping Context

Global shopping state:

```typescript
const { 
  currentList, 
  setCurrentList 
} = useShoppingContext();
```
