---
sidebar_position: 1
---

# Authentication

Cookie-based session authentication with Firebase.

## Overview

AI Planner uses cookie-based sessions for authentication:
- Login/Register via backend API
- Session cookies automatically included in requests
- Firebase for mobile push notifications

## API Endpoints

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/userinfo` - Get current user

## Usage

```typescript
import { useLogin } from "@shared/hooks/auth/useAuth";

function LoginForm() {
  const { mutate: login, isLoading } = useLogin();
  
  const handleSubmit = (email, password) => {
    login({ email, password });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Protected Routes

Use `<ProtectedRoute>` component to guard routes:

```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Auth Context

Access user state anywhere:

```typescript
const { user, isLoading } = useAuthContext();
```
