---
sidebar_position: 2
---

# Styling Guide

TailwindCSS 4 styling conventions.

## Color System

Colors are defined in `colors.css`:

```css
@theme {
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --color-text: #0f172a;
}
```

## Usage

```tsx
<div className="bg-bg text-text">
  <h1 className="text-primary">Title</h1>
</div>
```

## Dark Mode

Automatically handled based on system preference:

```tsx
<div className="bg-bg dark:bg-bg-dark">
  Content
</div>
```

## Common Patterns

```tsx
// Card
<div className="bg-bg rounded-lg border border-border p-4">

// Button
<button className="bg-primary text-white px-4 py-2 rounded-lg">

// Input
<input className="border border-border rounded-lg px-3 py-2" />
```

## Responsive Design

Mobile-first approach:

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

## Utility Classes

- Spacing: `p-4`, `m-2`, `gap-3`
- Flexbox: `flex`, `items-center`, `justify-between`
- Grid: `grid`, `grid-cols-2`, `gap-4`
