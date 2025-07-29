import { useState } from "react";
import { useShoppingContext } from "../../context/ShoppingContext";
import {
  Plus,
  Search,
  ShoppingCart,
  Heart,
  Star,
  Grid3X3,
  List,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { AddListModal } from "../ui/Shopping/AddListModal";
import { AddItemModal } from "../ui/Shopping/AddItemModal";
import { ShoppingListPanel } from "../ui/Shopping/ShoppingListPanel";
import { FavoriteProductsPanel } from "../ui/Shopping/FavoriteProductsPanel";
import { ShoppingItem } from "../ui/Shopping/ShoppingItem";

export default function ShoppingView() {
  const {
    shoppingLists,
    currentList,
    setCurrentList,
    favoriteProducts,
    categories,
    searchQuery,
    setSearchQuery,
    loading,
    selectedCategory,
    setSelectedCategory,
  } = useShoppingContext();

  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<"shopping" | "favorites">("shopping");

  // Filter and search logic for current list items
  const getFilteredItems = () => {
    if (!currentList) return [];

    let items = currentList.items;

    // Apply search filter
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply category filter
    if (selectedCategory) {
      items = items.filter((item) => item.category === selectedCategory);
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  // Calculate statistics
  const totalItems = currentList?.items.length || 0;
  const completedItems = currentList?.items.filter((item) => item.isCompleted).length || 0;
  const pendingItems = totalItems - completedItems;
  const totalValue = currentList?.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0;

  const getTabButtonClass = (tab: typeof activeTab) => {
    return `px-4 py-2 rounded-lg font-medium transition-colors ${
      activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Ładowanie list zakupów...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Left Sidebar - Lists and Favorites */}
      <div className="w-80 bg-bg-alt dark:bg-bg-dark rounded-lg shadow-md overflow-hidden">
        {/* Tab Headers */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("shopping")} className={getTabButtonClass("shopping")}>
              <ShoppingCart size={16} className="inline mr-2" />
              Listy zakupów
            </button>
            <button onClick={() => setActiveTab("favorites")} className={getTabButtonClass("favorites")}>
              <Heart size={16} className="inline mr-2" />
              Ulubione
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "shopping" ? (
            <ShoppingListPanel
              lists={shoppingLists}
              currentList={currentList}
              onSelectList={setCurrentList}
              onAddList={() => setIsAddListModalOpen(true)}
            />
          ) : (
            <FavoriteProductsPanel products={favoriteProducts} currentListId={currentList?.id} />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-bg-alt dark:bg-bg-dark rounded-lg shadow-md overflow-auto">
        {currentList ? (
          <div className="p-6 space-y-6">
            {/* Header with Statistics */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{currentList.emoji}</span>
                  <h1 className="text-2xl font-semibold">{currentList.name}</h1>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Package size={18} />
                      <span className="text-sm font-medium">Wszystkie</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">{totalItems}</div>
                  </div>

                  <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-yellow-600 mb-1">
                      <Clock size={18} />
                      <span className="text-sm font-medium">Do kupienia</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">{pendingItems}</div>
                  </div>

                  <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <CheckCircle2 size={18} />
                      <span className="text-sm font-medium">Kupione</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">{completedItems}</div>
                  </div>

                  <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <TrendingUp size={18} />
                      <span className="text-sm font-medium">Wartość</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
                      {totalValue.toFixed(2)} zł
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsAddItemModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                <Plus size={18} />
                Dodaj produkt
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj produktów..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Wszystkie kategorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.emoji} {category.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  {viewMode === "grid" ? <List size={20} /> : <Grid3X3 size={20} />}
                </button>
              </div>
            </div>

            {/* Items List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  {searchQuery || selectedCategory ? "Wyniki wyszukiwania" : "Produkty na liście"}
                </h2>
                <span className="text-sm text-gray-500">{filteredItems.length} produktów</span>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    {searchQuery || selectedCategory ? "Brak wyników" : "Lista jest pusta"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {searchQuery || selectedCategory
                      ? "Spróbuj zmienić kryteria wyszukiwania"
                      : "Dodaj swój pierwszy produkt do listy"}
                  </p>
                  {!searchQuery && !selectedCategory && (
                    <button
                      onClick={() => setIsAddItemModalOpen(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                      Dodaj produkt
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"
                  }>
                  {filteredItems.map((item) => (
                    <ShoppingItem key={item.id} item={item} listId={currentList.id} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {totalItems > 0 && (
              <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-text-dark">Postęp zakupów</span>
                  <span className="text-sm text-gray-500">
                    {completedItems} z {totalItems}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedItems / totalItems) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{Math.round((completedItems / totalItems) * 100)}% ukończone</span>
                  <span className="flex items-center gap-1">
                    <Star size={12} />
                    Świetna robota!
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Wybierz listę zakupów</h3>
              <p className="text-gray-400 mb-4">Wybierz listę z panelu bocznego lub utwórz nową</p>
              <button
                onClick={() => setIsAddListModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Utwórz nową listę
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddListModal isOpen={isAddListModalOpen} onClose={() => setIsAddListModalOpen(false)} />

      {currentList && (
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          listId={currentList.id}
        />
      )}
    </div>
  );
}
