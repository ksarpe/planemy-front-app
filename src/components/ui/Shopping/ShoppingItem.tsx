import { useEffect, useState } from "react";
import type { ShoppingItemInterface } from "@/data/Shopping/interfaces";
import {
  useUpdateShoppingItem,
  useRemoveShoppingItem,
  useToggleShoppingItemComplete,
  useAddFavoriteProduct,
  useFavoriteProductsQuery,
  useDeleteFavoriteProduct,
} from "@/hooks/shopping/useShoppingItems";
import { Check, Edit2, Trash2, Star, Plus, Minus, Heart } from "lucide-react";
import type { ShoppingItemProps } from "@/data/Shopping/interfaces";

function ShoppingItem({ item, listId }: ShoppingItemProps) {
  const addFavoriteProduct = useAddFavoriteProduct();
  const { data: favorites } = useFavoriteProductsQuery();
  const deleteFavorite = useDeleteFavoriteProduct();
  const updateItem = useUpdateShoppingItem();
  const removeItem = useRemoveShoppingItem();
  const toggleItemComplete = useToggleShoppingItemComplete();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    quantity: item.quantity,
    price: item.price?.toString() || "",
    notes: item.notes || "",
  });

  // If server favorites no longer include this item, clear local isFavorite flag for consistency
  useEffect(() => {
    if (!favorites) return;
    const stillFavorite = favorites.some(
      (p) => p.name === item.name && p.unit === item.unit && p.category === item.category,
    );
    if (!stillFavorite && item.isFavorite) {
      updateItem.mutate({ listId, itemId: item.id, updates: { isFavorite: false, favoriteProductId: "" } });
    }
  }, [favorites, item.name, item.unit, item.category, item.isFavorite, listId, item.id, updateItem]);

  const handleToggleComplete = () => {
    console.log(listId, item.id);
    toggleItemComplete.mutate({ listId, itemId: item.id, isCompleted: !item.isCompleted });
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate({ listId, itemId: item.id, updates: { quantity: newQuantity } });
  };

  const handleSaveEdit = async () => {
    const updateData: Partial<ShoppingItemInterface> = {
      name: editData.name.trim(),
      quantity: editData.quantity,
    };

    if (editData.price && parseFloat(editData.price) > 0) {
      updateData.price = parseFloat(editData.price);
    }

    if (editData.notes.trim()) {
      updateData.notes = editData.notes.trim();
    }

    await updateItem.mutateAsync({ listId, itemId: item.id, updates: updateData });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: item.name,
      quantity: item.quantity,
      price: item.price?.toString() || "",
      notes: item.notes || "",
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
      removeItem.mutate({ listId, itemId: item.id });
    }
  };

  const handleAddToFavorites = () => {
    // Guard against duplicate add if already favorited (derived) or mutation in-flight
    if (isFavorited || addFavoriteProduct.isPending) return;
    addFavoriteProduct.mutate(
      {
        name: item.name,
        category: item.category,
        unit: item.unit,
        price: item.price,
        notes: item.notes,
        usageCount: 1,
        lastUsed: new Date(),
      },
      {
        onSuccess: (newId) => {
          // Persist mapping for future reliable removal
          updateItem.mutate({ listId, itemId: item.id, updates: { isFavorite: true, favoriteProductId: newId } });
        },
      },
    );
    // Optimistic local feedback while mutation runs
    updateItem.mutate({ listId, itemId: item.id, updates: { isFavorite: true } });
  };

  const matchedFavorite = favorites?.find(
    (p) => p.name === item.name && p.unit === item.unit && p.category === item.category,
  );
  // Derive from server truth to ensure un-favorite clears immediately, while keeping add UX instant
  const isFavorited = Boolean(matchedFavorite || addFavoriteProduct.isPending);

  const handleRemoveFromFavorites = async () => {
    // Prefer exact ID if we have it, otherwise fall back to matching by fields
    if (item.favoriteProductId) {
      await deleteFavorite.mutateAsync(item.favoriteProductId);
    } else {
      const matches = (favorites || []).filter(
        (p) => p.name === item.name && p.unit === item.unit && p.category === item.category,
      );
      for (const p of matches) {
        await deleteFavorite.mutateAsync(p.id);
      }
    }
    // Optimistically mark this item as not favorite and clear mapping
    updateItem.mutate({ listId, itemId: item.id, updates: { isFavorite: false, favoriteProductId: "" } });
  };

  const getCategoryEmoji = (category: string) => {
    const categoryMap: Record<string, string> = {
      "Owoce i warzywa": "🥕",
      "Mięso i ryby": "🥩",
      Nabiał: "🥛",
      Pieczywo: "🍞",
      Napoje: "🥤",
      Słodycze: "🍫",
      Chemia: "🧽",
      Kosmetyki: "💄",
      "Dom i ogród": "🏠",
      Inne: "📦",
    };
    return categoryMap[category] || "📦";
  };

  const formatPrice = () => {
    if (!item.price) return null;
    const total = item.price * item.quantity;
    return `${total.toFixed(2)} zł`;
  };

  // List view
  return (
    <div
      className={`p-3 rounded-md border transition-all ${
        item.isCompleted ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={editData.quantity}
              onChange={(e) => setEditData((prev) => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              min="1"
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="0.01"
              value={editData.price}
              onChange={(e) => setEditData((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="Cena"
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-1">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">
                ✓
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600">
                ✗
              </button>
            </div>
          </div>
          <textarea
            value={editData.notes}
            onChange={(e) => setEditData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Notatki..."
            rows={2}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleComplete}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
              item.isCompleted ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-green-500"
            }`}>
            {item.isCompleted && <Check size={12} />}
          </button>

          <span className="text-lg flex-shrink-0">{getCategoryEmoji(item.category)}</span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium text-sm ${item.isCompleted ? "line-through opacity-60" : ""}`}>
                {item.name}
              </h4>
              {isFavorited && <Heart size={12} className="text-yellow-500" />}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50">
                  <Minus size={10} />
                </button>
                <span className="font-medium">
                  {item.quantity} {item.unit}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                  <Plus size={10} />
                </button>
              </div>

              {item.price && <span className="font-medium whitespace-nowrap">{formatPrice()}</span>}

              <span className="bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap text-[11px] sm:text-xs">
                {item.category}
              </span>
            </div>

            {item.notes && <div className="text-xs text-gray-400 mt-1 italic">{item.notes}</div>}
          </div>

          <div className="flex gap-1 flex-shrink-0 ml-2 sm:ml-3">
            {!isFavorited ? (
              <button
                onClick={handleAddToFavorites}
                disabled={addFavoriteProduct.isPending}
                className="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors disabled:opacity-50"
                title="Dodaj do ulubionych">
                <Star size={14} />
              </button>
            ) : (
              <button
                onClick={handleRemoveFromFavorites}
                disabled={deleteFavorite.isPending}
                className="p-1.5 text-yellow-500 hover:text-gray-400 transition-colors disabled:opacity-50"
                title="Usuń z ulubionych">
                <Star size={14} fill="currentColor" />
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
              title="Edytuj">
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Usuń">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { ShoppingItem };
