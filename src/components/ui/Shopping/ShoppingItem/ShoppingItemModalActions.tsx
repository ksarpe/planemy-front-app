import { Heart, Trash2 } from "lucide-react";
import type { ShoppingItemModalActionsProps } from "@/data/Shopping/UI/ShoppingItemInterfaces";

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
        className={`p-2 rounded-md transition-colors disabled:opacity-50 ${
          isFavorited ? "text-yellow-600 hover:text-gray-400 " : "text-gray-400 hover:text-yellow-500 "
        }`}
        title={isFavorited ? "Usuń z ulubionych" : "Dodaj do ulubionych"}>
        <Heart size={24} fill={isFavorited ? "currentColor" : "none"} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        disabled={deleteLoading}
        className="p-2 rounded-md text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
        title="Usuń">
        <Trash2 size={24} />
      </button>
    </div>
  );
}
