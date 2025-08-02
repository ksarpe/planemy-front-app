import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import {
  addTaskToList,
  updateTaskInList,
  removeTaskFromList,
  toggleTaskCompletion,
  clearCompletedTasks,
  uncheckAllTasks,
} from "@/api/tasks_lists";
import { fetchTasksForListApi } from "@/api/tasks";
import type { TaskInterface } from "@/data/Tasks/interfaces";

// --- QUERIES dla zadań ---

// Hook do pobierania zadań z konkretnej listy (przydatny dla komponentów które potrzebują tylko zadania z jednej listy)
export const useTasks = (listId: string | null) => {
  return useQuery({
    queryKey: ["tasks", listId],
    queryFn: () => fetchTasksForListApi(listId!),
    enabled: !!listId,
  });
};
// Plik: src/hooks/tasks/useTasks.js (ulepszona wersja)

// import { useInfiniteQuery } from "@tanstack/react-query";
// // Załóżmy, że funkcja API teraz wspiera paginację (limit, startAfter)
// import { fetchPaginatedTasksApi } from "@/api/tasks";

// export const useTasksInfinite = (listId: string | null) => {
//   return useInfiniteQuery({
//     queryKey: ["tasks", listId],
    
//     // Funkcja pobierająca dane, otrzymuje `pageParam`
//     queryFn: ({ pageParam }) => fetchPaginatedTasksApi({ listId: listId!, pageParam }),

//     // Funkcja, która określa, co będzie następnym `pageParam`
//     // (np. ostatni dokument, z którego zaczynamy następne zapytanie)
//     getNextPageParam: (lastPage) => lastPage.nextCursor, // `nextCursor` musisz zwrócić z API

//     initialPageParam: null, // Zaczynamy od początku
//     enabled: !!listId,
//   });
// };

// --- MUTATIONS dla zadań ---

export const useCreateTask = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      title,
      description,
      dueDate,
    }: {
      listId: string;
      title: string;
      description?: string | null;
      dueDate?: string | null;
    }) => addTaskToList(listId, title, user!.uid, description, dueDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("success", "Zadanie zostało dodane!");
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      showToast("error", "Błąd podczas dodawania zadania");
    },
  });
};

export const useUpdateTask = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<TaskInterface> }) =>
      updateTaskInList(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("success", "Zadanie zostało zaktualizowane!");
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      showToast("error", "Błąd podczas aktualizacji zadania");
    },
  });
};

export const useDeleteTask = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => removeTaskFromList(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("success", "Zadanie zostało usunięte!");
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      showToast("error", "Błąd podczas usuwania zadania");
    },
  });
};

export const useToggleTaskCompletion = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => toggleTaskCompletion(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("success", "Status zadania został zmieniony!");
    },
    onError: (error) => {
      console.error("Error toggling task completion:", error);
      showToast("error", "Błąd podczas zmiany statusu zadania");
    },
  });
};

export const useMoveTask = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, toListId }: { taskId: string; toListId: string }) =>
      updateTaskInList(taskId, { taskListId: toListId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("success", "Zadanie zostało przeniesione!");
    },
    onError: (error) => {
      console.error("Error moving task:", error);
      showToast("error", "Błąd podczas przenoszenia zadania");
    },
  });
};

export const useClearCompletedTasks = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => clearCompletedTasks(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("success", "Usunięto wszystkie ukończone zadania!");
    },
    onError: (error) => {
      console.error("Error clearing completed tasks:", error);
      showToast("error", "Błąd podczas usuwania ukończonych zadań");
    },
  });
};

export const useUncheckAllTasks = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => uncheckAllTasks(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("success", "Odznaczono wszystkie zadania!");
    },
    onError: (error) => {
      console.error("Error unchecking tasks:", error);
      showToast("error", "Błąd podczas odznaczania zadań");
    },
  });
};
