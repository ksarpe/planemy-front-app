import { useState } from "react";
import { Plus, MoreVertical, Edit2, Trash2, Share2, Check, Users } from "lucide-react";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { BasicDropdown, BasicDropdownItem, DeleteConfirmationModal } from "../Common";
import type { TaskListInterface } from "@/data/Tasks/interfaces";
import { useDeleteTaskList, useUpdateTaskList } from "@/hooks/tasks/useTasksLists";
import { useTasks } from "@/hooks/tasks/useTasks";

interface TaskListPanelProps {
  lists: TaskListInterface[];
  currentList: TaskListInterface | null;
  onSelectList: (list: TaskListInterface) => void;
  onAddList: () => void;
}

export function TaskListPanel({ lists, currentList, onSelectList, onAddList }: TaskListPanelProps) {
  const { mainListId, updateSettings } = usePreferencesContext();
  const deleteList = useDeleteTaskList();
  const updateList = useUpdateTaskList();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listToDelete, setListToDelete] = useState<TaskListInterface | null>(null);

  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (list: TaskListInterface) => {
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
    setShowDeleteConfirm(false);
    await deleteList.mutateAsync(listId);
    setListToDelete(null);
  };

  const handleDeleteClick = (list: TaskListInterface) => {
    setListToDelete(list);
    setShowDeleteConfirm(true);
  };

  const handleSetAsDefault = async (listId: string) => {
    updateSettings({ defaultTaskListId: listId });
  };

  // Komponent dla każdej listy zadań
  const TaskListItem = ({ list }: { list: TaskListInterface }) => {
    const { data: tasks = [] } = useTasks(list.id);
    const stats = {
      total: tasks.length,
      completed: tasks.filter((task) => task.isCompleted).length,
    };

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
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{list.name}</h4>
                    {list.shared && <Users size={14} className="text-blue-600 flex-shrink-0" />}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 justify-between">
                <span className={`${stats.completed === stats.total && stats.total > 0 ? "text-success" : ""}`}>
                  {stats.completed}/{stats.total}
                </span>
                {mainListId === list.id && (
                  <span className="flex items-center gap-1 text-primary font-medium">Domyślna</span>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <BasicDropdown
                trigger={
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
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
                <BasicDropdownItem icon={Share2} onClick={() => console.log("Share list", list.id)}>
                  Udostępnij
                </BasicDropdownItem>
                {mainListId !== list.id && (
                  <BasicDropdownItem icon={Check} onClick={() => handleSetAsDefault(list.id)}>
                    Ustaw jako domyślna
                  </BasicDropdownItem>
                )}
                <BasicDropdownItem icon={Trash2} variant="red" onClick={() => handleDeleteClick(list)}>
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

      <div className="space-y-2">
        {lists.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📋</div>
            <p className="text-sm text-gray-500 mb-3">Brak list zadań</p>
            <button
              onClick={onAddList}
              className="text-sm bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-hover transition-colors">
              Utwórz pierwszą listę
            </button>
          </div>
        ) : (
          lists.map((list) => <TaskListItem key={list.id} list={list} />)
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setListToDelete(null);
        }}
        onConfirm={() => {
          if (listToDelete) {
            handleDeleteList(listToDelete.id);
          }
        }}
        title="Usuń listę zadań"
        message="Czy na pewno chcesz usunąć listę zadań"
        itemName={listToDelete?.name || ""}
        confirmButtonText="Usuń listę"
      />
    </div>
  );
}
