---
sidebar_position: 2
---

# Authentication API

User authentication endpoints.

## Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

## Logout

```http
POST /api/v1/auth/logout
```

## Get Current User

```http
GET /api/v1/auth/userinfo
```

**Response:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Change Password

```http
POST /api/v1/auth/change-password
Content-Type: application/json

{
  "old_password": "old123",
  "new_password": "new456"
}
```
