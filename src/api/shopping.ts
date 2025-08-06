import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { deleteAllPermissionsForObject } from "./permissions";
import { removeAllLabelConnectionsForObject } from "./labels";
import {
  ShoppingListInterface,
  ShoppingItemInterface,
  FavoriteProductInterface,
  ShoppingCategoryInterface,
} from "../data/types";
import { useAuthContext } from "../hooks/context/useAuthContext";
import { useState, useEffect } from "react";

// Default categories
export const defaultCategories: ShoppingCategoryInterface[] = [
  { id: "1", name: "Owoce i warzywa", emoji: "🥕", color: "#10B981", order: 1 },
  { id: "2", name: "Mięso i ryby", emoji: "🥩", color: "#EF4444", order: 2 },
  { id: "3", name: "Nabiał", emoji: "🥛", color: "#F59E0B", order: 3 },
  { id: "4", name: "Pieczywo", emoji: "🍞", color: "#D97706", order: 4 },
  { id: "5", name: "Napoje", emoji: "🥤", color: "#3B82F6", order: 5 },
  { id: "6", name: "Słodycze", emoji: "🍫", color: "#8B5CF6", order: 6 },
  { id: "7", name: "Chemia", emoji: "🧽", color: "#6B7280", order: 7 },
  { id: "8", name: "Kosmetyki", emoji: "💄", color: "#EC4899", order: 8 },
  { id: "9", name: "Dom i ogród", emoji: "🏠", color: "#84CC16", order: 9 },
  { id: "10", name: "Inne", emoji: "📦", color: "#6B7280", order: 10 },
];

// Shopping Lists CRUD Operations
export const addShoppingList = async (listData: Omit<ShoppingListInterface, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "shoppingLists"), {
      ...listData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding shopping list:", error);
    throw error;
  }
};

export const updateShoppingList = async (listId: string, updates: Partial<ShoppingListInterface>) => {
  try {
    const listRef = doc(db, "shoppingLists", listId);
    await updateDoc(listRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating shopping list:", error);
    throw error;
  }
};

export const deleteShoppingList = async (listId: string, userId: string) => {
  try {
    // Step 1: Delete all permissions/shares for this shopping list
    await deleteAllPermissionsForObject(listId, "shopping_list");

    // Step 2: Remove all label connections for the shopping list itself (if labels are supported in future)
    await removeAllLabelConnectionsForObject(userId, listId, "shopping_list");

    // Step 3: Delete the shopping list (this will also remove its items automatically due to Firestore structure)
    await deleteDoc(doc(db, "shoppingLists", listId));

    console.log(`Successfully deleted shopping list ${listId} with all its permissions`);
  } catch (error) {
    console.error("Error deleting shopping list:", error);
    throw error;
  }
};

// Shopping Items Operations
export const addItemToList = async (
  listId: string,
  item: Omit<ShoppingItemInterface, "id" | "addedAt">,
  userId: string,
) => {
  try {
    // Generate new item with ID
    const newItem: ShoppingItemInterface = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date(),
    };

    // Get current list
    const lists = await getUserShoppingLists(userId);
    const currentList = lists.find((list) => list.id === listId);

    if (currentList) {
      const updatedItems = [...currentList.items, newItem];
      await updateShoppingList(listId, { items: updatedItems });
    }

    return newItem.id;
  } catch (error) {
    console.error("Error adding item to list:", error);
    throw error;
  }
};

export const updateItemInList = async (
  listId: string,
  itemId: string,
  updates: Partial<ShoppingItemInterface>,
  userId: string,
) => {
  try {
    const lists = await getUserShoppingLists(userId);
    const currentList = lists.find((list) => list.id === listId);

    if (currentList) {
      const updatedItems = currentList.items.map((item) =>
        item.id === itemId
          ? { ...item, ...updates, ...(updates.isCompleted ? { completedAt: new Date() } : {}) }
          : item,
      );
      await updateShoppingList(listId, { items: updatedItems });
    }
  } catch (error) {
    console.error("Error updating item in list:", error);
    throw error;
  }
};

export const removeItemFromList = async (listId: string, itemId: string, userId: string) => {
  try {
    const lists = await getUserShoppingLists(userId);
    const currentList = lists.find((list) => list.id === listId);

    if (currentList) {
      const updatedItems = currentList.items.filter((item) => item.id !== itemId);
      await updateShoppingList(listId, { items: updatedItems });
    }
  } catch (error) {
    console.error("Error removing item from list:", error);
    throw error;
  }
};

// Favorite Products CRUD Operations
export const addFavoriteProduct = async (product: Omit<FavoriteProductInterface, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "favoriteProducts"), product);
    return docRef.id;
  } catch (error) {
    console.error("Error adding favorite product:", error);
    throw error;
  }
};

export const updateFavoriteProduct = async (productId: string, updates: Partial<FavoriteProductInterface>) => {
  try {
    const productRef = doc(db, "favoriteProducts", productId);
    await updateDoc(productRef, updates);
  } catch (error) {
    console.error("Error updating favorite product:", error);
    throw error;
  }
};

export const deleteFavoriteProduct = async (productId: string) => {
  try {
    await deleteDoc(doc(db, "favoriteProducts", productId));
  } catch (error) {
    console.error("Error deleting favorite product:", error);
    throw error;
  }
};

// Data Fetching Functions
export const getUserShoppingLists = async (userId: string): Promise<ShoppingListInterface[]> => {
  try {
    const q = query(collection(db, "shoppingLists"), where("userId", "==", userId), orderBy("updatedAt", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as ShoppingListInterface),
    );
  } catch (error) {
    console.error("Error getting shopping lists:", error);
    return [];
  }
};

export const getUserFavoriteProducts = async (userId: string): Promise<FavoriteProductInterface[]> => {
  try {
    const q = query(collection(db, "favoriteProducts"), where("userId", "==", userId), orderBy("usageCount", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FavoriteProductInterface),
    );
  } catch (error) {
    console.error("Error getting favorite products:", error);
    return [];
  }
};

// Real-time hooks
export const useShoppingLists = () => {
  const { user } = useAuthContext();
  const [shoppingLists, setShoppingLists] = useState<ShoppingListInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setShoppingLists([]);
      setLoading(false);
      return;
    }

    // Try without orderBy first to see if it's an index issue
    const q = query(collection(db, "shoppingLists"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const lists = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            items:
              doc.data().items?.map((item: ShoppingItemInterface) => ({
                ...item,
                // addedAt:
                //   item.addedAt instanceof Date
                //     ? item.addedAt
                //     : item.addedAt?.toDate
                //     ? item.addedAt.toDate()
                //     : new Date(item.addedAt),
                // completedAt: item.completedAt
                //   ? item.completedAt instanceof Date
                //     ? item.completedAt
                //     : item.completedAt?.toDate
                //     ? item.completedAt.toDate()
                //     : new Date(item.completedAt)
                //   : "",
              })) || [],
          } as ShoppingListInterface;
        });

        setShoppingLists(lists);
        setLoading(false);
      },
      (error) => {
        console.error("Error in shopping lists listener:", error);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  return { shoppingLists, loading };
};

export const useFavoriteProducts = () => {
  const { user } = useAuthContext();
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProductInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    // Try without orderBy first to see if it's an index issue
    const q = query(collection(db, "favoriteProducts"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const products = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            lastUsed: doc.data().lastUsed?.toDate() || new Date(),
          } as FavoriteProductInterface;
        });

        setFavoriteProducts(products);
        setLoading(false);
      },
      (error) => {
        console.error("Error in favorite products listener:", error);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  return { favoriteProducts, loading };
};
