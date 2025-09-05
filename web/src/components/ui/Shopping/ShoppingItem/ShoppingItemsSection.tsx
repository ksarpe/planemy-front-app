import { Package, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { ShoppingItem } from "./ShoppingItem";
import type { ShoppingItemsSectionProps } from "@/data/Shopping/Components/ShoppingComponentInterfaces";

export function ShoppingItemsSection({ items, listId, onAddItem, isFiltered }: ShoppingItemsSectionProps) {
  // Keep incomplete items on top; completed at the bottom, preserving relative order
  const sortedItems = useMemo(() => {
    const pending = items.filter((i) => !i.isCompleted);
    const done = items.filter((i) => i.isCompleted);
    return [...pending, ...done];
  }, [items]);
  return (
    <div>
      {items.length === 0 ? (
        <div className="text-center py-12 flex flex-col justify-center items-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">{isFiltered ? "Brak wyników" : "Lista jest pusta"}</h3>
          <p className="text-gray-400 mb-4">
            {isFiltered ? "Spróbuj zmienić kryteria wyszukiwania" : "Dodaj swój pierwszy produkt do listy"}
          </p>
          {!isFiltered && (
            <button
              onClick={onAddItem}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              <Plus size={18} />
              Dodaj produkt
            </button>
          )}
        </div>
      ) : (
        <motion.div className="space-y-2">
          <AnimatePresence initial={false}>
            {sortedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}>
                <ShoppingItem item={item} listId={listId} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
