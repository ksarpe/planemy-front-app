import type {
  ShoppingListInterface,
  FavoriteProductInterface,
  ShoppingCategoryInterface,
} from "@/data/Shopping/interfaces";
import { createContext, useEffect, useState } from "react";
import { useShoppingLists, useFavoriteProducts, defaultCategories } from "../api/shopping";

interface ShoppingContextType {
  // Shopping Lists (no CRUD here anymore)
  shoppingLists: ShoppingListInterface[];
  currentList: ShoppingListInterface | null;
  setCurrentList: (list: ShoppingListInterface | null) => void;

  // Shopping Items
  // moved to hooks in '@/hooks/shopping'

  // Favorite Products
  favoriteProducts: FavoriteProductInterface[];

  // Categories
  categories: ShoppingCategoryInterface[];

  // UI State
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

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
