import { useState } from "react";
import { ShoppingItemInterface } from "../../../data/types";
import { useShoppingContext } from "../../../hooks/useShoppingContext";
import { Check, Edit2, Trash2, Star, Plus, Minus, Heart } from "lucide-react";

interface ShoppingItemProps {
  item: ShoppingItemInterface;
  listId: string;
  viewMode: "grid" | "list";
}

function ShoppingItem({ item, listId, viewMode }: ShoppingItemProps) {
  const { updateItem, removeItem, toggleItemComplete, addToFavorites } = useShoppingContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    quantity: item.quantity,
    price: item.price?.toString() || "",
    notes: item.notes || "",
  });

  const handleToggleComplete = () => {
    console.log(listId, item.id);
    toggleItemComplete(listId, item.id);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem(listId, item.id, { quantity: newQuantity });
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

    await updateItem(listId, item.id, updateData);
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
      removeItem(listId, item.id);
    }
  };

  const handleAddToFavorites = async () => {
    await addToFavorites({
      name: item.name,
      category: item.category,
      unit: item.unit,
      price: item.price,
      notes: item.notes,
      usageCount: 1,
      lastUsed: new Date(),
    });
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

  if (viewMode === "grid") {
    return (
      <div
        className={`p-4 rounded-lg border-2 transition-all ${
          item.isCompleted ? "border-green-200 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
        }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleComplete}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                item.isCompleted ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-green-500"
              }`}>
              {item.isCompleted && <Check size={12} />}
            </button>
            <span className="text-lg">{getCategoryEmoji(item.category)}</span>
          </div>

          <div className="flex gap-1">
            {!item.isFavorite && (
              <button
                onClick={handleAddToFavorites}
                className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                title="Dodaj do ulubionych">
                <Star size={14} />
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              title="Edytuj">
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Usuń">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className={item.isCompleted ? "opacity-60" : ""}>
          <h4 className={`font-medium mb-2 ${item.isCompleted ? "line-through" : ""}`}>{item.name}</h4>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ilość:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  disabled={item.quantity <= 1}>
                  <Minus size={12} />
                </button>
                <span className="font-medium">
                  {item.quantity} {item.unit}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {item.price && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cena:</span>
                <span className="font-medium">{formatPrice()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Kategoria:</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.category}</span>
            </div>
          </div>

          {item.notes && <div className="mt-2 text-xs text-gray-500 italic">{item.notes}</div>}
        </div>

        {item.isFavorite && (
          <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
            <Heart size={12} />
            <span>Ulubiony</span>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
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
              {item.isFavorite && <Heart size={12} className="text-yellow-500" />}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
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

              {item.price && <span className="font-medium">{formatPrice()}</span>}

              <span className="bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
            </div>

            {item.notes && <div className="text-xs text-gray-400 mt-1 italic">{item.notes}</div>}
          </div>

          <div className="flex gap-1 flex-shrink-0">
            {!item.isFavorite && (
              <button
                onClick={handleAddToFavorites}
                className="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors"
                title="Dodaj do ulubionych">
                <Star size={14} />
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
