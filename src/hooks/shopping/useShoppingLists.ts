import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import { getUserShoppingLists, addShoppingList, updateShoppingList, deleteShoppingList } from "@/api/shopping";
import type { ShoppingListInterface } from "@/data/Shopping/interfaces";

// --- QUERIES ---
export const useShoppingLists = () => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: ["shoppingLists", user?.uid],
    queryFn: () => getUserShoppingLists(user!.uid),
    enabled: !!user,
  });
};

// --- MUTATIONS ---
export const useCreateShoppingList = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
    }: {
      name: string;
    }) => {
      const payload: Omit<ShoppingListInterface, "id" | "createdAt" | "updatedAt"> = {
        name,
        isShared: false,
        userId: user!.uid,
        type: "personal",
      };
      const id = await addShoppingList(payload);
      return id;
    },

    onMutate: async (vars) => {
      const key = ["shoppingLists", user!.uid] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ShoppingListInterface[]>(key) || [];
      const optimistic: ShoppingListInterface = {
        id: `optimistic-${Date.now()}`,
        name: vars.name,
        isShared: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user!.uid,
        type: "personal",
      };
      queryClient.setQueryData<ShoppingListInterface[]>(key, [optimistic, ...previous]);
      return { previous, key } as const;
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<ShoppingListInterface[]>(ctx.key, ctx.previous);
    },

    onSuccess: async () => {
      showToast("success", "Lista została utworzona!");
      await queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};

export const useUpdateShoppingList = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, updates }: { listId: string; updates: Partial<ShoppingListInterface> }) =>
      updateShoppingList(listId, updates),

    onMutate: async ({ listId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["shoppingLists"] });
      const touched: Array<{ key: readonly unknown[]; prev?: ShoppingListInterface[] }> = [];
      const queries = queryClient.getQueriesData<ShoppingListInterface[]>({ queryKey: ["shoppingLists"] });
      queries.forEach(([key, data]) => {
        if (!data) return;
        if (data.some((l) => l.id === listId)) {
          touched.push({ key, prev: data });
          const next = data.map((l) => (l.id === listId ? { ...l, ...updates, updatedAt: new Date() } : l));
          queryClient.setQueryData<ShoppingListInterface[]>(key, next);
        }
      });
      return { touched } as const;
    },

    onError: (_err, _vars, ctx) => {
      ctx?.touched?.forEach(({ key, prev }) => queryClient.setQueryData(key, prev));
    },

    onSuccess: () => {
      showToast("success", "Lista została zaktualizowana!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};

export const useDeleteShoppingList = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => deleteShoppingList(listId, user!.uid),

    onMutate: async (listId: string) => {
      const key = ["shoppingLists", user!.uid] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ShoppingListInterface[]>(key) || [];
      queryClient.setQueryData<ShoppingListInterface[]>(
        key,
        previous.filter((l) => l.id !== listId),
      );
      return { previous, key } as const;
    },

    onError: (_err, _listId, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<ShoppingListInterface[]>(ctx.key, ctx.previous);
    },

    onSuccess: () => {
      showToast("success", "Lista została usunięta wraz ze wszystkimi udostępnieniami!");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
};
