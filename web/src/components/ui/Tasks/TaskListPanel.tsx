import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import type { TaskListPanelProps } from "@shared/data/Tasks/Components/TaskComponentInterfaces";
import type { TaskListInterface } from "@shared/data/Tasks/interfaces";
import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { useDeleteTaskList, useTasks, useUpdateTaskList } from "@shared/hooks/tasks/useTasks";
import { Edit2, MoreVertical, Plus, Share2, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteConfirmationModal } from "../Common";
import { Button } from "../shadcn/button";
import ManageTaskListSharingModal from "./Modals/ManageTaskListSharingModal";

export function TaskListPanel({ lists, currentList, onSelectList, onAddList }: TaskListPanelProps) {
  const { t } = useTranslation();
  const { defaultTaskListId } = usePreferencesContext();
  const deleteList = useDeleteTaskList();
  const updateList = useUpdateTaskList();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareListId, setShareListId] = useState<string | null>(null);
  const [shareListName, setShareListName] = useState<string | null>(null);
  const [listToDelete, setListToDelete] = useState<TaskListInterface | null>(null);

  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (list: TaskListInterface) => {
    setEditingListId(list.id);
    setEditName(list.name);
  };

  const handleSaveEdit = async (listId: string) => {
    if (editName.trim()) {
      await updateList.mutateAsync({ id: listId, data: { name: editName.trim() } });
    }
    setEditingListId(null);
    setEditName("");
  };

  const handleShareList = (listId: string, listName: string) => {
    setShareListId(listId);
    setShareListName(listName);
    setIsShareModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingListId(null);
    setEditName("");
  };

  const handleDeleteList = async (listId: string) => {
    setShowDeleteConfirm(false);
    deleteList.mutate(listId);
    setListToDelete(null);
  };

  const handleDeleteClick = (list: TaskListInterface) => {
    setListToDelete(list);
    setShowDeleteConfirm(true);
  };

  // const handleSetAsDefault = async (listId: string) => {
  //   updateSettings({ defaultTaskListId: listId });
  // };

  // Komponent dla każdej listy zadań
  const TaskListItem = ({ list }: { list: TaskListInterface }) => {
    const { data: tasks = [] } = useTasks(list.id);

    // Ensure tasks is always an array
    const tasksArray = Array.isArray(tasks) ? tasks : [];

    const stats = {
      total: tasksArray.length,
      completed: tasksArray.filter((task) => task.isCompleted).length,
    };

    const isSelected = currentList?.id === list.id;
    const isEditing = editingListId === list.id;

    return (
      <div
        key={list.id}
        className={`p-2 rounded-2xl border transition-all text-text ${
          isSelected ? "border-text bg-bg-hover " : "hover:bg-bg-hover border-bg-muted-light "
        }`}
        onClick={() => !isEditing && onSelectList(list)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              {!isEditing ? (
                //NORMAL STATE (no border, just name)
                <div>
                  <div className="flex items-center gap-2 cursor-default">
                    <h4 className="font-medium text-sm py-1 border-b border-transparent">{list.name}</h4>
                    {list.shared && <Users size={14} className="text-primary flex-shrink-0" />}
                  </div>
                </div>
              ) : (
                // EDITING STATE (input with border)
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleSaveEdit(list.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(list.id);
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  className="w-full font-medium text-sm py-1 border-b border-primary focus:outline-none"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <div className="flex items-center gap-3 mt-1 text-xs text-text-muted justify-between">
                <span className={`${stats.completed === stats.total && stats.total > 0 ? "text-success" : ""}`}>
                  {stats.completed}/{stats.total}
                </span>
                {defaultTaskListId === list.id && (
                  <span className="flex items-center gap-1 text-primary font-medium">{t("tasks.panel.default")}</span>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default">
                    <MoreVertical size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48">
                  <DropdownMenuItem onClick={() => handleStartEdit(list)}>
                    <Edit2 size={16} />
                    {t("tasks.panel.actions.editName")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShareList(list.id, list.name)}>
                    <Share2 size={16} />
                    {t("tasks.panel.actions.share")}
                  </DropdownMenuItem>
                  {defaultTaskListId !== list.id && (
                    <></>
                    // <DropdownMenuItem onClick={() => handleSetAsDefault(list.id)}>
                    //   <Check size={16} />
                    //   {t("tasks.panel.actions.setAsDefault")}
                    // </DropdownMenuItem>
                  )}
                  <DropdownMenuItem variant="destructive" onClick={() => handleDeleteClick(list)}>
                    <Trash2 size={16} />
                    {t("tasks.panel.actions.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {/* Only if there are actually some tasks */}
        {stats.total > 0 && (
          <div className="mt-2">
            <div className="w-full bg-text-muted rounded-full h-1.5">
              <div
                className="bg-success h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(stats.completed / stats.total) * 100}%` }}></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 text-text">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t("tasks.panel.title")}</h3>
        <Button onClick={onAddList} variant="primary" size="sm">
          <Plus size={16} />
        </Button>
      </div>

      <div className="space-y-2">
        {lists.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-text-muted mb-2">📋</div>
            <p className="text-sm text-text-muted mb-3">{t("tasks.panel.empty.title")}</p>
            <button
              onClick={onAddList}
              className="text-sm bg-primary text-white px-3 py-2 rounded-2xl hover:bg-primary/90 transition-colors">
              {t("tasks.panel.empty.createFirst")}
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
        title={t("tasks.panel.deleteConfirmation.title")}
        message={t("tasks.panel.deleteConfirmation.message")}
        itemName={listToDelete?.name || ""}
        confirmButtonText={t("tasks.panel.deleteConfirmation.confirmButton")}
      />

      {/* Share Task List Modal */}
      {isShareModalOpen && shareListId && (
        <ManageTaskListSharingModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setShareListId(null);
          }}
          listId={shareListId}
          listName={shareListName || "Brak nazwy"}
        />
      )}
    </div>
  );
}
