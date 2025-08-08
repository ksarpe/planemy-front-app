import { useState, useEffect } from "react";
import { ShoppingListInterface } from "../../../data/types";
import { useShoppingContext } from "../../../hooks/context/useShoppingContext";
import { Plus, MoreVertical, Edit2, Trash2, Share2, RefreshCw, Calendar } from "lucide-react";

interface ShoppingListPanelProps {
  lists: ShoppingListInterface[];
  currentList: ShoppingListInterface | null;
  onSelectList: (list: ShoppingListInterface) => void;
  onAddList: () => void;
}

function ShoppingListPanel({ lists, currentList, onSelectList, onAddList }: ShoppingListPanelProps) {
  const { deleteList, updateList } = useShoppingContext();
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowOptionsId(null);
    if (showOptionsId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showOptionsId]);

  const handleStartEdit = (list: ShoppingListInterface) => {
    setEditingListId(list.id);
    setEditName(list.name);
  };

  const handleSaveEdit = async (listId: string) => {
    if (editName.trim()) {
      await updateList(listId, { name: editName.trim() });
    }
    setEditingListId(null);
    setEditName("");
  };

  const handleCancelEdit = () => {
    setEditingListId(null);
    setEditName("");
  };

  const handleDeleteList = async (listId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę listę?")) {
      await deleteList(listId);
    }
  };

  const clearCompletedItems = async (list: ShoppingListInterface) => {
    const clearedItems = list.items.filter((item) => !item.isCompleted);
    await updateList(list.id, { items: clearedItems });
  };

  const getListStats = (list: ShoppingListInterface) => {
    const total = list.items.length;
    const completed = list.items.filter((item) => item.isCompleted).length;
    return { total, completed, pending: total - completed };
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Dzisiaj";
    if (diffDays === 1) return "Wczoraj";
    if (diffDays < 7) return `${diffDays} dni temu`;
    return date.toLocaleDateString("pl-PL");
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Moje listy</h3>
        <button
          onClick={onAddList}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          <Plus size={16} />
        </button>
      </div>

      {/* Lists */}
      <div className="space-y-2">
        {lists.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📝</div>
            <p className="text-sm text-gray-500 mb-3">Brak list zakupów</p>
            <button
              onClick={onAddList}
              className="text-sm bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors">
              Utwórz pierwszą listę
            </button>
          </div>
        ) : (
          lists.map((list) => {
            const stats = getListStats(list);
            const isSelected = currentList?.id === list.id;
            const isEditing = editingListId === list.id;

            return (
              <div
                key={list.id}
                className={`p-3 rounded-md border transition-all cursor-pointer ${
                  isSelected ? "border-blue-500 bg-blue-50 " : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 "
                }`}
                onClick={() => !isEditing && onSelectList(list)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl flex-shrink-0" style={{ color: list.color }}>
                      {list.emoji}
                    </span>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => handleSaveEdit(list.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(list.id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          className="w-full px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div>
                          <h4 className="font-medium text-sm truncate">{list.name}</h4>
                          {list.description && <p className="text-xs text-gray-500 truncate">{list.description}</p>}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{stats.total} produktów</span>
                        {stats.completed > 0 && <span className="text-green-600">{stats.completed} kupione</span>}
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(list.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowOptionsId(showOptionsId === list.id ? null : list.id);
                        }}
                        className="p-1 hover:bg-gray-100  rounded transition-colors">
                        <MoreVertical size={14} />
                      </button>

                      {showOptionsId === list.id && (
                        <div className="absolute right-0 top-8 bg-white  border border-gray-200  rounded-md shadow-lg z-10 min-w-[150px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(list);
                              setShowOptionsId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100  rounded-t-lg flex items-center gap-2 text-sm">
                            <Edit2 size={14} />
                            Edytuj nazwę
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearCompletedItems(list);
                              setShowOptionsId(null);
                            }}
                            disabled={stats.completed === 0}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm">
                            <RefreshCw size={14} />
                            Wyczyść kupione
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Share list", list.id);
                              setShowOptionsId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100  flex items-center gap-2 text-sm">
                            <Share2 size={14} />
                            Udostępnij
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteList(list.id);
                              setShowOptionsId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 rounded-b-lg flex items-center gap-2 text-sm">
                            <Trash2 size={14} />
                            Usuń
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {stats.total > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export { ShoppingListPanel };
