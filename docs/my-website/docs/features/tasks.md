---
sidebar_position: 2
---

# Tasks

Task and task list management system.

## Features

- ✅ Create multiple task lists
- ✅ Add/edit/delete tasks
- ✅ Task status (todo, in progress, done)
- ✅ Priority levels
- ✅ Due dates
- ✅ Labels for categorization

## API Hooks

```typescript
// Get tasks for a list
const { data: tasks } = useTasks(listId);

// Create task
const { mutate: createTask } = useCreateTask();
createTask({ title, task_list_id, status });

// Update task
const { mutate: updateTask } = useUpdateTask();
updateTask({ id, data: { status: "done" } });

// Delete task
const { mutate: deleteTask } = useDeleteTask();
deleteTask(taskId);
```

## Task Lists

```typescript
// Get all lists
const { data: lists } = useTaskLists();

// Create list
const { mutate: createList } = useCreateTaskList();
```

## Components

- `TaskItem` - Individual task component
- `TaskList` - List of tasks
- `TaskListSelector` - Switch between lists
