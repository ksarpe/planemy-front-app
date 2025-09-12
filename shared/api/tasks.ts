import { APIError } from "@shared/data/Auth";
import { type TaskInterface, type TaskListInterface } from "@shared/data/Tasks/interfaces";

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
  return data;
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

export const getTaskLists = async (): Promise<TaskListInterface[]> => {
  return [];
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
  return undefined;
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

export const addTaskList = async (listData: Partial<TaskListInterface>): Promise<Partial<TaskListInterface>> => {
  const response = await fetch("http://localhost:8080/api/v1/task-lists", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listData),
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
