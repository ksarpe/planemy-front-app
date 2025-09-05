import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import { useT } from "@shared/hooks/useT";
import { clearCompletedTasks, uncheckAllTasks } from "@shared/api/tasks_lists";
import { createTaskApi, updateTaskApi, removeTaskApi, completeTaskApi } from "@shared/api/tasks";
import { fetchTasksForListApi } from "@shared/api/tasks";
import type { TaskInterface } from "@shared/data/Tasks/interfaces";
import { v4 as uuidv4 } from "uuid";

export const useTasks = (listId: string | null) => {
  return useQuery({
    queryKey: ["tasks", listId],
    queryFn: () => fetchTasksForListApi(listId!),
    enabled: !!listId, //listId must be defined to fetch tasks
  });
  //!null -> !true -> false
  //!"abc" -> !false -> true
};
// Plik: src/hooks/tasks/useTasks.js (ulepszona wersja)

// import { useInfiniteQuery } from "@tanstack/react-query";
// // Załóżmy, że funkcja API teraz wspiera paginację (limit, startAfter)
// import { fetchPaginatedTasksApi } from "@shared/api/tasks";

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
    }) => createTaskApi(listId, title, user!.uid, description, dueDate),

    // Optimistic update
    onMutate: async (vars) => {
      const { listId, title, description, dueDate } = vars;

      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });

      const previousTasks = queryClient.getQueryData<TaskInterface[]>(["tasks", listId]) || [];

      const optimisticTask: TaskInterface = {
        id: `optimistic-${uuidv4()}`,
        title,
        description: description || "",
        dueDate: dueDate || "",
        isCompleted: false,
        userId: user!.uid,
        taskListId: listId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        labels: [],
      };

      queryClient.setQueryData<TaskInterface[]>(["tasks", listId], (old = []) => [optimisticTask, ...old]);

      return { previousTasks, listId };
    },

    onError: (_error, _vars, context) => {
      if (context?.listId) {
        queryClient.setQueryData(["tasks", context.listId], context.previousTasks);
      }
    },

    onSuccess: () => {
      showToast("success", "Zadanie zostało dodane!");
    },

    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", vars.listId] });
    },
  });
};

export const useUpdateTask = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<TaskInterface> }) =>
      updateTaskApi(taskId, updates),

    onMutate: async ({ taskId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const touched: Array<{ key: QueryKey; prev?: TaskInterface[] }> = [];
      const queries = queryClient.getQueriesData<TaskInterface[]>({ queryKey: ["tasks"] });

      queries.forEach(([key, data]) => {
        if (!data) return;
        if (data.some((t) => t.id === taskId)) {
          touched.push({ key: key as QueryKey, prev: data });
          const next = data.map((t) =>
            t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t,
          );
          queryClient.setQueryData<TaskInterface[]>(key, next);
        }
      });
      return { touched };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.touched?.forEach(({ key, prev }) => queryClient.setQueryData(key, prev));
    },

    onSuccess: () => {
      showToast("success", "Zadanie zostało zaktualizowane!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const { t } = useT();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => removeTaskApi(taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const touched: Array<{ key: QueryKey; prev?: TaskInterface[] }> = [];
      const queries = queryClient.getQueriesData<TaskInterface[]>({ queryKey: ["tasks"] });
      queries.forEach(([key, data]) => {
        if (!data) return;
        if (data.some((t) => t.id === taskId)) {
          touched.push({ key: key as QueryKey, prev: data });
          const next = data.filter((t) => t.id !== taskId);
          queryClient.setQueryData<TaskInterface[]>(key, next);
        }
      });
      return { touched };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.touched?.forEach(({ key, prev }) => queryClient.setQueryData(key, prev));
    },

    onSuccess: () => {
      showToast("success", t("tasks.messages.taskDeleted"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useCompleteTask = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => completeTaskApi(taskId),

    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const touched: Array<{ key: QueryKey; prev?: TaskInterface[] }> = [];
      const queries = queryClient.getQueriesData<TaskInterface[]>({ queryKey: ["tasks"] });
      queries.forEach(([key, data]) => {
        if (!data) return;
        const idx = data.findIndex((t) => t.id === taskId);
        if (idx !== -1) {
          touched.push({ key: key as QueryKey, prev: data });
          const next = data.map((t) =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted, updatedAt: new Date().toISOString() } : t,
          );
          queryClient.setQueryData<TaskInterface[]>(key, next);
        }
      });
      return { touched };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.touched?.forEach(({ key, prev }) => queryClient.setQueryData(key, prev));
    },

    onSuccess: () => {
      showToast("success", "Status zadania został zmieniony!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useClearCompletedTasks = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => clearCompletedTasks(listId),

    onMutate: async (listId: string) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });
      const previous = queryClient.getQueryData<TaskInterface[]>(["tasks", listId]) || [];
      const next = previous.filter((t) => !t.isCompleted);
      queryClient.setQueryData<TaskInterface[]>(["tasks", listId], next);
      return { previous, listId };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.listId) queryClient.setQueryData(["tasks", ctx.listId], ctx.previous);
    },

    onSuccess: () => {
      showToast("success", "Usunięto wszystkie ukończone zadania!");
    },

    onSettled: (_d, _e, listId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};

export const useUncheckAllTasks = () => {
  const { t } = useT();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => uncheckAllTasks(listId),

    onMutate: async (listId: string) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", listId] });
      const previous = queryClient.getQueryData<TaskInterface[]>(["tasks", listId]) || [];
      const next = previous.map((t) => ({ ...t, isCompleted: false }));
      queryClient.setQueryData<TaskInterface[]>(["tasks", listId], next);
      return { previous, listId };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.listId) queryClient.setQueryData(["tasks", ctx.listId], ctx.previous);
    },

    onSuccess: () => {
      showToast("success", t("tasks.messages.allTasksUnchecked"));
    },

    onSettled: (_d, _e, listId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};
