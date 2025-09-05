// Shopping feature component interfaces

import type {
  ShoppingItemInterface,
  ShoppingListInterface,
  ShoppingCategoryInterface,
  FavoriteProductInterface,
} from "../interfaces";

export interface ShoppingHeaderProps {
  name: string;
  stats: { pending: number; completed: number; totalValue: number };
}

export interface ExtendedShoppingHeaderProps extends ShoppingHeaderProps {
  onToggleLists?: () => void;
  listsOpen?: boolean;
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

export interface FavoriteProductsPanelProps {
  products: FavoriteProductInterface[];
  currentListId?: string;
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
