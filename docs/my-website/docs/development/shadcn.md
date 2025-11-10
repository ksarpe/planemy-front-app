## src/lib/shadcn/utils.ts

The `cn` function combines the power of [`clsx`](https://github.com/lukeed/clsx) (for conditional className logic) and [`tailwind-merge`](https://github.com/dcastil/tailwind-merge) (for resolving conflicting TailwindCSS classes). This ensures your `className` props are concise, readable, and always produce the correct Tailwind styles—especially when classes are conditionally applied or dynamically generated.

**Usage example:**
```tsx
import { cn } from "@/lib/shadcn/utils";

<button className={cn("bg-primary", isActive && "opacity-80", customClass)} />
```

- Use this utility in all components to avoid className bugs and keep your codebase consistent.
- It is already used throughout the AI Planner codebase for both web and mobile UI components.