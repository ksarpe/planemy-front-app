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
import { SHOPPING_UNITS } from "@/data/Shopping/types";
import { motion } from "framer-motion";

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
    quantity: item.quantity.toString(),
    unit: item.unit,
    price: item.price?.toString() || "",
    notes: item.notes || "",
  });

  const totalPrice = item.price ? (item.price * item.quantity).toFixed(2) + " zł" : null;

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
    const parsedQty = parseFloat(editData.quantity.replace(",", "."));
    const safeQty = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : item.quantity;
    const updateData: Partial<ShoppingItemInterface> = {
      name: editData.name.trim(),
      quantity: safeQty,
      unit: editData.unit || item.unit,
    };
    if (editData.price && parseFloat(editData.price) > 0) {
      updateData.price = parseFloat(editData.price);
    }
    // } else {
    //   updateData.price = undefined; // nie nadpisuj na 0
    // }
    updateData.notes = editData.notes.trim() || "";

    await updateItem.mutateAsync({ listId, itemId: item.id, updates: updateData });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
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

  // List view
  return (
    <motion.div
      layout
      className={[
        "group p-3 md:p-4 rounded-xl border transition-all",
        item.isCompleted
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
      ].join(" ")}>
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEdit();
          }}
          className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <input
              autoFocus
              type="text"
              value={editData.name}
              onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nazwa"
              className="col-span-12 md:col-span-6 min-w-0 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <div className="col-span-12 md:col-span-6 grid grid-cols-6 gap-2">
              <div className="relative col-span-2">
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={editData.quantity}
                  onChange={(e) => setEditData((p) => ({ ...p, quantity: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm"
                  aria-label="Ilość"
                />
              </div>
              <select
                value={editData.unit}
                onChange={(e) => setEditData((p) => ({ ...p, unit: e.target.value }))}
                className="col-span-2 px-2 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700"
                aria-label="Jednostka">
                {SHOPPING_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <div className="relative col-span-2">
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={editData.price}
                  onChange={(e) => setEditData((p) => ({ ...p, price: e.target.value }))}
                  placeholder="Cena"
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm"
                  aria-label="Cena"
                />
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-gray-500">
                  zł
                </span>
              </div>
            </div>
          </div>

          <textarea
            value={editData.notes}
            onChange={(e) => setEditData((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Notatki (opcjonalne)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
          />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Anuluj
            </button>
            <button type="submit" className="px-3 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary-hover">
              Zapisz
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            className={[
              "mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
              item.isCompleted ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-green-500",
            ].join(" ")}
            aria-label={item.isCompleted ? "Odznacz" : "Zaznacz"}>
            {item.isCompleted && <Check size={12} />}
          </button>

          {/* Emoji kategorii */}
          <span className="mt-0.5 text-xl flex-shrink-0">{getCategoryEmoji(item.category)}</span>

          {/* Center: tytuł + meta */}
          <div className="flex-1 min-w-0">
            {/* Wiersz tytułu */}
            <div className="flex items-center gap-2">
              <h4
                className={[
                  "truncate",
                  "font-semibold",
                  "text-base md:text-lg",
                  item.isCompleted ? "line-through text-gray-500" : "text-gray-900",
                ].join(" ")}
                title={item.name}>
                {item.name}
              </h4>
              {isFavorited && <Heart size={14} className="text-yellow-500 flex-shrink-0" />}
            </div>

            {/* Wiersz meta: ilość, jednostka, kategoria, notatki */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <QtyStepper
                value={item.quantity}
                onDec={() => handleUpdateQuantity(item.quantity - 1)}
                onInc={() => handleUpdateQuantity(item.quantity + 1)}
                disabledDec={item.quantity <= 1}
              />
              <span className="text-gray-700">{item.unit}</span>
              {item.notes && <span className="text-gray-500 italic line-clamp-1">{item.notes}</span>}
            </div>
          </div>

          {/* Prawa kolumna: cena + akcje */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-1">
            {totalPrice && (
              <div
                className={[
                  "text-sm md:text-base font-semibold",
                  item.isCompleted ? "text-gray-500" : "text-gray-900",
                ].join(" ")}>
                {totalPrice}
              </div>
            )}

            <div className="flex gap-1">
              {!isFavorited ? (
                <button
                  onClick={handleAddToFavorites}
                  disabled={addFavoriteProduct.isPending}
                  className="p-2 rounded-md text-gray-400 hover:text-yellow-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title="Dodaj do ulubionych">
                  <Star size={16} />
                </button>
              ) : (
                <button
                  onClick={handleRemoveFromFavorites}
                  disabled={deleteFavorite.isPending}
                  className="p-2 rounded-md text-yellow-600 hover:text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title="Usuń z ulubionych">
                  <Star size={16} fill="currentColor" />
                </button>
              )}

              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                title="Edytuj">
                <Edit2 size={16} />
              </button>

              <button
                onClick={handleDelete}
                className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-gray-50 transition-colors"
                title="Usuń">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Helper: ładniejszy stepper
function QtyStepper({
  value,
  onDec,
  onInc,
  disabledDec,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
  disabledDec?: boolean;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-gray-300 bg-white overflow-hidden">
      <button
        onClick={onDec}
        disabled={disabledDec}
        className="h-7 w-7 flex items-center justify-center hover:bg-red-100 disabled:opacity-40"
        aria-label="Zmniejsz">
        <Minus size={14} />
      </button>
      <span className="px-2 text-sm font-medium tabular-nums">{value}</span>
      <button
        onClick={onInc}
        className="h-7 w-7 flex items-center justify-center hover:bg-green-100"
        aria-label="Zwiększ">
        <Plus size={14} />
      </button>
    </div>
  );
}

export { ShoppingItem };
