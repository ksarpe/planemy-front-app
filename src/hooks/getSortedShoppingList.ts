import type { ShoppingItemInterface } from "@/data/types";

export function getSortedShoppingList(items: ShoppingItemInterface[]): ShoppingItemInterface[] {
  return items.sort((a, b) => {
    if (a.bought === b.bought) return 0;
    return a.bought ? 1 : -1;
  });
}
