---
sidebar_position: 5
---

# Labels

Categorization system for tasks, events, and shopping items.

## Features

- 🏷️ Create custom labels
- 🎨 Color coding
- 🔗 Attach to any entity
- 📊 Filter by label

## API Hooks

```typescript
// Get all labels
const { data: labels } = useLabels();

// Create label
const { mutate: createLabel } = useCreateLabel();
createLabel({ name, color });

// Get label connections
const { data: connections } = useLabelConnections(objectId, objectType);

// Attach label
const { mutate: attachLabel } = useCreateLabelConnection();
attachLabel({ entity_id, entity_type, label_id });
```

## Label Context

Global label state:

```typescript
const { 
  labels, 
  getLabelForObject 
} = useLabelContext();
```

## Usage

Labels can be attached to:
- Tasks
- Events
- Shopping items
- Custom entities
