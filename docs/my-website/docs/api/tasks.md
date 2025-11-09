---
sidebar_position: 3
---

# Tasks API

Task and task list endpoints.

## Get Tasks

```http
GET /api/v1/task-lists/{listId}/tasks
```

**Response:**
```json
{
  "items": [
    {
      "id": "1",
      "title": "Buy groceries",
      "status": "todo",
      "priority": "high",
      "due_date": "2024-12-31",
      "task_list_id": "list1"
    }
  ]
}
```

## Create Task

```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "New task",
  "status": "todo",
  "priority": "medium",
  "task_list_id": "list1"
}
```

## Update Task

```http
PUT /api/v1/tasks/{taskId}
Content-Type: application/json

{
  "title": "Updated title",
  "status": "done"
}
```

## Delete Task

```http
DELETE /api/v1/tasks/{taskId}
```

## Get Task Lists

```http
GET /api/v1/task-lists
```

## Create Task List

```http
POST /api/v1/task-lists
Content-Type: application/json

{
  "name": "Work Tasks",
  "color": "#3b82f6"
}
```
