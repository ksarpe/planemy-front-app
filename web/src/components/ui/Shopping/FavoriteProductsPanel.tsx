import { useState } from "react";
import type { FavoriteProductInterface, FavoriteProductsPanelProps } from "@/data/Shopping";
import { useAddFavoriteToList, useDeleteFavoriteProduct } from "@shared/hooks/shopping/useShoppingItems";
import { Plus, Star, Trash2, Search, Package } from "lucide-react";

function FavoriteProductsPanel({ products, currentListId }: FavoriteProductsPanelProps) {
  const removeFromFavorites = useDeleteFavoriteProduct();
  const addFavoriteToList = useAddFavoriteToList();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddToList = async (product: FavoriteProductInterface) => {
    if (!currentListId) return;
    await addFavoriteToList.mutateAsync({ listId: currentListId, product });
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten produkt z ulubionych?")) {
      await removeFromFavorites.mutateAsync(productId);
    }
  };

  const formatLastUsed = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Dzisiaj";
    if (diffDays === 1) return "Wczoraj";
    if (diffDays < 7) return `${diffDays} dni temu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tyg. temu`;
    return `${Math.floor(diffDays / 30)} mies. temu`;
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Ulubione produkty</h3>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            {products.length === 0 ? (
              <>
                <Star size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Brak ulubionych produktów</p>
                <p className="text-xs text-gray-400">Dodawaj produkty do ulubionych podczas tworzenia</p>
              </>
            ) : (
              <>
                <Package size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Brak wyników wyszukiwania</p>
              </>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="p-3 border border-gray-200 rounded-md hover:bg-gray-50  transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <span className="text-xs text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">
                      <Star size={10} className="inline mr-1" />
                      {product.usageCount}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div>{product.category}</div>
                    {product.price && (
                      <div className="font-medium">
                        {product.price.toFixed(2)} zł / {product.unit}
                      </div>
                    )}
                    {product.brand && <div>Marka: {product.brand}</div>}
                    <div>Ostatnio: {formatLastUsed(product.lastUsed)}</div>
                  </div>

                  {product.notes && <div className="text-xs text-gray-400 mt-1 italic">{product.notes}</div>}
                </div>

                <div className="flex flex-col gap-1 ml-2">
                  {currentListId && (
                    <button
                      onClick={() => handleAddToList(product)}
                      className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title="Dodaj do listy">
                      <Plus size={12} />
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveFromFavorites(product.id)}
                    className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    title="Usuń z ulubionych">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {products.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Łącznie ulubionych: {products.length}</div>
            <div>
              Najczęściej używane:{" "}
              {products
                .slice(0, 3)
                .map((p) => p.name)
                .join(", ")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { FavoriteProductsPanel };
