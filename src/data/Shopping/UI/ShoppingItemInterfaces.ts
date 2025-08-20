// ShoppingItem component interfaces

import type { ShoppingItemInterface } from "../interfaces";

export interface ShoppingItemDisplayProps {
  item: ShoppingItemInterface;
  isFavorited: boolean;
  totalPrice: string | null;
  onToggleComplete: (e: React.MouseEvent) => void;
  onContainerClick: () => void;
  onQuantityChange: (newQuantity: number) => void;
  onEdit: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  favoriteLoading?: boolean;
  deleteLoading?: boolean;
}

export interface ShoppingItemModalActionsProps {
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  favoriteLoading?: boolean;
  deleteLoading?: boolean;
  isMobile?: boolean;
}

export interface EditFormData {
  name: string;
  price: string;
  notes: string;
}

export interface ShoppingItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: EditFormData;
  setEditData: React.Dispatch<React.SetStateAction<EditFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  itemName: string; // For the modal title
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
  favoriteLoading?: boolean;
  deleteLoading?: boolean;
}
