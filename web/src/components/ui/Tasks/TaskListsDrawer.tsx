import type { TaskListInterface } from "@shared/data/Tasks/interfaces";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TaskListPanel } from "./TaskListPanel";

interface TaskListsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allTaskLists: TaskListInterface[];
  currentTaskList: TaskListInterface | null;
  onSelectList: (list: TaskListInterface) => void;
  onAddList: () => void;
}

// Drawer is a overal panel that slides in from the right to show task lists
// It has TaskListPanel inside which shows the actual list of task lists
export function TaskListsDrawer({
  isOpen,
  onClose,
  allTaskLists,
  currentTaskList,
  onSelectList,
  onAddList,
}: TaskListsDrawerProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={isOpen ? "false" : "true"}
        onClick={onClose}>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Drawer */}
      <div
        role="dialog"
        aria-label={t("tasks.panel.ariaLabel")}
        className={`fixed top-0 right-0 h-full w-80 sm:w-100 max-w-full bg-bg-alt shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-bg-hover flex items-center justify-between bg-bg-alt sticky top-0 z-10">
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text hover:bg-bg-muted-light cursor-pointer rounded-lg p-2 transition-colors"
            aria-label="Close panel">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto scrollbar-hide p-2">
          <TaskListPanel
            lists={allTaskLists}
            currentList={currentTaskList}
            onSelectList={onSelectList}
            onAddList={onAddList}
          />
        </div>
      </div>
    </>
  );
}
