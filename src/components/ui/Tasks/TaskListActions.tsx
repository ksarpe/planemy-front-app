import { useState } from "react";
import { Settings, Edit3, Trash2, RotateCcw, Users, CircleChevronUp } from "lucide-react";
import { useTaskContext } from "@/hooks/useTaskContext";
import { usePreferencesContext } from "@/hooks/usePreferencesContext";
import ManageTaskListSharingModal from "./Modals/ManageTaskListSharingModal";
import { ActionButton, DeleteConfirmationModal, RenameModal, BasicDropdown, BasicDropdownItem } from "../Common";

// Expandable actions for the task list
// in the task list view
export default function TaskListActions() {
  const {
    renameTaskList,
    deleteTaskList,
    clearCompletedTasks,
    uncheckAllTasks,
    loading,
    currentTaskList,
    getTaskStats,
  } = useTaskContext(); //context data
  const { updateSettings, mainListId } = usePreferencesContext(); // preferences context for main list
  const [isRenaming, setIsRenaming] = useState(false); // wether the rename modal is open
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // wether the delete confirmation modal is open
  const [showSharingModal, setShowSharingModal] = useState(false);

  if (!currentTaskList) return null;

  const { total, completed } = getTaskStats(currentTaskList.id);

  const handleRename = (newName: string) => {
    renameTaskList(currentTaskList.id, newName);
    setIsRenaming(false);
  };

  const handleDelete = () => {
    deleteTaskList(currentTaskList.id);
    setShowDeleteConfirm(false);
  };

  const handleClearCompleted = () => {
    clearCompletedTasks(currentTaskList.id);
  };

  const handleUncheckAll = () => {
    uncheckAllTasks(currentTaskList.id);
  };

  return (
    <>
      <BasicDropdown
        trigger={
          <ActionButton
            onClick={() => {}} // Dummy onClick since BasicDropdown handles the click
            icon={Settings}
            iconSize={16}
            text="Zarządzaj"
            color="white"
            size="xs"
            className="w-full"
          />
        }
        align="right"
        width="w-64"
        closeOnItemClick={true}>
        <BasicDropdownItem icon={Edit3} onClick={() => setIsRenaming(true)}>
          Zmień nazwę
        </BasicDropdownItem>
        {mainListId != currentTaskList.id && (
          <BasicDropdownItem
            icon={CircleChevronUp}
            variant="green"
            onClick={() => updateSettings({ defaultTaskListId: currentTaskList!.id })}>
            Ustaw jako domyślna
          </BasicDropdownItem>
        )}
        <BasicDropdownItem icon={Users} variant="blue" onClick={() => setShowSharingModal(true)}>
          Udostępnij
        </BasicDropdownItem>
        {completed > 0 && (
          <BasicDropdownItem icon={Trash2} variant="orange" disabled={loading} onClick={handleClearCompleted}>
            Usuń ukończone ({completed})
          </BasicDropdownItem>
        )}
        {completed > 0 && (
          <BasicDropdownItem icon={RotateCcw} variant="blue" disabled={loading} onClick={handleUncheckAll}>
            Odznacz wszystkie
          </BasicDropdownItem>
        )}
        <BasicDropdownItem
          icon={Trash2}
          variant="red"
          disabled={loading}
          separator={true}
          onClick={() => setShowDeleteConfirm(true)}>
          Usuń listę
        </BasicDropdownItem>
      </BasicDropdown>

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
        additionalInfo={`Liczba zadań, która zostanie usunięta: ${total}`}
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
    </>
  );
}
