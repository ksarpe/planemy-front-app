import { APIError } from "@shared/data/Auth";
import { TaskListsResponse, type TaskInterface, type TaskListInterface } from "@shared/data/Tasks/interfaces";
import { buildApiUrl } from "../config/api";

export const getTasks = async (task_list_id: string): Promise<TaskInterface[]> => {
  const response = await fetch(buildApiUrl(`task-lists/${task_list_id}/tasks`), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting tasks failed`, response.status, errorBody);
  }
  const data = await response.json();

  // If backend returns { items: [...] } format, extract the items array
  if (data && typeof data === "object" && "items" in data && Array.isArray(data.items)) {
    return data.items;
  }

  // If it's already an array, return it
  if (Array.isArray(data)) {
    return data;
  }

  // Fallback to empty array if data format is unexpected
  console.warn("Unexpected getTasks response format:", data);
  return [];
};

export const addTask = async (taskData: Partial<TaskInterface>): Promise<Partial<TaskInterface>> => {
  const response = await fetch(buildApiUrl("tasks"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding task failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

//TODO, Patch has empty body response so handle it differently.
export const updateTask = async (taskId: string, taskData: Partial<TaskInterface>): Promise<Partial<TaskInterface>> => {
  if (!taskId) {
    throw new Error("Task ID is required for update");
  }
  const response = await fetch(buildApiUrl(`tasks/${taskId}`), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating task failed`, response.status, errorBody);
  }

  return taskData;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  if (!taskId) {
    throw new Error("Task ID is required for deletion");
  }

  const response = await fetch(buildApiUrl(`tasks/${taskId}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting task failed`, response.status, errorBody);
  }
};

export const getTaskLists = async (): Promise<TaskListsResponse> => {
  const response = await fetch(buildApiUrl("task-lists"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting task lists failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const getTaskList = async (listId: string): Promise<TaskListInterface | undefined> => {
  if (!listId) {
    throw new Error("Task list ID is required");
  }
  const response = await fetch(buildApiUrl(`task-lists/${listId}`), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting task list failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

//TODO: listData just string name or extend it to Partial?
export const addTaskList = async (listData: string): Promise<Partial<TaskListInterface>> => {
  const response = await fetch(buildApiUrl("task-lists"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: listData }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding task list failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const updateTaskList = async (
  listId: string,
  listData: Partial<TaskListInterface>,
): Promise<Partial<TaskListInterface>> => {
  if (!listId) {
    throw new Error("Task list ID is required for update");
  }
  const response = await fetch(buildApiUrl(`task-lists/${listId}`), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating task list failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const deleteTaskList = async (listId: string): Promise<void> => {
  if (!listId) {
    throw new Error("Task list ID is required for deletion");
  }

  const response = await fetch(buildApiUrl(`task-lists/${listId}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting task list failed`, response.status, errorBody);
  }
};
