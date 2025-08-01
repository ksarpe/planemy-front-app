import React, { useState } from "react";
import { useShoppingContext } from "../../../hooks/context/useShoppingContext";
import { X, Plus, Star } from "lucide-react";
import { FavoriteProductInterface } from "../../../data/types";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
}

const units = ["szt", "kg", "g", "l", "ml", "opak.", "puszka", "butelka"];

function AddItemModal({ isOpen, onClose, listId }: AddItemModalProps) {
  const { addItem, categories, favoriteProducts } = useShoppingContext();
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    unit: "szt",
    category: "Inne",
    priority: "medium" as "low" | "medium" | "high",
    estimatedPrice: 0,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const newItem = {
        name: formData.name.trim(),
        quantity: formData.quantity,
        unit: formData.unit,
        category: formData.category,
        price: formData.estimatedPrice,
        isFavorite: false,
        isCompleted: false,
        notes: formData.notes,
      };

      await addItem(listId, newItem);

      // Do not automatically add to favorites - only when explicitly requested
      // Reset form and close modal
      setFormData({
        name: "",
        quantity: 1,
        unit: "szt",
        category: "Inne",
        priority: "medium",
        estimatedPrice: 0,
        notes: "",
      });

      onClose();
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      quantity: 1,
      unit: "szt",
      category: "Inne",
      priority: "medium",
      estimatedPrice: 0,
      notes: "",
    });
    onClose();
  };

  const handleFavoriteSelect = (favorite: FavoriteProductInterface) => {
    setFormData({
      ...formData,
      name: favorite.name,
      category: favorite.category,
      unit: favorite.unit,
      estimatedPrice: favorite.price || 0,
    });
  };

  const priorityColors = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-red-100 text-red-700 border-red-200",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Dodaj przedmiot</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {favoriteProducts.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700">Ulubione produkty:</h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {favoriteProducts.slice(0, 5).map((favorite) => (
                <button
                  key={favorite.id}
                  onClick={() => handleFavoriteSelect(favorite)}
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded flex items-center gap-2">
                  <Star size={12} className="text-yellow-500" />
                  <span>{favorite.name}</span>
                  <span className="text-gray-500">({favorite.unit})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa produktu</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Wprowadź nazwę produktu"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ilość</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 1 })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jednostka</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorytet</label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    formData.priority === priority
                      ? priorityColors[priority]
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}>
                  {priority === "low" ? "Niski" : priority === "medium" ? "Średni" : "Wysoki"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Szacowana cena (zł)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.estimatedPrice}
              onChange={(e) => setFormData({ ...formData, estimatedPrice: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notatki (opcjonalne)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Dodatkowe informacje..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Plus size={16} />
              {isSubmitting ? "Dodawanie..." : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { AddItemModal };
