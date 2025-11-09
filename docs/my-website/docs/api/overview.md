---
sidebar_position: 1
---

# API Overview

Backend API reference for AI Planner.

## Base URL

- **Development**: `http://localhost:8080/api/v1`
- **Production**: `https://aiplanner-back-production.up.railway.app/api/v1`

## Authentication

All endpoints (except login/register) require authentication via session cookies.

```typescript
fetch(buildApiUrl("tasks"), {
  credentials: "include", // Required!
});
```

## Response Format

### Success Response

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination

```
GET /api/v1/tasks?page=1&limit=20
```

## Filtering

```
GET /api/v1/tasks?status=done&priority=high
```

## Sorting

```
GET /api/v1/tasks?sort=created_at&order=desc
```
