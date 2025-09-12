import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@shared/lib/queryClient";
import {
  addTask,
  updateTask,
  deleteTask,
  getTasks,
  addTaskList,
  updateTaskList,
  deleteTaskList,
  getTaskLists,
  getTaskList,
} from "@shared/api/tasks";

import type { TaskInterface, TaskListInterface } from "@shared/data/Tasks/interfaces";

export function useTasks(taskListId: string) {
  return useQuery<TaskInterface[], unknown, TaskInterface[], string[]>({
    queryKey: ["tasks", taskListId],
    queryFn: () => getTasks(taskListId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!taskListId, // Only run query if taskListId is provided
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: (taskData: Partial<TaskInterface>) => addTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskInterface> }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useTaskLists() {
  return useQuery<TaskListInterface[], unknown, TaskListInterface[], string[]>({
    queryKey: ["taskLists"],
    queryFn: getTaskLists,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useTaskList(taskListId: string) {
  return useQuery<TaskListInterface | undefined, unknown, TaskListInterface | undefined, (string | undefined)[]>({
    queryKey: ["taskLists", taskListId],
    queryFn: () => getTaskList(taskListId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!taskListId, // Only run query if taskListId is provided
  });
}

export function useCreateTaskList() {
  return useMutation({
    mutationFn: (listData: Partial<TaskListInterface>) => addTaskList(listData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });
}

export function useUpdateTaskList() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskListInterface> }) => updateTaskList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeleteTaskList() {
  return useMutation({
    mutationFn: (listId: string) => deleteTaskList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });
}
