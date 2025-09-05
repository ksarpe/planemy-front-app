import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { getShoppingItemsForList, deleteShoppingItem } from "@shared/api/shopping";
import type { ShoppingItemInterface, ShoppingListInterface, ListStats } from "@/data/Shopping";

/**
 * Aggregates shopping item stats per list and exposes a clear-completed action.
 * Keeps all React Query client usage inside a hook, not in components.
 */
export function useShoppingListStats(lists: ShoppingListInterface[]) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const itemsQueries = useQueries({
    queries: (lists || []).map((l) => ({
      queryKey: ["shoppingItems", user?.uid, l.id],
      queryFn: () => getShoppingItemsForList(user!.uid, l.id),
      enabled: !!user,
    })),
  });

  const itemsByList: Record<string, ShoppingItemInterface[]> = Object.fromEntries(
    (lists || []).map((l, idx) => [l.id, (itemsQueries[idx]?.data as ShoppingItemInterface[]) || []]),
  );

  const statsByList: Record<string, ListStats> = Object.fromEntries(
    (lists || []).map((l) => {
      const items = itemsByList[l.id] || [];
      const total = items.length;
      const completed = items.filter((it) => it.isCompleted).length;
      return [l.id, { total, completed, pending: total - completed } as ListStats];
    }),
  );

  const clearCompletedForList = async (listId: string) => {
    const items = itemsByList[listId] || [];
    const completed = items.filter((it) => it.isCompleted);
    if (completed.length === 0) return;
    await Promise.all(completed.map((it) => deleteShoppingItem(it.id)));
    await queryClient.invalidateQueries({ queryKey: ["shoppingItems", user?.uid, listId] });
  };

  const isLoading = itemsQueries.some((q) => q.isLoading);
  const isFetching = itemsQueries.some((q) => q.isFetching);

  return { itemsByList, statsByList, clearCompletedForList, isLoading, isFetching };
}
