import {
  addTask,
  addTaskList,
  deleteTask,
  deleteTaskList,
  getTaskList,
  getTaskLists,
  getTasks,
  updateTask,
  updateTaskList,
} from "@shared/api/tasks";
import { queryClient } from "@shared/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { TaskInterface, TaskListInterface, TaskListsResponse } from "@shared/data/Tasks/interfaces";

export function useTasks(task_list_id: string) {
  return useQuery<TaskInterface[], unknown, TaskInterface[], string[]>({
    queryKey: ["tasks", task_list_id],
    queryFn: () => getTasks(task_list_id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!task_list_id, // Only run query if task_list_id is provided
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
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskInterface>; listId: string }) => updateTask(id, data),
    onSuccess: (_, variables) => {
      const { listId } = variables;
      queryClient.invalidateQueries({
        queryKey: ["tasks", listId],
      });
    },
    onError: (error: unknown) => {
      console.error("Error updating task:", error);
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
  return useQuery<TaskListsResponse, unknown, TaskListsResponse, string[]>({
    queryKey: ["taskLists"],
    queryFn: getTaskLists,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useTaskList(task_list_id: string) {
  return useQuery<TaskListInterface | undefined, unknown, TaskListInterface | undefined, (string | undefined)[]>({
    queryKey: ["taskLists", task_list_id],
    queryFn: () => getTaskList(task_list_id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!task_list_id, // Only run query if task_list_id is provided
  });
}

export function useCreateTaskList() {
  return useMutation({
    mutationFn: (listData: string) => addTaskList(listData), //TODO: type to Partial? or always just name string
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
