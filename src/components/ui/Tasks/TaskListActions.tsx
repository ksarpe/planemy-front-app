import { useState } from "react";
import { Settings, Edit3, Trash2, RotateCcw, AlertTriangle, Users } from "lucide-react";
import { useTasksForList } from "@/firebase/tasks";
import { useTaskContext } from "@/hooks/useTaskContext";
import ManageTaskListSharingModal from "./Modals/ManageTaskListSharingModal";
import { DeleteConfirmationModal, RenameModal } from "../Common";

// Expandable actions for the task list
// in the task list view
export default function TaskListActions() {
  const { renameTaskList, deleteTaskList, clearCompletedTasks, uncheckAllTasks, loading, currentTaskList } =
    useTaskContext(); //context data
  const [isOpen, setIsOpen] = useState(false); // wether the dropdown is open
  const [isRenaming, setIsRenaming] = useState(false); // wether the rename modal is open
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // wether the delete confirmation modal is open
  const [showSharingModal, setShowSharingModal] = useState(false);

  const tasks = useTasksForList(currentTaskList?.id || "");

  if (!currentTaskList) return null;

  const completedCount = tasks.filter((task) => task.isCompleted).length;
  const totalCount = tasks.length;

  const handleRename = (newName: string) => {
    renameTaskList(currentTaskList.id, newName);
    setIsRenaming(false);
  };

  const handleDelete = () => {
    deleteTaskList(currentTaskList.id);
    setShowDeleteConfirm(false);
    setIsOpen(false);
  };

  const handleClearCompleted = () => {
    clearCompletedTasks(currentTaskList.id);
    setIsOpen(false);
  };

  const handleUncheckAll = () => {
    uncheckAllTasks(currentTaskList.id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 min-h-[52px]"
        disabled={loading}>
        <Settings size={18} className="text-gray-500" />
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium text-gray-900">Zarządzaj</span>
          <span className="text-xs text-gray-500">{currentTaskList.name}</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {/* Rename Option */}
            <button
              onClick={() => {
                setIsRenaming(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <Edit3 size={16} />
              <span className="text-sm">Zmień nazwę</span>
            </button>

            {/* Manage Sharing */}
            <button
              onClick={() => {
                setShowSharingModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
              <Users size={16} />
              <span className="text-sm">Zarządzaj udostępnianiem</span>
            </button>

            {/* Clear Completed Tasks */}
            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                disabled={loading}>
                <Trash2 size={16} />
                <span className="text-sm">Usuń ukończone ({completedCount})</span>
              </button>
            )}

            {/* Uncheck All Tasks */}
            {completedCount > 0 && (
              <button
                onClick={handleUncheckAll}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                disabled={loading}>
                <RotateCcw size={16} />
                <span className="text-sm">Odznacz wszystkie</span>
              </button>
            )}

            {/* Delete List */}
            <button
              onClick={() => { setShowDeleteConfirm(true); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-700 hover:bg-red-50 rounded-lg transition-colors mt-2 border-t border-gray-100 pt-3"
              disabled={loading}>
              <AlertTriangle size={16} />
              <span className="text-sm">Usuń całą listę</span>
            </button>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      <RenameModal
        isOpen={isRenaming}
        onClose={() => setIsRenaming(false)}
        onConfirm={handleRename}
        title="Zmień nazwę listy"
        currentName={currentTaskList.name}
        placeholder="Nowa nazwa listy"
        isLoading={loading}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Usuń listę zadań"
        message="Czy na pewno chcesz usunąć listę"
        itemName={currentTaskList.name}
        additionalInfo={`Liczba zadań, która zostanie usunięta: ${totalCount}`}
        confirmButtonText="Usuń listę"
        isLoading={loading}
      />
      {/* Manage Sharing Modal */}
      <ManageTaskListSharingModal
        isOpen={showSharingModal}
        onClose={() => setShowSharingModal(false)}
        listId={currentTaskList.id}
        listName={currentTaskList.name}
      />
      {/* Background overlay to close dropdown */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}
