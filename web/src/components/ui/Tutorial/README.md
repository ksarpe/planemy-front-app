# Interactive Tutorial System

A step-by-step tutorial overlay system that guides users through different pages of the application.

## Features

- 📚 **Book Icon** in sidebar to trigger tutorials
- 🎯 **Context-Aware** tutorials based on current page
- 💡 **Interactive Tooltips** with highlighted elements
- ⌨️ **Navigation** with Previous/Next/Skip buttons
- 🎨 **Dark Overlay** with cutout highlighting
- 📱 **Responsive** positioning (top/bottom/left/right)

## Usage

### 1. Add Tutorial Steps for a Page

Edit `web/src/config/tutorialSteps.ts`:

```typescript
export const myPageTutorialSteps: TutorialStep[] = [
  {
    target: "#element-id", // CSS selector
    title: "Step Title",
    content: "Step description explaining what this element does.",
    position: "auto", // "auto" will automatically choose best position
    // or specify: "top", "bottom", "left", "right"
    highlightPadding: 8, // optional, default 8px
  },
  // ... more steps
];

// Add to the map
export const tutorialStepsMap: Record<string, TutorialStep[]> = {
  "/my-page": myPageTutorialSteps,
  // ... other pages
};
```

### 2. Add IDs to Elements

In your view/component, add `id` attributes to elements you want to highlight:

```tsx
<div id="element-id">
  <button id="add-button">Add</button>
</div>
```

### 3. Users Click Book Icon

Users click the 📚 Book icon in the sidebar to start the tutorial for the current page.

## Tutorial Step Interface

```typescript
interface TutorialStep {
  target: string; // CSS selector (e.g., "#my-element", ".my-class")
  title: string; // Tooltip title
  content: string; // Tooltip description
  position?: "top" | "bottom" | "left" | "right" | "auto"; // Tooltip position
  highlightPadding?: number; // Padding around highlighted element
}
```

### Position Options

- **`"auto"`** (recommended) - Automatically chooses the best position based on available screen space
- **`"top"`** - Tooltip above the element (will auto-adjust if not enough space)
- **`"bottom"`** - Tooltip below the element (will auto-adjust if not enough space)
- **`"left"`** - Tooltip to the left of the element (will auto-adjust if not enough space)
- **`"right"`** - Tooltip to the right of the element (will auto-adjust if not enough space)

**Smart Positioning:** Even with a specific position, the system will automatically adjust if the tooltip would go off-screen.

## Example Tutorial Configuration

```typescript
export const calendarTutorialSteps: TutorialStep[] = [
  {
    target: "#calendar-view",
    title: "Welcome to Calendar",
    content: "This is your calendar view where you can manage events.",
    position: "auto", // Automatically finds best position
  },
  {
    target: "#add-event-button",
    title: "Add New Event",
    content: "Click here to create a new event.",
    position: "left", // Prefer left, but will adjust if needed
  },
];
```

## Files Structure

```
web/
├── src/
│   ├── config/
│   │   └── tutorialSteps.ts          # Tutorial configurations
│   ├── context/
│   │   └── TutorialContext.tsx       # Tutorial state management
│   ├── components/
│   │   └── ui/
│   │       ├── Sidebar/
│   │       │   └── SidebarSettings.tsx  # Book icon button
│   │       └── Tutorial/
│   │           └── TutorialOverlay.tsx  # Overlay component
│   └── main.tsx                      # TutorialProvider wrapper
```

## Adding New Page Tutorial

1. Create tutorial steps in `tutorialSteps.ts`
2. Add route to `tutorialStepsMap`
3. Add IDs to key elements in your view
4. Test by clicking the Book icon on that page

## Tips

- Use descriptive IDs (e.g., `#add-task-button`, not `#btn1`)
- Keep steps concise (3-5 per page ideal)
- Use `position: "auto"` for best results - it automatically finds the optimal position
- Manual positions will auto-adjust if tooltip would go off-screen
- Test on different screen sizes for responsive design

## Smart Positioning Features

The tutorial system automatically ensures tooltips stay visible:

1. **Auto Position Mode**: When `position: "auto"`, the system measures available space in all directions and chooses the position with most room
2. **Intelligent Fallback**: Even with manual positions (top/bottom/left/right), if there's not enough space, it will flip to the opposite side
3. **Edge Protection**: Tooltips automatically adjust horizontal/vertical alignment to stay within screen bounds with 20px padding
4. **Responsive**: Updates position on window resize and scroll events

**Example scenarios:**

- Button at top of screen with `position: "top"` → automatically flips to `"bottom"`
- Element at right edge with `position: "right"` → automatically flips to `"left"`
- Centered element with `position: "auto"` → chooses position with most available space
