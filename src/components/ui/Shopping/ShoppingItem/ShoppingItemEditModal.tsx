import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingItemModalActions } from "./ShoppingItemModalActions";
import type { ShoppingItemEditModalProps } from "@/data/Shopping/UI/ShoppingItemInterfaces";

export function ShoppingItemEditModal({
  isOpen,
  onClose,
  editData,
  setEditData,
  onSubmit,
  itemName,
  isFavorited,
  onToggleFavorite,
  onDelete,
  favoriteLoading = false,
  deleteLoading = false,
}: ShoppingItemEditModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Edytuj produkt</h2>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{itemName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Zamknij">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Product name */}
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nazwa produktu
                </label>
                <input
                  id="product-name"
                  autoFocus
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Wpisz nazwę produktu"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Cena za jednostkę
                </label>
                <div className="relative">
                  <input
                    id="product-price"
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    value={editData.price}
                    onChange={(e) => setEditData((p) => ({ ...p, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-sm text-gray-500 pointer-events-none">
                    zł
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="product-notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notatki <span className="text-gray-400 font-normal">(opcjonalne)</span>
                </label>
                <textarea
                  id="product-notes"
                  value={editData.notes}
                  onChange={(e) => setEditData((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Dodaj notatki o produkcie..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Actions Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {/* Product Actions */}
                <div className="flex items-center gap-1">
                  <ShoppingItemModalActions
                    isFavorited={isFavorited}
                    onToggleFavorite={onToggleFavorite}
                    onEdit={() => {}} // Not used in modal
                    onDelete={handleDelete}
                    favoriteLoading={favoriteLoading}
                    deleteLoading={deleteLoading}
                    isMobile={false}
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                    Zapisz zmiany
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
