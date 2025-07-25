import type { ShoppingItemInterface } from "@/data/types";

export function getSortedShoppingList(items: ShoppingItemInterface[]): ShoppingItemInterface[] {
  return items.sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });
}
