import type { ShoppingItemModalActionsProps } from "@shared/data/Shopping/UI/ShoppingItemInterfaces";
import { Heart, Trash2 } from "lucide-react";

export function ShoppingItemModalActions({
  isFavorited,
  onToggleFavorite,
  onDelete,
  favoriteLoading = false,
  deleteLoading = false,
}: ShoppingItemModalActionsProps) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={onToggleFavorite}
        disabled={favoriteLoading}
        className={`p-2 rounded-2xl transition-colors disabled:opacity-50 ${
          isFavorited ? "text-yellow-600 hover:text-gray-400 " : "text-gray-400 hover:text-yellow-500 "
        }`}
        title={isFavorited ? "Usuń z ulubionych" : "Dodaj do ulubionych"}>
        <Heart size={24} fill={isFavorited ? "currentColor" : "none"} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleteLoading}
        className="p-2 rounded-2xl text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
        title="Usuń">
        <Trash2 size={24} />
      </button>
    </div>
  );
}
