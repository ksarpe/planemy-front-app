import { useState } from "react";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import {
  TaskViewHeader,
  CreateTaskListModal,
  TaskList,
  TaskStatistics,
  TaskAlerts,
  TaskDetails,
  EmptyStates,
} from "@/components/ui/Tasks";
import { TaskListPanel } from "@/components/ui/Tasks/TaskListPanel";
import Spinner from "../ui/Utils/Spinner";
import { useTaskLists, useCreateTaskList } from "@/hooks/tasks/useTasksLists";
import type { TaskListFilter } from "@/data/Tasks/types";
import type { TaskListInterface } from "@/data/Tasks/interfaces";

export default function TasksView() {
  const { t } = useTranslation();
  const { currentTaskListId, currentTaskList, clickedTask, taskLists, setCurrentTaskListId } = useTaskContext();
  const { isLoading: areListsLoading } = useTaskLists();
  const { data: tasksData, isLoading: loading } = useTasks(currentTaskListId);
  const { mutate: createTaskList } = useCreateTaskList();
  const tasks = tasksData ? tasksData : [];

  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [filter, setFilter] = useState<TaskListFilter>("pending");
  const [showListsPanel, setShowListsPanel] = useState(false);

  const handleCreateTaskList = async (name: string) => {
    createTaskList(name);
  };

  const handleSelectList = (list: TaskListInterface) => {
    setCurrentTaskListId(list.id);
    setShowListsPanel(false);
  };

  const handleAddList = () => {
    setIsCreateListModalOpen(true);
  };

  if (areListsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner />
        <p>{t("tasks.loading.lists")}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Task Lists Panel Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          showListsPanel ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={showListsPanel ? "false" : "true"}
        onClick={() => setShowListsPanel(false)}>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Task Lists Panel Drawer */}
      <div
        role="dialog"
        aria-label={t("tasks.panel.ariaLabel")}
        className={`fixed top-0 right-0 h-full w-80 sm:w-100 max-w-full bg-bg-alt border-l border-bg-hover shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          showListsPanel ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-bg-hover flex items-center justify-between bg-bg-alt sticky top-0 z-10">
          <span className="text-lg px-2">{t("tasks.panel.title")}</span>
          <button
            onClick={() => setShowListsPanel(false)}
            className="px-2 hover:text-negative cursor-pointer rounded-md hover:bg-bg-hover">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-auto scrollbar-hide p-2">
          <TaskListPanel
            lists={taskLists || []}
            currentList={currentTaskList}
            onSelectList={handleSelectList}
            onAddList={handleAddList}
          />
        </div>
      </div>

      {/* Task Details Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-bg-alt border-l border-bg-hover shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          clickedTask ? "translate-x-0" : "translate-x-full"
        }`}>
        {clickedTask && <TaskDetails />}
      </div>

      {/* Main content */}
      <div className="flex flex-col p-4 md:p-8 gap-4">
        <div className="">
          {/* Header with Task Lists */}
          <TaskViewHeader
            onToggleLists={() => setShowListsPanel(!showListsPanel)}
            listsOpen={showListsPanel}
          />
        </div>

        {!currentTaskList && (!taskLists || taskLists.length === 0) && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyStates type="no-lists" onCreateListClick={() => setIsCreateListModalOpen(true)} />
          </div>
        )}

        {/* Task list content */}
        {currentTaskList && (
          <div className="flex flex-col gap-4">
            <div>
              <TaskStatistics tasks={tasks} filter={filter} onFilterChange={setFilter} />
              {/* Alerts in case some task is overdue */}
              <TaskAlerts tasks={tasks} />
            </div>

            {/* Task list with proper scrolling */}
            <TaskList tasks={tasks} filter={filter} isLoading={loading} />
          </div>
        )}

        {/* Create Task List Modal */}
        <CreateTaskListModal
          isOpen={isCreateListModalOpen}
          onClose={() => setIsCreateListModalOpen(false)}
          onSubmit={handleCreateTaskList}
          loading={loading}
        />
      </div>
    </div>
  );
}
