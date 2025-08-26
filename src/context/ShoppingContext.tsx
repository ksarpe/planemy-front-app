import type { ShoppingListInterface, ShoppingCategoryInterface, ShoppingContextType } from "@/data/Shopping";
import { createContext, useEffect, useState } from "react";
import { useShoppingLists, useFavoriteProducts, defaultCategories } from "../api/shopping";

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);
export { ShoppingContext };

export const ShoppingProvider = ({ children }: { children: React.ReactNode }) => {
  const { shoppingLists, loading: listsLoading } = useShoppingLists();
  const { favoriteProducts, loading: favoritesLoading } = useFavoriteProducts();

  const [currentList, setCurrentList] = useState<ShoppingListInterface | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories] = useState<ShoppingCategoryInterface[]>(defaultCategories);

  const loading = listsLoading || favoritesLoading;

  // Set first list as current when lists load
  useEffect(() => {
    if (shoppingLists.length > 0 && !currentList) {
      setCurrentList(shoppingLists[0]);
    }
  }, [shoppingLists, currentList]);

  // Update current list when shoppingLists change (e.g., after adding an item)
  useEffect(() => {
    if (!currentList) return;

    if (shoppingLists.length === 0) {
      setCurrentList(null);
      return;
    }

    const updatedCurrentList = shoppingLists.find((list) => list.id === currentList.id);
    if (updatedCurrentList) {
      if (JSON.stringify(updatedCurrentList) !== JSON.stringify(currentList)) {
        setCurrentList(updatedCurrentList);
      }
    } else {
      // Previously selected list was removed; choose the first available list
      setCurrentList(shoppingLists[0] || null);
    }
  }, [shoppingLists, currentList]);

  return (
    <ShoppingContext.Provider
      value={{
        // Shopping Lists
        shoppingLists,
        currentList,
        setCurrentList,

        // Shopping Items
        // item mutations removed from context

        // Favorite Products
        favoriteProducts,

        // Categories
        categories,

        // UI State
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}>
      {children}
    </ShoppingContext.Provider>
  );
};
