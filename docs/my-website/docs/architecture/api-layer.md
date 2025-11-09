---
sidebar_position: 4
---

# API Layer

Pure fetch functions for backend communication.

## Pattern

```typescript
// shared/api/tasks.ts
import { buildApiUrl } from "../config/api";

export async function getTasks(listId: string): Promise<TaskResponse> {
  const response = await fetch(buildApiUrl(`task-lists/${listId}/tasks`), {
    credentials: "include", // Required for cookie-based auth
  });
  
  if (!response.ok) {
    throw new APIError(response);
  }
  
  return response.json();
}
```

## Key Rules

- Always use `credentials: "include"` for session cookies
- Use `buildApiUrl()` for environment-based URLs
- Handle errors with `APIError` class
- Return typed responses

## Environment URLs

- Development: `http://localhost:8080`
- Production: `https://aiplanner-back-production.up.railway.app`

Configured via `VITE_API_URL` in `.env` files.
