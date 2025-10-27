# Skeleton Loader System

A comprehensive skeleton loading system with preset components and flexible customization options.

## Components

### Base Components

#### `Skeleton`

The base skeleton component with customizable variants and animations.

```tsx
import { Skeleton } from "@/components/ui/Utils/Skeleton";

<Skeleton variant="rectangular" width={200} height={100} animation="pulse" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="text" className="w-full" />
<Skeleton variant="rounded" height={36} className="w-24" />
```

**Props:**

- `variant`: `"text" | "circular" | "rectangular" | "rounded"` - Shape of skeleton
- `width`: `string | number` - Width in px or CSS unit
- `height`: `string | number` - Height in px or CSS unit
- `animation`: `"pulse" | "wave" | "none"` - Animation type
- `className`: Additional Tailwind classes

#### `SkeletonWrapper`

Smart wrapper that handles loading, empty, and loaded states.

```tsx
import { SkeletonWrapper } from "@/components/ui/Utils/SkeletonWrapper";
import { SkeletonList } from "@/components/ui/Utils/SkeletonPresets";

<SkeletonWrapper
  isLoading={isLoading}
  skeleton={<SkeletonList count={5} ItemComponent={SkeletonTaskItem} />}
  isEmpty={tasks.length === 0}
  fallback={<EmptyState message="No tasks yet" />}>
  <TaskList tasks={tasks} />
</SkeletonWrapper>;
```

### Preset Components

Ready-to-use skeleton components for common UI patterns:

#### Text & Basic Elements

```tsx
import {
  SkeletonText,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonInput,
} from "@/components/ui/Utils/Skeleton";

<SkeletonText lines={3} />
<SkeletonButton />
<SkeletonAvatar size={80} />
<SkeletonBadge />
<SkeletonInput />
```

#### Domain-Specific Skeletons

```tsx
import {
  SkeletonCalendarEvent,
  SkeletonTaskItem,
  SkeletonLabelCard,
  SkeletonShoppingItem,
  SkeletonPaymentCard,
  SkeletonProfileHeader,
} from "@/components/ui/Utils/SkeletonPresets";

<SkeletonCalendarEvent />
<SkeletonTaskItem />
<SkeletonLabelCard />
<SkeletonShoppingItem />
<SkeletonPaymentCard />
<SkeletonProfileHeader />
```

#### Layout Skeletons

```tsx
import {
  SkeletonList,
  SkeletonGrid,
  SkeletonTableRow,
  SkeletonForm,
} from "@/components/ui/Utils/SkeletonPresets";

// List of items
<SkeletonList count={5} ItemComponent={SkeletonTaskItem} />

// Grid layout
<SkeletonGrid count={6} ItemComponent={SkeletonLabelCard} columns={3} />

// Table rows
{Array.from({ length: 5 }).map((_, i) => (
  <SkeletonTableRow key={i} columns={4} />
))}

// Form fields
<SkeletonForm fields={4} />
```

## Animation Types

### Pulse (Default)

Gentle opacity animation - best for most use cases.

```tsx
<Skeleton animation="pulse" />
```

### Wave/Shimmer

Gradient shimmer effect - more premium feel.

```tsx
<Skeleton animation="wave" />
```

### None

Static skeleton without animation.

```tsx
<Skeleton animation="none" />
```

## Usage Examples

### In a View Component

```tsx
import { useEvents } from "@shared/hooks/events";
import { SkeletonWrapper } from "@/components/ui/Utils/SkeletonWrapper";
import { SkeletonList, SkeletonCalendarEvent } from "@/components/ui/Utils/SkeletonPresets";

export function CalendarView() {
  const { data, isLoading } = useEvents();

  return (
    <SkeletonWrapper
      isLoading={isLoading}
      skeleton={<SkeletonList count={10} ItemComponent={SkeletonCalendarEvent} />}
      isEmpty={!data?.items?.length}
      fallback={<EmptyState message="No events scheduled" />}>
      <EventList events={data.items} />
    </SkeletonWrapper>
  );
}
```

### Inline Loading State

```tsx
import { Skeleton, SkeletonText } from "@/components/ui/Utils/Skeleton";

function UserProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="circular" width={80} height={80} />
        <SkeletonText lines={3} />
      </div>
    );
  }

  return (
    <div>
      <img src={user.avatar} />
      <p>{user.bio}</p>
    </div>
  );
}
```

### Custom Skeleton

```tsx
function CustomProductSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton variant="rounded" height={200} className="w-full" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonBadge />
        <Skeleton variant="text" className="w-20 h-8" />
      </div>
    </div>
  );
}

// Use with wrapper
<SkeletonWrapper
  isLoading={isLoading}
  skeleton={<SkeletonGrid count={8} ItemComponent={CustomProductSkeleton} columns={4} />}>
  <ProductGrid products={products} />
</SkeletonWrapper>;
```

## Best Practices

1. **Match Content Shape**: Skeleton should roughly match the loaded content's layout
2. **Use Appropriate Count**: Show realistic number of skeleton items
3. **Consistent Animation**: Stick to one animation type per view (usually `pulse`)
4. **Combine with Empty States**: Use `SkeletonWrapper` to handle all loading scenarios
5. **Performance**: Limit skeleton complexity for large lists

## Available Preset Skeletons

| Component               | Use Case         | Features                         |
| ----------------------- | ---------------- | -------------------------------- |
| `SkeletonCalendarEvent` | Calendar events  | Badge, timestamp, description    |
| `SkeletonTaskItem`      | Task lists       | Checkbox, title, labels, actions |
| `SkeletonLabelCard`     | Label management | Color dot, title, description    |
| `SkeletonShoppingItem`  | Shopping lists   | Checkbox, name, quantity, price  |
| `SkeletonPaymentCard`   | Payment history  | Avatar, amount, status badge     |
| `SkeletonProfileHeader` | User profiles    | Large avatar, name, bio, badges  |
| `SkeletonList`          | Generic lists    | Customizable item component      |
| `SkeletonGrid`          | Grid layouts     | Responsive columns               |
| `SkeletonForm`          | Forms            | Input fields, buttons            |
| `SkeletonTableRow`      | Tables           | Configurable columns             |

## Creating Custom Skeletons

```tsx
import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonText } from "@/components/ui/Utils/Skeleton";

export function SkeletonCustomComponent() {
  return (
    <div className="border rounded-lg p-4 bg-bg-alt">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <SkeletonAvatar size={48} />
          <div className="space-y-2">
            <Skeleton variant="text" className="w-32 h-5" />
            <Skeleton variant="text" className="w-24 h-4" />
          </div>
        </div>
        <SkeletonBadge />
      </div>

      {/* Content */}
      <SkeletonText lines={4} className="mb-4" />

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex space-x-2">
          <SkeletonBadge />
          <SkeletonBadge />
        </div>
        <Skeleton variant="rounded" height={32} className="w-20" />
      </div>
    </div>
  );
}
```
