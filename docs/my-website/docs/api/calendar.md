---
sidebar_position: 5
---

# Calendar API

Event and calendar endpoints.

## Get Events

```http
GET /api/v1/events?start_date=2024-01-01&end_date=2024-12-31
```

**Response:**
```json
{
  "items": [
    {
      "id": "1",
      "title": "Team Meeting",
      "start_time": "2024-12-15T10:00:00Z",
      "end_time": "2024-12-15T11:00:00Z",
      "description": "Weekly sync",
      "recurring": false
    }
  ]
}
```

## Create Event

```http
POST /api/v1/events
Content-Type: application/json

{
  "title": "New Event",
  "start_time": "2024-12-20T14:00:00Z",
  "end_time": "2024-12-20T15:00:00Z",
  "description": "Event description",
  "recurring": false
}
```

## Update Event

```http
PUT /api/v1/events/{eventId}
Content-Type: application/json

{
  "title": "Updated Event",
  "start_time": "2024-12-21T14:00:00Z"
}
```

## Delete Event

```http
DELETE /api/v1/events/{eventId}
```
