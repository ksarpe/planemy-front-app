import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import { fetchUserTaskListsApi, createTaskListApi, deleteTaskListApi, updateTaskList } from "@/api/tasks_lists";
import type { TaskListInterface } from "@/data/Tasks/interfaces";

// --- QUERIES ----
export const useTaskLists = () => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: ["taskLists", user?.uid],
    queryFn: () => fetchUserTaskListsApi(user!.uid),
    enabled: !!user,
  });
};

// --- MUTATIONS (modyfikacja danych) ---

export const useCreateTaskList = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listName: string) => createTaskListApi(listName, user!.uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      showToast("success", "Lista zadań została utworzona!");
    },
    onError: (error) => {
      console.error("Error creating task list:", error); //DEBUG
      showToast("error", "Błąd podczas tworzenia listy zadań");
    },
  });
};

export const useDeleteTaskList = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => deleteTaskListApi(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      showToast("success", "Lista zadań została usunięta!");
    },
    onError: (error) => {
      console.error("Error deleting task list:", error); //DEBUG
      showToast("error", "Błąd podczas usuwania listy zadań");
    },
  });
};

export const useUpdateTaskList = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, updates }: { listId: string; updates: Partial<TaskListInterface> }) =>
      updateTaskList(listId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      showToast("success", "Lista zadań została zaktualizowana!");
    },
    onError: (error) => {
      console.error("Error updating task list:", error);
      showToast("error", "Błąd podczas aktualizacji listy zadań");
    },
  });
};
