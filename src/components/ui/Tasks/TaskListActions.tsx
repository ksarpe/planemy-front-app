import { useState } from "react";
import { Settings, Edit3, Trash2, RotateCcw, AlertTriangle, X } from "lucide-react";
import { TaskListInterface } from "@/data/types";

interface TaskListActionsProps {
  currentTaskList: TaskListInterface | null;
  onRenameList: (listId: string, newName: string) => void;
  onDeleteList: (listId: string) => void;
  onClearCompletedTasks: (listId: string) => void;
  onUncheckAllTasks: (listId: string) => void;
  loading?: boolean;
}

export default function TaskListActions({
  currentTaskList,
  onRenameList,
  onDeleteList,
  onClearCompletedTasks,
  onUncheckAllTasks,
  loading = false
}: TaskListActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!currentTaskList) return null;

  const completedCount = currentTaskList.tasks.filter(task => task.isCompleted).length;
  const totalCount = currentTaskList.tasks.length;

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== currentTaskList.name) {
      onRenameList(currentTaskList.id, newName.trim());
    }
    setIsRenaming(false);
    setNewName("");
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDeleteList(currentTaskList.id);
    setShowDeleteConfirm(false);
    setIsOpen(false);
  };

  const handleClearCompleted = () => {
    onClearCompletedTasks(currentTaskList.id);
    setIsOpen(false);
  };

  const handleUncheckAll = () => {
    onUncheckAllTasks(currentTaskList.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 min-h-[52px]"
        disabled={loading}
      >
        <Settings size={18} className="text-gray-500" />
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium text-gray-900">Edytuj</span>
          <span className="text-xs text-gray-500">Zarządzaj listą</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-3 px-2">
              Lista: <span className="font-medium">{currentTaskList.name}</span>
            </div>

            {/* Rename Option */}
            <button
              onClick={() => {
                setIsRenaming(true);
                setNewName(currentTaskList.name);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Edit3 size={16} />
              <span className="text-sm">Zmień nazwę</span>
            </button>

            {/* Clear Completed Tasks */}
            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                disabled={loading}
              >
                <Trash2 size={16} />
                <span className="text-sm">Usuń ukończone ({completedCount})</span>
              </button>
            )}

            {/* Uncheck All Tasks */}
            {completedCount > 0 && (
              <button
                onClick={handleUncheckAll}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                disabled={loading}
              >
                <RotateCcw size={16} />
                <span className="text-sm">Odznacz wszystkie</span>
              </button>
            )}

            {/* Delete List */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-700 hover:bg-red-50 rounded-lg transition-colors mt-2 border-t border-gray-100 pt-3"
              disabled={loading}
            >
              <AlertTriangle size={16} />
              <span className="text-sm">Usuń całą listę</span>
            </button>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {isRenaming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Zmień nazwę listy</h3>
              <button
                onClick={() => {
                  setIsRenaming(false);
                  setNewName("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Nowa nazwa listy"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setIsRenaming(false);
                  setNewName("");
                }
              }}
            />
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsRenaming(false);
                  setNewName("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!newName.trim() || newName.trim() === currentTaskList.name}
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <h3 className="text-lg font-semibold">Usuń listę zadań</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Czy na pewno chcesz usunąć listę <span className="font-semibold">"{currentTaskList.name}"</span>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              Ta akcja usunie {totalCount} zadań i nie można jej cofnąć.
            </p>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Usuń listę
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
