import { useEffect, useState } from "react";
import type { ShoppingItemInterface, ShoppingItemProps } from "@/data/Shopping";
import {
  useUpdateShoppingItem,
  useRemoveShoppingItem,
  useToggleShoppingItemComplete,
  useAddFavoriteProduct,
  useFavoriteProductsQuery,
  useDeleteFavoriteProduct,
} from "@/hooks/shopping/useShoppingItems";
import { motion } from "framer-motion";
import { ShoppingItemDisplay } from "./ShoppingItemDisplay";
import { ShoppingItemEditModal } from "./ShoppingItemEditModal";

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

  const handleContainerClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate({ listId, itemId: item.id, updates: { quantity: newQuantity } });
  };

  const resetEditData = () => {
    setEditData({
      name: item.name,
      price: item.price?.toString() || "",
      notes: item.notes || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: Partial<ShoppingItemInterface> = {
      name: editData.name.trim(),
    };
    if (editData.price && parseFloat(editData.price) >= 0) {
      updateData.price = parseFloat(editData.price);
    }
    updateData.notes = editData.notes.trim() || "";

    await updateItem.mutateAsync({ listId, itemId: item.id, updates: updateData });
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

  const handleToggleFavorite = () => {
    if (isFavorited) {
      handleRemoveFromFavorites();
    } else {
      handleAddToFavorites();
    }
  };

  // List view
  return (
    <>
      <motion.div
        className={[
          "group p-3 md:p-4 rounded-xl border transition-all",
          item.isCompleted
            ? "border-green-200 bg-green-50"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
        ].join(" ")}>
        <ShoppingItemDisplay
          item={item}
          isFavorited={isFavorited}
          totalPrice={totalPrice}
          onToggleComplete={handleToggleComplete}
          onContainerClick={handleContainerClick}
          onQuantityChange={handleUpdateQuantity}
          onEdit={() => setIsEditing(true)}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
          favoriteLoading={addFavoriteProduct.isPending || deleteFavorite.isPending}
          deleteLoading={removeItem.isPending}
        />
      </motion.div>

      {/* Edit Modal */}
      <ShoppingItemEditModal
        isOpen={isEditing}
        onClose={() => {
          resetEditData();
          setIsEditing(false);
        }}
        editData={editData}
        setEditData={setEditData}
        onSubmit={handleSaveEdit}
        itemName={item.name}
        isFavorited={isFavorited}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDelete}
        favoriteLoading={addFavoriteProduct.isPending || deleteFavorite.isPending}
        deleteLoading={removeItem.isPending}
      />
    </>
  );
}

export { ShoppingItem };
