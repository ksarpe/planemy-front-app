import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
//import { useToastContext } from "@shared/hooks/context/useToastContext";
import {
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  getShoppingItemsForList,
  getUserFavoriteProducts,
  addFavoriteProduct,
  deleteFavoriteProduct,
  updateFavoriteProduct,
} from "@shared/api/shopping";
import type { ShoppingItemInterface, NewShoppingItem, FavoriteProductInterface } from "@shared/data/Shopping";
// useQuery already imported above

export const useShoppingItemsQuery = (listId?: string) => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: ["shoppingItems", user?.uid, listId],
    queryFn: () => getShoppingItemsForList(user!.uid, listId!),
    enabled: !!user && !!listId,
  });
};

export const useAddShoppingItem = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, item }: { listId: string; item: NewShoppingItem }) => {
      const id = await addShoppingItem({ ...item, listId, userId: user!.uid, isCompleted: false } as Omit<
        ShoppingItemInterface,
        "id"
      >);
      return id;
    },

    onMutate: async ({ listId, item }) => {
      const key = ["shoppingItems", user!.uid, listId] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ShoppingItemInterface[]>(key) || [];
      const optimistic: ShoppingItemInterface = {
        id: `optimistic-${Date.now()}`,
        listId,
        userId: user!.uid,
        ...item,
        addedAt: new Date(),
        isCompleted: false,
      } as ShoppingItemInterface;
      queryClient.setQueryData<ShoppingItemInterface[]>(key, [optimistic, ...previous]);
      return { previous, key } as const;
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<ShoppingItemInterface[]>(ctx.key, ctx.previous);
    },

    onSuccess: () => {
      //showToast("success", "Produkt został dodany");
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingItems", user!.uid, vars.listId] });
    },
  });
};

export const useUpdateShoppingItem = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, updates }: { listId: string; itemId: string; updates: Partial<ShoppingItemInterface> }) =>
      updateShoppingItem(itemId, updates),

    onMutate: async ({ listId, itemId, updates }) => {
      const key = ["shoppingItems", user!.uid, listId] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ShoppingItemInterface[]>(key) || [];
      const next = previous.map((i) =>
        i.id === itemId ? { ...i, ...updates, ...(updates.isCompleted ? { completedAt: new Date() } : {}) } : i,
      );
      queryClient.setQueryData<ShoppingItemInterface[]>(key, next);
      return { previous, key } as const;
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<ShoppingItemInterface[]>(ctx.key, ctx.previous);
    },

    onSuccess: () => {
      //showToast("success", "Produkt zaktualizowany");
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingItems", user!.uid, vars.listId] });
    },
  });
};

export const useRemoveShoppingItem = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId }: { listId: string; itemId: string }) => deleteShoppingItem(itemId),

    onMutate: async ({ listId, itemId }) => {
      const key = ["shoppingItems", user!.uid, listId] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ShoppingItemInterface[]>(key) || [];
      const next = previous.filter((i) => i.id !== itemId);
      queryClient.setQueryData<ShoppingItemInterface[]>(key, next);
      return { previous, key } as const;
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<ShoppingItemInterface[]>(ctx.key, ctx.previous);
    },

    onSuccess: () => {
      //showToast("success", "Produkt został usunięty");
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingItems", user!.uid, vars.listId] });
    },
  });
};

export const useToggleShoppingItemComplete = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, isCompleted }: { listId: string; itemId: string; isCompleted: boolean }) => {
      const updates: Partial<ShoppingItemInterface> = { isCompleted, completedAt: isCompleted ? new Date() : null };
      await updateShoppingItem(itemId, updates);
    },

    onMutate: async ({ listId, itemId, isCompleted }) => {
      const key = ["shoppingItems", user!.uid, listId] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ShoppingItemInterface[]>(key) || [];
      const next = previous.map((i) =>
        i.id === itemId ? { ...i, isCompleted, completedAt: isCompleted ? new Date() : null } : i,
      );
      queryClient.setQueryData<ShoppingItemInterface[]>(key, next);
      return { previous, key } as const;
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<ShoppingItemInterface[]>(ctx.key, ctx.previous);
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingItems", user!.uid, vars.listId] });
    },
  });
};

// ---- Favorite products ----
export const useFavoriteProductsQuery = () => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: ["favoriteProducts", user?.uid],
    queryFn: () => getUserFavoriteProducts(user!.uid),
    enabled: !!user,
  });
};

export const useAddFavoriteProduct = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<FavoriteProductInterface, "id" | "userId">) => {
      const payload = { ...product, userId: user!.uid };
      const id = await addFavoriteProduct(payload);
      return id;
    },
    onMutate: async (product) => {
      const key = ["favoriteProducts", user!.uid] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<FavoriteProductInterface[]>(key) || [];
      const optimistic: FavoriteProductInterface = {
        id: `optimistic-${Date.now()}`,
        userId: user!.uid,
        ...product,
        usageCount: product.usageCount ?? 0,
        lastUsed: product.lastUsed ?? new Date(),
      };
      queryClient.setQueryData<FavoriteProductInterface[]>(key, [optimistic, ...previous]);
      return { previous, key } as const;
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<FavoriteProductInterface[]>(ctx.key, ctx.previous);
    },
    onSuccess: () => {
      //showToast("success", "Produkt dodany do ulubionych");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
    },
  });
};

export const useDeleteFavoriteProduct = () => {
  //const { showToast } = useToastContext();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => deleteFavoriteProduct(productId),
    onMutate: async (productId: string) => {
      const key = ["favoriteProducts", user!.uid] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<FavoriteProductInterface[]>(key) || [];
      queryClient.setQueryData<FavoriteProductInterface[]>(
        key,
        previous.filter((p) => p.id !== productId),
      );
      return { previous, key } as const;
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<FavoriteProductInterface[]>(ctx.key, ctx.previous);
    },
    onSuccess: () => {
      //showToast("success", "Produkt usunięty z ulubionych");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
    },
  });
};

export const useAddFavoriteToList = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listId,
      product,
      quantity = 1,
    }: {
      listId: string;
      product: FavoriteProductInterface;
      quantity?: number;
    }) => {
      const newItem: NewShoppingItem = {
        name: product.name,
        quantity,
        unit: product.unit,
        category: product.category,
        price: product.price,
        isFavorite: true,
        favoriteProductId: product.id,
        isCompleted: false,
        notes: product.notes,
      };
      await addShoppingItem({ ...newItem, listId, userId: user!.uid, isCompleted: false } as Omit<
        ShoppingItemInterface,
        "id"
      >);
      await updateFavoriteProduct(product.id, {
        usageCount: product.usageCount + 1,
        lastUsed: new Date(),
      });
    },
    onMutate: async ({ listId, product, quantity = 1 }) => {
      // Optimistically add item to the list
      const listsKey = ["shoppingItems", user!.uid, listId] as const;
      await queryClient.cancelQueries({ queryKey: listsKey });
      const prevItems = queryClient.getQueryData<ShoppingItemInterface[]>(listsKey) || [];
      const optimistic: ShoppingItemInterface = {
        id: `optimistic-${Date.now()}`,
        listId,
        userId: user!.uid,
        name: product.name,
        quantity,
        unit: product.unit,
        category: product.category,
        price: product.price,
        isFavorite: true,
        favoriteProductId: product.id,
        isCompleted: false,
        addedAt: new Date(),
        notes: product.notes,
      } as ShoppingItemInterface;
      queryClient.setQueryData<ShoppingItemInterface[]>(listsKey, [optimistic, ...prevItems]);

      // Optimistically bump favorite usage
      const favKey = ["favoriteProducts", user!.uid] as const;
      await queryClient.cancelQueries({ queryKey: favKey });
      const prevFavs = queryClient.getQueryData<FavoriteProductInterface[]>(favKey) || [];
      const nextFavs = prevFavs.map((p) =>
        p.id === product.id ? { ...p, usageCount: p.usageCount + 1, lastUsed: new Date() } : p,
      );
      queryClient.setQueryData<FavoriteProductInterface[]>(favKey, nextFavs);

      return { prevItems, listsKey, prevFavs, favKey } as const;
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData<ShoppingItemInterface[]>(ctx.listsKey, ctx.prevItems);
      queryClient.setQueryData<FavoriteProductInterface[]>(ctx.favKey, ctx.prevFavs);
    },
    onSuccess: () => {
      //showToast("success", "Ulubiony produkt dodany do listy");
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["shoppingItems", user!.uid, vars.listId] });
      queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
    },
  });
};
