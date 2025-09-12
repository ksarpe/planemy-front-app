import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import {
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  getShoppingItems,
  addShoppingList,
  updateShoppingList,
  deleteShoppingList,
  getShoppingLists,
  getShoppingList,
} from "../../api/shopping";

import type { ShoppingItemInterface, ShoppingListInterface } from "../../data/Shopping/interfaces";

export function useShoppingItems(listId: string) {
  return useQuery<ShoppingItemInterface[], unknown, ShoppingItemInterface[], string[]>({
    queryKey: ["shopping-items", listId],
    queryFn: () => getShoppingItems(listId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!listId, // Only run query if listId is provided
  });
}

export function useCreateShoppingItem() {
  return useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: Partial<ShoppingItemInterface> }) =>
      addShoppingItem(listId, data),
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["shopping-items", listId] });
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
    },
  });
}

export function useUpdateShoppingItem() {
  return useMutation({
    mutationFn: ({ listId, itemId, data }: { listId: string; itemId: string; data: Partial<ShoppingItemInterface> }) =>
      updateShoppingItem(listId, itemId, data),
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["shopping-items", listId] });
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeleteShoppingItem() {
  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) => deleteShoppingItem(listId, itemId),
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["shopping-items", listId] });
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
    },
  });
}

export function useToggleShoppingItem() {
  return useMutation({
    mutationFn: ({ listId, itemId, isCompleted }: { listId: string; itemId: string; isCompleted: boolean }) =>
      updateShoppingItem(listId, itemId, {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      }),
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["shopping-items", listId] });
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useShoppingLists() {
  return useQuery<ShoppingListInterface[], unknown, ShoppingListInterface[], string[]>({
    queryKey: ["shoppingLists"],
    queryFn: getShoppingLists,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useShoppingList(listId: string) {
  return useQuery<ShoppingListInterface | undefined, unknown, ShoppingListInterface | undefined, (string | undefined)[]>({
    queryKey: ["shoppingLists", listId],
    queryFn: () => getShoppingList(listId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!listId, // Only run query if listId is provided
  });
}

export function useCreateShoppingList() {
  return useMutation({
    mutationFn: (listData: Partial<ShoppingListInterface>) => addShoppingList(listData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
}

export function useUpdateShoppingList() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShoppingListInterface> }) => updateShoppingList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeleteShoppingList() {
  return useMutation({
    mutationFn: (listId: string) => deleteShoppingList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shoppingLists"] });
    },
  });
}
