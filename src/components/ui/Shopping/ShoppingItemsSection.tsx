import { Package, Plus } from "lucide-react";
import { ShoppingItem } from "./ShoppingItem";
import type { ShoppingItemsSectionProps } from "@/data/Shopping/interfaces";

export function ShoppingItemsSection({ items, listId, onAddItem, isFiltered }: ShoppingItemsSectionProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-3">
        <h2 className="text-lg font-medium">{isFiltered ? "Wyniki wyszukiwania" : "Produkty na liście"}</h2>
        <span className="text-sm text-gray-500">{items.length} produktów</span>
      </div>

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
        <div className="space-y-3 md:space-y-4">
          {
            <div className="md:pt-1">
              <button
                onClick={onAddItem}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                <Plus size={18} />
                Dodaj produkt
              </button>
            </div>
          }
          {items.map((item) => (
            <ShoppingItem key={item.id} item={item} listId={listId} />
          ))}
        </div>
      )}
    </div>
  );
}
