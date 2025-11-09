---
sidebar_position: 2
---

# Monorepo Structure

Details about the workspace organization and package management.

## Workspace Configuration

The project uses npm workspaces defined in root `package.json`:

```json
{
  "workspaces": [
    "web",
    "mobile",
    "shared"
  ]
}
```

## Package Dependencies

- **shared**: Zero dependencies on web/mobile
- **web**: Depends on shared
- **mobile**: Depends on shared

This ensures shared logic remains platform-agnostic.

## Development Commands

All commands run from root:

```bash
npm run dev:web      # Start web dev server
npm run dev:mobile   # Start mobile dev server
npm run build:web    # Build web for production
```

## Benefits

- ✅ Code reuse between platforms
- ✅ Single source of truth for business logic
- ✅ Easier refactoring and updates
- ✅ Consistent types across platforms
