import { useState } from "react";
import { useDeleteShoppingList, useUpdateShoppingList } from "@/hooks/shopping/useShoppingLists";
import { useShoppingListStats } from "@/hooks/shopping/useShoppingListStats";
import { Plus, MoreVertical, Edit2, Trash2, Share2, RefreshCw, Check } from "lucide-react";
import type { ShoppingListPanelProps } from "@/data/Shopping/Components/ShoppingComponentInterfaces";
import type { ShoppingListInterface } from "@/data/Shopping";
import { BasicDropdown, BasicDropdownItem } from "../Common";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";

function ShoppingListPanel({ lists, currentList, onSelectList, onAddList }: ShoppingListPanelProps) {
  const deleteList = useDeleteShoppingList();
  const updateList = useUpdateShoppingList();
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  // Using BasicDropdown with portal, so no local dropdown state needed
  const { defaultShoppingListId, updateSettings } = usePreferencesContext();

  const handleStartEdit = (list: ShoppingListInterface) => {
    setEditingListId(list.id);
    setEditName(list.name);
  };

  const handleSaveEdit = async (listId: string) => {
    if (editName.trim()) {
      await updateList.mutateAsync({ listId, updates: { name: editName.trim() } });
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
      await deleteList.mutateAsync(listId);
    }
  };

  // Derive stats and actions from the hook (keeps Query Client inside hooks)
  const { statsByList, clearCompletedForList } = useShoppingListStats(lists);

  const getListStats = (list: ShoppingListInterface) => {
    const stats = statsByList[list.id] || { total: 0, completed: 0, pending: 0 };
    return stats;
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Moje listy</h3>
        <button
          onClick={onAddList}
          className="p-2 bg-success text-white rounded-md hover:bg-success-hover transition-colors">
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
              className="text-sm bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-hover transition-colors">
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
                  isSelected ? "border-primary bg-bg-hover " : "border-primary hover:bg-bg-hover "
                }`}
                onClick={() => !isEditing && onSelectList(list)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
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
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 justify-between">
                        <span className={`${stats.completed === stats.total ? "text-success" : ""}`}>
                          {stats.completed}/{stats.total}
                        </span>
                        {defaultShoppingListId === list.id && (
                          <span className="flex items-center gap-1 text-primary font-medium">Domyślna</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <BasicDropdown
                        trigger={
                          <button className="p-1 hover:bg-gray-100  rounded transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        }
                        align="right"
                        usePortal={true}
                        closeOnItemClick={true}
                        width="w-60">
                        <BasicDropdownItem icon={Edit2} onClick={() => handleStartEdit(list)}>
                          Edytuj nazwę
                        </BasicDropdownItem>
                        <BasicDropdownItem
                          icon={RefreshCw}
                          onClick={() => {
                            if (stats.completed > 0) clearCompletedForList(list.id);
                          }}>
                          Wyczyść kupione
                        </BasicDropdownItem>
                        <BasicDropdownItem icon={Share2} onClick={() => console.log("Share list", list.id)}>
                          Udostępnij
                        </BasicDropdownItem>
                        <BasicDropdownItem
                          icon={Check}
                          onClick={() => updateSettings({ defaultShoppingListId: list.id })}>
                          {defaultShoppingListId === list.id ? (
                            <span className="flex items-center gap-2">
                              <span className="inline-flex h-2 w-2 rounded-full bg-green-500" /> Domyślna lista
                            </span>
                          ) : (
                            "Ustaw jako domyślną"
                          )}
                        </BasicDropdownItem>
                        <BasicDropdownItem icon={Trash2} variant="red" onClick={() => handleDeleteList(list.id)}>
                          Usuń
                        </BasicDropdownItem>
                      </BasicDropdown>
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
