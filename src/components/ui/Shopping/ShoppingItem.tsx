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
import { Check, Edit2, Trash2, Plus, Minus, Heart } from "lucide-react";
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

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItemComplete.mutate({ listId, itemId: item.id, isCompleted: !item.isCompleted });
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const handleContainerClick = () => {
    if (isMobile && !isEditing) {
      setIsEditing(true);
    }
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

  // Local quantity adjust while editing (no server call until save)
  const adjustEditQuantity = (delta: number) => {
    setEditData((prev) => {
      const parsed = parseFloat(prev.quantity.replace(",", "."));
      const current = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
      const next = Math.max(1, current + delta);
      return { ...prev, quantity: next.toString() };
    });
  };

  // List view
  return (
    <motion.div
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
              <div className="col-span-2">
                <div className="inline-flex items-center rounded-full border border-gray-300 bg-white overflow-hidden h-9 w-full justify-between">
                  <button
                    type="button"
                    onClick={() => adjustEditQuantity(-1)}
                    className="h-full w-8 flex items-center justify-center hover:bg-red-100 disabled:opacity-40"
                    disabled={!editData.quantity || parseFloat(editData.quantity) <= 1}
                    aria-label="Zmniejsz">
                    <Minus size={14} />
                  </button>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editData.quantity}
                    onChange={(e) => {
                      const v = e.target.value.replace(",", ".");
                      if (v === "") return setEditData((p) => ({ ...p, quantity: "" }));
                      if (/^\d*(?:[.,]\d{0,2})?$/.test(v)) {
                        setEditData((p) => ({ ...p, quantity: v }));
                      }
                    }}
                    className="w-12 text-center text-sm outline-none bg-transparent"
                    aria-label="Ilość"
                    placeholder="1"
                  />
                  <button
                    type="button"
                    onClick={() => adjustEditQuantity(1)}
                    className="h-full w-8 flex items-center justify-center hover:bg-green-100"
                    aria-label="Zwiększ">
                    <Plus size={14} />
                  </button>
                </div>
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

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex gap-2 md:hidden">
              {!isFavorited ? (
                <button
                  type="button"
                  onClick={handleAddToFavorites}
                  disabled={addFavoriteProduct.isPending}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                  Ulubione ★
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemoveFromFavorites}
                  disabled={deleteFavorite.isPending}
                  className="px-3 py-2 text-sm rounded-md border border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 disabled:opacity-50">
                  Usuń ★
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50">
                Usuń
              </button>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Anuluj
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary-hover">
                Zapisz
              </button>
            </div>
          </div>
        </form>
      ) : (
        // Display (view) mode
        <div className="flex items-start gap-3 cursor-pointer" onClick={handleContainerClick}>
          {/* Checkbox */}
          <button
            onClick={(e) => handleToggleComplete(e)}
            className={[
              "mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center",
              item.isCompleted ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-green-500",
            ].join(" ")}
            aria-label={item.isCompleted ? "Odznacz" : "Zaznacz"}>
            {item.isCompleted && <Check size={12} />}
          </button>

          {/* Emoji kategorii */}
          <span className="mt-0.5 text-xl flex-shrink-0">{getCategoryEmoji(item.category)}</span>

          {/* Center: nazwa + (desktop) ilość/cena w jednej linii */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 min-w-0">
              <div className="flex items-start gap-2 min-w-0">
                <h4
                  className={[
                    "font-medium text-sm md:text-base break-words",
                    item.isCompleted ? "line-through text-gray-500" : "text-gray-900",
                  ].join(" ")}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  title={item.name}>
                  {item.name}
                </h4>
                {isFavorited && <Heart size={14} className="mt-0.5 flex-shrink-0 text-yellow-500" />}
              </div>
              <div className="mt-1 md:mt-0 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs md:text-sm text-gray-600 flex-shrink-0">
                <span className="hidden md:inline-flex">
                  <QtyStepper
                    value={item.quantity}
                    onDec={() => handleUpdateQuantity(item.quantity - 1)}
                    onInc={() => handleUpdateQuantity(item.quantity + 1)}
                    disabledDec={item.quantity <= 1}
                  />
                </span>
                <span
                  className={[
                    "whitespace-nowrap",
                    item.isCompleted ? "line-through text-gray-500" : "text-gray-800",
                  ].join(" ")}>
                  {" "}
                  {item.quantity} {item.unit}
                </span>
                {totalPrice && (
                  <span className={["font-medium", item.isCompleted ? "text-gray-500" : "text-gray-900"].join(" ")}>
                    {totalPrice}
                  </span>
                )}
              </div>
            </div>
            {item.notes && (
              <div className="mt-1 text-[11px] md:text-xs italic text-gray-500 leading-snug break-words">
                {item.notes}
              </div>
            )}
          </div>

          {/* Prawa kolumna: tylko akcje */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-1">
            {/* Desktop action icons */}
            <div className="hidden md:flex gap-1">
              {!isFavorited ? (
                <button
                  onClick={handleAddToFavorites}
                  disabled={addFavoriteProduct.isPending}
                  className="p-2 rounded-md text-gray-400 hover:text-yellow-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title="Dodaj do ulubionych">
                  <Heart size={16} />
                </button>
              ) : (
                <button
                  onClick={handleRemoveFromFavorites}
                  disabled={deleteFavorite.isPending}
                  className="p-2 rounded-md text-yellow-600 hover:text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title="Usuń z ulubionych">
                  <Heart size={16} fill="currentColor" />
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
