---
sidebar_position: 1
---

# Environment Configuration

Managing environment variables for different deployment targets.

## Environment Files

### Development (`.env.development`)

```env
VITE_API_URL=http://localhost:8080
```

### Production (`.env.production`)

```env
VITE_API_URL=https://aiplanner-back-production.up.railway.app
```

### Local Overrides (`.env.local`)

Gitignored file for personal settings:

```env
VITE_API_URL=http://192.168.1.100:8080
```

## Priority Order

1. `.env.local` (highest priority, gitignored)
2. `.env.[mode]` (development/production)
3. `.env` (defaults)

## Usage in Code

```typescript
// shared/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  || "http://localhost:8080";

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}/api/v1/${path}`;
}
```

## Build Modes

- `npm run dev` → uses `.env.development`
- `npm run build` → uses `.env.production`
- Local override → uses `.env.local`

## Environment Variables

### Web

- `VITE_API_URL` - Backend API URL
- `VITE_FIREBASE_API_KEY` - Firebase config (optional)

### Mobile

Mobile uses different env setup (Expo config).

## Security

- Never commit `.env.local`
- Never put secrets in `.env.development` or `.env.production`
- Use `.env.example` for templates
