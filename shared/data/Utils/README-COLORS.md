# Centralized Color System

## Overview

Unified color system for labels, events, badges, and other UI components across the application.

## Usage

### 2. In Event Calendar (event-calendar.tsx)

```tsx
import { getColorClasses } from "@shared/data/Utils/colors";
import type { ColorName } from "@shared/data/Utils/colors";

const event: CalendarEvent = {
  color: "amber" as ColorName,
  // ...
};

const className = getColorClasses(event.color);
```

### 3. Label Badges

```tsx
import { LabelBadge } from "@/components/ui/Common/LabelBadge";

<LabelBadge name="Important" color="rose" onRemove={() => handleRemove()} />;
```

### 4. Programmatic Access

```tsx
import { COLORS, getColorConfig, COLOR_NAMES } from "@shared/data/Utils/colors";

// Get all available colors
const allColors = COLOR_NAMES; // ["sky", "amber", "violet", ...]

// Get specific color configuration
const config = getColorConfig("emerald");
console.log(config.label); // "Emerald"
console.log(config.bg); // "bg-green-100"
```

## Available Colors

- **sky** - Sky Blue (primary color)
- **amber** - Amber/Yellow
- **violet** - Violet/Purple
- **rose** - Rose/Pink
- **emerald** - Emerald/Green
- **orange** - Orange

## Adding New Colors

1. Add to `ColorName` type in `shared/data/Utils/colors.ts`
2. Add configuration to `COLORS` object
3. Colors automatically appear in `ColorPicker` component

## Theme Support

All colors work with both light and dark modes automatically (no `dark:` prefix needed).
