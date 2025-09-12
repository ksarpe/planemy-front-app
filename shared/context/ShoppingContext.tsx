import type { ShoppingListInterface, ShoppingCategoryInterface, ShoppingContextType } from "../data/Shopping";
import { createContext, useEffect, useState } from "react";
import { useShoppingLists } from "@shared/hooks/shopping/useShopping";
import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);
export { ShoppingContext };

export const ShoppingProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useShoppingLists();
  //const { favoriteProducts, loading: favoritesLoading } = useFavoriteProducts();
  const { defaultShoppingListId } = usePreferencesContext();

  const [currentList, setCurrentList] = useState<ShoppingListInterface | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  //const [categories] = useState<ShoppingCategoryInterface[]>(defaultCategories);

  // Set current list based on default preference or first list when lists load
  useEffect(() => {
    if (!data) return;
    if (data.length > 0 && !currentList) {
      // First try to use the default shopping list from preferences
      const defaultList = data.find((list) => list.id === defaultShoppingListId);
      const selectedList = defaultList || data[0];
      setCurrentList(selectedList);

      // if (import.meta.env.DEV) {
      //   console.log("[ShoppingContext] effect: selecting list", {
      //     chosen: selectedList.id,
      //     defaultShoppingListId,
      //     wasDefault: Boolean(defaultList),
      //   });
      // }
    }
  }, [data, currentList, defaultShoppingListId]);

  // Update current list when shoppingLists change (e.g., after adding an item)
  // useEffect(() => {
  //   if (!currentList) return;

  //   if (data!.length === 0) {
  //     setCurrentList(null);
  //     return;
  //   }

  //   const updatedCurrentList = shoppingLists.find((list) => list.id === currentList.id);
  //   if (updatedCurrentList) {
  //     if (JSON.stringify(updatedCurrentList) !== JSON.stringify(currentList)) {
  //       setCurrentList(updatedCurrentList);
  //     }
  //   } else {
  //     // Previously selected list was removed; choose the first available list
  //     setCurrentList(shoppingLists[0] || null);
  //   }
  // }, [shoppingLists, currentList]);

  return (
    <ShoppingContext.Provider
      value={{
        // Shopping Lists
        data,
        currentList,
        setCurrentList,

        // Shopping Items
        // item mutations removed from context

        // Favorite Products
        //favoriteProducts,

        // Categories
        //categories,

        // UI State
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}>
      {children}
    </ShoppingContext.Provider>
  );
};
