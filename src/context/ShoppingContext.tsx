import { 
  ShoppingListInterface, 
  ShoppingItemInterface, 
  FavoriteProductInterface,
  ShoppingCategoryInterface 
} from "../data/types";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/useToastContext";
import { 
  useShoppingLists, 
  useFavoriteProducts,
  addShoppingList,
  updateShoppingList,
  deleteShoppingList,
  addItemToList,
  updateItemInList,
  removeItemFromList,
  addFavoriteProduct,
  updateFavoriteProduct,
  deleteFavoriteProduct,
  defaultCategories
} from "../firebase/shopping";

interface ShoppingContextType {
  // Shopping Lists
  shoppingLists: ShoppingListInterface[];
  currentList: ShoppingListInterface | null;
  setCurrentList: (list: ShoppingListInterface | null) => void;
  createList: (name: string, description?: string, emoji?: string, color?: string) => Promise<void>;
  updateList: (listId: string, updates: Partial<ShoppingListInterface>) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  
  // Shopping Items
  addItem: (listId: string, item: Omit<ShoppingItemInterface, 'id' | 'addedAt'>) => Promise<void>;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItemInterface>) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
  toggleItemComplete: (listId: string, itemId: string) => Promise<void>;
  
  // Favorite Products
  favoriteProducts: FavoriteProductInterface[];
  addToFavorites: (product: Omit<FavoriteProductInterface, 'id' | 'userId'>) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  addFavoriteToList: (listId: string, product: FavoriteProductInterface, quantity?: number) => Promise<void>;
  
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
  const { user } = useAuth();
  const { showToast } = useToast();
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
    if (currentList && shoppingLists.length > 0) {
      const updatedCurrentList = shoppingLists.find(list => list.id === currentList.id);
      if (updatedCurrentList && JSON.stringify(updatedCurrentList) !== JSON.stringify(currentList)) {
        setCurrentList(updatedCurrentList);
      }
    }
  }, [shoppingLists, currentList]);

  // Shopping Lists Operations
  const createList = async (name: string, description?: string, emoji?: string, color?: string) => {
    if (!user?.uid) {
      showToast("error", "Musisz być zalogowany, aby utworzyć listę");
      return;
    }

    try {
      const newList: Omit<ShoppingListInterface, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        description,
        emoji: emoji || "📝",
        items: [],
        isShared: false,
        userId: user.uid,
        type: "personal",
        color: color || "#3B82F6",
      };

      await addShoppingList(newList);
      showToast("success", "Lista została utworzona");
    } catch (error) {
      console.error("Error creating list:", error);
      showToast("error", "Błąd podczas tworzenia listy");
    }
  };

  const updateList = async (listId: string, updates: Partial<ShoppingListInterface>) => {
    try {
      await updateShoppingList(listId, updates);
      showToast("success", "Lista została zaktualizowana");
    } catch (error) {
      console.error("Error updating list:", error);
      showToast("error", "Błąd podczas aktualizacji listy");
    }
  };

  const deleteList = async (listId: string) => {
    try {
      await deleteShoppingList(listId);
      if (currentList?.id === listId) {
        setCurrentList(shoppingLists.find(list => list.id !== listId) || null);
      }
      showToast("success", "Lista została usunięta");
    } catch (error) {
      console.error("Error deleting list:", error);
      showToast("error", "Błąd podczas usuwania listy");
    }
  };

  // Shopping Items Operations
  const addItem = async (listId: string, item: Omit<ShoppingItemInterface, 'id' | 'addedAt'>) => {
    if (!user?.uid) {
      showToast("error", "Musisz być zalogowany");
      return;
    }

    try {
      await addItemToList(listId, item, user.uid);
      showToast("success", "Produkt został dodany");
    } catch (error) {
      console.error("Error adding item:", error);
      showToast("error", "Błąd podczas dodawania produktu");
    }
  };

  const updateItem = async (listId: string, itemId: string, updates: Partial<ShoppingItemInterface>) => {
    if (!user?.uid) return;

    try {
      await updateItemInList(listId, itemId, updates, user.uid);
    } catch (error) {
      console.error("Error updating item:", error);
      showToast("error", "Błąd podczas aktualizacji produktu");
    }
  };

  const removeItem = async (listId: string, itemId: string) => {
    if (!user?.uid) return;

    try {
      await removeItemFromList(listId, itemId, user.uid);
      showToast("success", "Produkt został usunięty");
    } catch (error) {
      console.error("Error removing item:", error);
      showToast("error", "Błąd podczas usuwania produktu");
    }
  };

  const toggleItemComplete = async (listId: string, itemId: string) => {
    if (!user?.uid) return;

    try {
      const list = shoppingLists.find(l => l.id === listId);
      const item = list?.items.find(i => i.id === itemId);
      
      if (item) {
        const updateData: Partial<ShoppingItemInterface> = {
          isCompleted: !item.isCompleted
        };
        
        if (!item.isCompleted) {
          updateData.completedAt = new Date();
        } else {
          // Remove completedAt field when uncompleting item
          updateData.completedAt = null;
        }
        
        await updateItemInList(listId, itemId, updateData, user.uid);
      }
    } catch (error) {
      console.error("Error toggling item completion:", error);
      showToast("error", "Błąd podczas zmiany statusu produktu");
    }
  };

  // Favorite Products Operations
  const addToFavorites = async (product: Omit<FavoriteProductInterface, 'id' | 'userId'>) => {
    if (!user?.uid) {
      showToast("error", "Musisz być zalogowany");
      return;
    }

    try {
      const productWithUserId = {
        ...product,
        userId: user.uid
      };
      
      await addFavoriteProduct(productWithUserId);
      showToast("success", "Produkt dodany do ulubionych");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      showToast("error", "Błąd podczas dodawania do ulubionych");
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      await deleteFavoriteProduct(productId);
      showToast("success", "Produkt usunięty z ulubionych");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      showToast("error", "Błąd podczas usuwania z ulubionych");
    }
  };

  const addFavoriteToList = async (listId: string, product: FavoriteProductInterface, quantity = 1) => {
    if (!user?.uid) return;

    const newItem: Omit<ShoppingItemInterface, 'id' | 'addedAt'> = {
      name: product.name,
      quantity,
      unit: product.unit,
      category: product.category,
      price: product.price,
      isFavorite: true,
      isCompleted: false,
      notes: product.notes,
    };

    try {
      await addItemToList(listId, newItem, user.uid);
      
      // Update usage count for favorite product
      await updateFavoriteProduct(product.id, {
        usageCount: product.usageCount + 1,
        lastUsed: new Date()
      });
      
      showToast("success", "Ulubiony produkt dodany do listy");
    } catch (error) {
      console.error("Error adding favorite to list:", error);
      showToast("error", "Błąd podczas dodawania ulubionego produktu");
    }
  };

  return (
    <ShoppingContext.Provider
      value={{
        // Shopping Lists
        shoppingLists,
        currentList,
        setCurrentList,
        createList,
        updateList,
        deleteList,
        
        // Shopping Items
        addItem,
        updateItem,
        removeItem,
        toggleItemComplete,
        
        // Favorite Products
        favoriteProducts,
        addToFavorites,
        removeFromFavorites,
        addFavoriteToList,
        
        // Categories
        categories,
        
        // UI State
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};
