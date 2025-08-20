import { Heart, Edit2, Trash2 } from "lucide-react";
import type { ShoppingItemModalActionsProps } from "@/data/Shopping/UI/ShoppingItemInterfaces";

export function ShoppingItemModalActions({
  isFavorited,
  onToggleFavorite,
  onEdit,
  onDelete,
  favoriteLoading = false,
  deleteLoading = false,
  isMobile = false,
}: ShoppingItemModalActionsProps) {
  if (isMobile) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onToggleFavorite}
          disabled={favoriteLoading}
          className={`px-3 py-2 text-sm rounded-md border transition-colors disabled:opacity-50 ${
            isFavorited
              ? "border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}>
          {isFavorited ? "Usuń ★" : "Ulubione ★"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleteLoading}
          className="px-3 py-2 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
          Usuń
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={onToggleFavorite}
        disabled={favoriteLoading}
        className={`p-2 rounded-md transition-colors disabled:opacity-50 ${
          isFavorited
            ? "text-yellow-600 hover:text-gray-400 hover:bg-gray-50"
            : "text-gray-400 hover:text-yellow-500 hover:bg-gray-50"
        }`}
        title={isFavorited ? "Usuń z ulubionych" : "Dodaj do ulubionych"}>
        <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
      </button>
      <button
        onClick={onEdit}
        className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-50 transition-colors"
        title="Edytuj">
        <Edit2 size={16} />
      </button>
      <button
        onClick={onDelete}
        disabled={deleteLoading}
        className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        title="Usuń">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
