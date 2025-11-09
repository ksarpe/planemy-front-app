---
sidebar_position: 6
---

# Labels API

Label and label connection endpoints.

## Get Labels

```http
GET /api/v1/labels
```

**Response:**
```json
{
  "items": [
    {
      "id": "1",
      "name": "Work",
      "color": "#3b82f6",
      "user_id": "user123"
    }
  ]
}
```

## Create Label

```http
POST /api/v1/labels
Content-Type: application/json

{
  "name": "Personal",
  "color": "#10b981"
}
```

## Update Label

```http
PUT /api/v1/labels/{labelId}
Content-Type: application/json

{
  "name": "Updated Name",
  "color": "#ef4444"
}
```

## Delete Label

```http
DELETE /api/v1/labels/{labelId}
```

## Get Label Connections

```http
GET /api/v1/label-connections?object_id={id}&object_type={type}
```

## Create Label Connection

```http
POST /api/v1/label-connections
Content-Type: application/json

{
  "entity_id": "task123",
  "entity_type": "task",
  "label_id": "label1"
}
```

## Delete Label Connection

```http
DELETE /api/v1/label-connections/{connectionId}
```
