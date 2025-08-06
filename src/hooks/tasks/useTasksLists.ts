import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { fetchUserTaskListsApi, createTaskListApi, deleteTaskListApi, updateTaskListApi } from "@/api/tasks_lists";
import type { TaskListInterface } from "@/data/Tasks/interfaces";
import { v4 as uuidv4 } from "uuid";

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
  const { setCurrentTaskListId } = useTaskContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listName: string) => {
      const id = uuidv4(); // Generujemy ID tutaj
      await createTaskListApi(listName, user!.uid, id);
      return id; // Zwracamy ID, aby było dostępne w onSuccess
    },
    onSuccess: async (newId) => {
      showToast("success", "Lista zadań została utworzona!");
      await queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      setCurrentTaskListId(newId);
    },
    onError: (error) => {
      console.error("Error creating task list:", error); //DEBUG
      showToast("error", "Błąd podczas tworzenia listy zadań");
    },
  });
};

export const useDeleteTaskList = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => deleteTaskListApi(listId, user!.uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["pendingShares"] });
      queryClient.invalidateQueries({ queryKey: ["labelConnections"] });
      showToast("success", "Lista zadań została usunięta wraz ze wszystkimi zadaniami i udostępnieniami!");
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
      updateTaskListApi(listId, updates),
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
