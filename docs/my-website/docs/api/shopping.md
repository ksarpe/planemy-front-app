---
sidebar_position: 4
---

# Shopping API

Shopping list endpoints.

## Get Shopping Lists

```http
GET /api/v1/shopping-lists
```

## Create Shopping Item

```http
POST /api/v1/shopping-items
Content-Type: application/json

{
  "name": "Milk",
  "quantity": 2,
  "category": "Dairy",
  "list_id": "list1"
}
```

## Toggle Purchased

```http
PUT /api/v1/shopping-items/{itemId}
Content-Type: application/json

{
  "purchased": true
}
```

## Delete Shopping Item

```http
DELETE /api/v1/shopping-items/{itemId}
```
