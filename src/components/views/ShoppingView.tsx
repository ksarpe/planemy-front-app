import { useState } from "react";
import { useShoppingContext } from "@/hooks/context/useShoppingContext";
import { useShoppingItemsQuery } from "@/hooks/shopping/useShoppingItems";
import { ShoppingCart, Heart, X, Plus } from "lucide-react";
import { AddListModal } from "../ui/Shopping/AddListModal";
import { AddItemModal } from "../ui/Shopping/AddItemModal";
import { ShoppingListPanel } from "../ui/Shopping/ShoppingListPanel";
import { FavoriteProductsPanel } from "../ui/Shopping/FavoriteProductsPanel";
import { ShoppingHeader } from "../ui/Shopping/ShoppingHeader";
import { ShoppingFilters } from "../ui/Shopping/ShoppingFilters";
import { ShoppingItemsSection } from "../ui/Shopping/ShoppingItem/ShoppingItemsSection";

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
  const [showListsPanel, setShowListsPanel] = useState(false);

  const { data: listItems = [], isLoading: itemsLoading } = useShoppingItemsQuery(currentList ? currentList.id : "");

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
    <div className="relative h-full p-4 flex flex-row">
      {/* Drawer (scoped inside this view) */}
      {/* Full-screen overlay + right drawer (desktop & mobile unified) */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          showListsPanel ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={showListsPanel ? "false" : "true"}
        onClick={() => setShowListsPanel(false)}>
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div
        role="dialog"
        aria-label="Panel list zakupów"
        className={`fixed top-0 right-0 h-full w-80 sm:w-100 max-w-full bg-bg-alt border-l border-bg-hover shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          showListsPanel ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-bg-hover flex items-center gap-2 bg-bg-alt sticky top-0 z-10">
          <div className="flex gap-2 flex-1">
            <button onClick={() => setActiveTab("shopping")} className={getTabButtonClass("shopping")}>
              <ShoppingCart size={16} className="inline mr-2" />
              Listy
            </button>
            <button onClick={() => setActiveTab("favorites")} className={getTabButtonClass("favorites")}>
              <Heart size={16} className="inline mr-2" />
              Ulubione
            </button>
          </div>
          <button
            onClick={() => setShowListsPanel(false)}
            className="inline px-2 rounded-md hover:text-negative cursor-pointer">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {activeTab === "shopping" ? (
            <ShoppingListPanel
              lists={shoppingLists}
              currentList={currentList}
              onSelectList={(l) => {
                setCurrentList(l);
                setShowListsPanel(false);
              }}
              onAddList={() => setIsAddListModalOpen(true)}
            />
          ) : (
            <FavoriteProductsPanel products={favoriteProducts} currentListId={currentList?.id} />
          )}
        </div>
      </div>

      {/* Main content card (adds left padding when drawer open on desktop) */}
      <div className="bg-bg-alt rounded-md shadow-md flex-1 overflow-auto p-4 space-y-4 md:relative">
        {currentList ? (
          <>
            <ShoppingHeader
              name={currentList.name}
              stats={{ pending: pendingItems, completed: completedItems, totalValue }}
              onToggleLists={() => setShowListsPanel((v) => !v)}
              listsOpen={showListsPanel}
            />

            <div className="flex flex-col-reverse md:flex-row gap-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <button
                  onClick={() => setIsAddItemModalOpen(true)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-success text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                  <Plus size={18} />
                  Dodaj produkt
                </button>
              </div>
              <ShoppingFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} categories={categories} />
            </div>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Wybierz listę zakupów</h3>
              <p className="text-gray-400 mb-4">Otwórz panel list aby wybrać lub utwórz nową</p>
              <button
                onClick={() => setIsAddListModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                Utwórz nową listę
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale */}
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
