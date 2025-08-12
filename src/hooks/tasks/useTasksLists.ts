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

    onMutate: async (listName: string) => {
      const key = ["taskLists", user!.uid] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TaskListInterface[]>(key) || [];
      const optimistic: TaskListInterface = {
        id: `optimistic-${uuidv4()}`,
        name: listName,
        userId: user!.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<TaskListInterface[]>(key, [optimistic, ...previous]);
      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      const key = ["taskLists", user!.uid] as const;
      queryClient.setQueryData<TaskListInterface[]>(key, ctx?.previous || []);
    },

    onSuccess: async (newId) => {
      showToast("success", "Lista zadań została utworzona!");
      await queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      setCurrentTaskListId(newId);
    },
  });
};

export const useDeleteTaskList = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => deleteTaskListApi(listId, user!.uid),

    onMutate: async (listId: string) => {
      const key = ["taskLists", user!.uid] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previousLists = queryClient.getQueryData<TaskListInterface[]>(key) || [];
      queryClient.setQueryData<TaskListInterface[]>(
        key,
        previousLists.filter((l) => l.id !== listId),
      );

      // Optymistycznie usuń również cache zadań tej listy
      const tasksKey = ["tasks", listId] as const;
      const previousTasksForList = queryClient.getQueryData(tasksKey);
      queryClient.removeQueries({ queryKey: tasksKey });

      return { previousLists, previousTasksForList, tasksKey };
    },

    onError: (_err, _listId, ctx) => {
      const key = ["taskLists", user!.uid] as const;
      queryClient.setQueryData<TaskListInterface[]>(key, ctx?.previousLists || []);
      if (ctx?.previousTasksForList) queryClient.setQueryData(ctx.tasksKey!, ctx.previousTasksForList);
    },

    onSuccess: () => {
      showToast("success", "Lista zadań została usunięta wraz ze wszystkimi zadaniami i udostępnieniami!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["pendingShares"] });
      queryClient.invalidateQueries({ queryKey: ["labelConnections"] });
    },
  });
};

export const useUpdateTaskList = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, updates }: { listId: string; updates: Partial<TaskListInterface> }) =>
      updateTaskListApi(listId, updates),

    onMutate: async ({ listId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["taskLists"] });
      const touched: Array<{ key: readonly unknown[]; prev?: TaskListInterface[] }> = [];
      const queries = queryClient.getQueriesData<TaskListInterface[]>({ queryKey: ["taskLists"] });
      queries.forEach(([key, data]) => {
        if (!data) return;
        if (data.some((l) => l.id === listId)) {
          touched.push({ key, prev: data });
          const next = data.map((l) =>
            l.id === listId ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l,
          );
          queryClient.setQueryData<TaskListInterface[]>(key, next);
        }
      });
      return { touched };
    },

    onError: (_err, _vars, ctx) => {
      ctx?.touched?.forEach(({ key, prev }) => queryClient.setQueryData(key, prev));
    },

    onSuccess: () => {
      showToast("success", "Lista zadań została zaktualizowana!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });
};
