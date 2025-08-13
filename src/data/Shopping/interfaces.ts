// Shopping domain interfaces and shared UI props for the Shopping feature

// Domain models (moved from '@/data/types')
export interface ShoppingItemInterface {
  id: string;
  listId: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price?: number;
  isFavorite: boolean;
  favoriteProductId?: string;
  isCompleted: boolean;
  addedAt: Date;
  completedAt?: Date | null;
  notes?: string;
}

export interface ShoppingListInterface {
  id: string;
  name: string;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  type: "personal" | "shared";
}

export interface FavoriteProductInterface {
  id: string;
  name: string;
  category: string;
  unit: string;
  price?: number;
  brand?: string;
  barcode?: string;
  notes?: string;
  usageCount: number;
  lastUsed: Date;
  userId: string;
}

export interface ShoppingCategoryInterface {
  id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
}

export interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
}

export interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ShoppingHeaderProps {
  name: string;
  stats: { pending: number; completed: number; totalValue: number };
}

export interface ShoppingFiltersProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  categories: ShoppingCategoryInterface[];
}

export interface ShoppingItemsSectionProps {
  items: ShoppingItemInterface[];
  listId: string;
  onAddItem: () => void;
  isFiltered: boolean;
}

export interface ShoppingProgressProps {
  total: number;
  completed: number;
}

export interface ShoppingListPanelProps {
  lists: ShoppingListInterface[];
  currentList: ShoppingListInterface | null;
  onSelectList: (list: ShoppingListInterface) => void;
  onAddList: () => void;
}

export interface ShoppingItemProps {
  item: ShoppingItemInterface;
  listId: string;
}

export interface FavoriteProductsPanelProps {
  products: FavoriteProductInterface[];
  currentListId?: string;
}

// Context types for Shopping feature (moved from '@/data/typesProps')
export interface ShoppingContextProps {
  // Shopping Lists
  shoppingLists: ShoppingListInterface[];
  currentList: ShoppingListInterface | null;
  setCurrentList: (list: ShoppingListInterface | null) => void;

  // Shopping Items
  addItem: (listId: string, item: Omit<ShoppingItemInterface, "id" | "addedAt">) => Promise<void>;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItemInterface>) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
  toggleItemComplete: (listId: string, itemId: string) => Promise<void>;

  // Favorite Products
  favoriteProducts: FavoriteProductInterface[];
  addToFavorites: (product: Omit<FavoriteProductInterface, "id" | "userId">) => Promise<void>;
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
