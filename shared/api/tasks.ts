import { APIError } from "@shared/data/Auth";
import { TaskListsResponse, type TaskInterface, type TaskListInterface } from "@shared/data/Tasks/interfaces";

export const getTasks = async (taskListId: string): Promise<TaskInterface[]> => {
  const response = await fetch(`http://localhost:8080/api/v1/tasks?listId=${taskListId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting tasks failed`, response.status, errorBody);
  }
  const data = await response.json();
  console.log("getTasks response data:", data);
  console.log("getTasks data type:", typeof data, "isArray:", Array.isArray(data));

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
  const response = await fetch("http://localhost:8080/api/v1/tasks", {
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

export const updateTask = async (taskId: string, taskData: Partial<TaskInterface>): Promise<Partial<TaskInterface>> => {
  if (!taskId) {
    throw new Error("Task ID is required for update");
  }
  const response = await fetch(`http://localhost:8080/api/v1/tasks/${taskId}`, {
    method: "PUT",
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
  const data = await response.json();
  return data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  if (!taskId) {
    throw new Error("Task ID is required for deletion");
  }

  const response = await fetch(`http://localhost:8080/api/v1/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting task failed`, response.status, errorBody);
  }
};

export const getTaskLists = async (): Promise<TaskListsResponse> => {
  const response = await fetch("http://localhost:8080/api/v1/task-lists", {
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
  const response = await fetch(`http://localhost:8080/api/v1/task-lists/${listId}`, {
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
  const response = await fetch("http://localhost:8080/api/v1/task-lists", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: listData }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.log("errorBody", errorBody);
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
  const response = await fetch(`http://localhost:8080/api/v1/task-lists/${listId}`, {
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

  const response = await fetch(`http://localhost:8080/api/v1/task-lists/${listId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting task list failed`, response.status, errorBody);
  }
};
