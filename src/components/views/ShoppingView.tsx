import { useState } from "react";
import { useShoppingContext } from "@/hooks/context/useShoppingContext";
import { useShoppingItemsQuery } from "@/hooks/shopping/useShoppingItems";
import { ShoppingCart, Heart, Menu } from "lucide-react";
import { AddListModal } from "../ui/Shopping/AddListModal";
import { AddItemModal } from "../ui/Shopping/AddItemModal";
import { ShoppingListPanel } from "../ui/Shopping/ShoppingListPanel";
import { FavoriteProductsPanel } from "../ui/Shopping/FavoriteProductsPanel";
import { ShoppingHeader } from "../ui/Shopping/ShoppingHeader";
import { ShoppingFilters } from "../ui/Shopping/ShoppingFilters";
import { ShoppingItemsSection } from "../ui/Shopping/ShoppingItemsSection";
import { ShoppingProgress } from "../ui/Shopping/ShoppingProgress";

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
  } = useShoppingContext();

  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"shopping" | "favorites">("shopping");
  const [showLeftPanel, setShowLeftPanel] = useState(false);

  const { data: listItems = [], isLoading: itemsLoading } = useShoppingItemsQuery(currentList ? currentList.id : "");

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

  // Items come from a separate collection now
  // moved up to satisfy Hooks rules

  // Filter and search logic for current list items
  const filteredItems = (listItems || []).filter((item) =>
    searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  // Calculate statistics
  const totalItems = listItems.length;
  const completedItems = listItems.filter((item) => item.isCompleted).length;
  const pendingItems = totalItems - completedItems;
  const totalValue = listItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const getTabButtonClass = (tab: typeof activeTab) => {
    return `px-4 py-2 rounded-md font-medium transition-colors ${
      activeTab === tab ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;
  };

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Left Sidebar - desktop only */}
      <div className="hidden md:block w-80 bg-bg-alt rounded-md shadow-md overflow-hidden">
        {/* Tab Headers */}
        <div className="p-4 border-b border-gray-200 ">
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
      <div className="flex-1 bg-bg-alt rounded-md shadow-md overflow-auto">
        <div className="p-6 space-y-6">
          {/* Mobile: inline drawer toggle + panel (pushes content, not overlay) */}
          <div className="md:hidden">
            <button
              onClick={() => setShowLeftPanel((v) => !v)}
              className="mb-3 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-bg-alt border border-bg-hover">
              <Menu size={18} />
              {showLeftPanel ? "Ukryj listy" : "Pokaż listy"}
            </button>

            {showLeftPanel && (
              <div className="mb-4 bg-bg-alt rounded-md shadow-sm border border-bg-hover">
                <div className="p-3 border-b border-bg-hover">
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
                <div className="max-h-96 overflow-auto p-2">
                  {activeTab === "shopping" ? (
                    <ShoppingListPanel
                      lists={shoppingLists}
                      currentList={currentList}
                      onSelectList={(l) => {
                        setCurrentList(l);
                        setShowLeftPanel(false);
                      }}
                      onAddList={() => setIsAddListModalOpen(true)}
                    />
                  ) : (
                    <FavoriteProductsPanel products={favoriteProducts} currentListId={currentList?.id} />
                  )}
                </div>
              </div>
            )}
          </div>

          {currentList ? (
            <>
              <ShoppingHeader
                name={currentList.name}
                stats={{ pending: pendingItems, completed: completedItems, totalValue }}
              />

              <ShoppingFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} categories={categories} />

              {itemsLoading ? (
                <div className="text-gray-500">Ładowanie produktów...</div>
              ) : (
                <ShoppingItemsSection
                  items={filteredItems}
                  listId={currentList.id}
                  onAddItem={() => setIsAddItemModalOpen(true)}
                  isFiltered={Boolean(searchQuery)}
                />
              )}

              <ShoppingProgress total={totalItems} completed={completedItems} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">Wybierz listę zakupów</h3>
                <p className="text-gray-400 mb-4">Wybierz listę z panelu bocznego lub utwórz nową</p>
                <button
                  onClick={() => setIsAddListModalOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                  Utwórz nową listę
                </button>
              </div>
            </div>
          )}
        </div>
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
