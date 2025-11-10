import {
  CreateTaskListModal,
  EmptyStates,
  TaskAlerts,
  TaskDetails,
  TaskList,
  TaskStatistics,
  TaskViewHeader,
} from "@/components/ui/Tasks";
import { TaskViewProvider } from "@shared/context/TaskViewContext";
import type { TaskListInterface } from "@shared/data/Tasks/interfaces";
import type { TaskListFilter } from "@shared/data/Tasks/types";
import { usePreferencesContext } from "@shared/hooks/context/usePreferencesContext";
import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useEffect, useState } from "react";
import { Drawer } from "../ui/Common/Drawer";
import Spinner from "../ui/Loaders/Spinner";
import { TaskListPanel } from "../ui/Tasks/TaskListPanel";

function TasksViewContent() {
  const {
    currentTaskListId,
    setCurrentTaskListId,
    currentTaskList,
    tasks,
    isLoadingLists,
    isLoadingTasks,
    allTaskLists,
    clickedTask,
  } = useTaskViewContext();
  const { defaultTaskListId } = usePreferencesContext();

  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [filter, setFilter] = useState<TaskListFilter>("pending");
  const [showListsPanel, setShowListsPanel] = useState(false);

  //Set current task list on load.
  useEffect(() => {
    if (allTaskLists.length > 0 && !currentTaskListId) {
      const defaultList = allTaskLists.find((list) => list.id === defaultTaskListId) || allTaskLists[0];
      setCurrentTaskListId(defaultList.id);
    }
  }, [allTaskLists, defaultTaskListId, currentTaskListId, setCurrentTaskListId]);

  const handleSelectList = (list: TaskListInterface) => {
    setCurrentTaskListId(list.id);
  };

  const handleAddList = () => {
    setIsCreateListModalOpen(true);
  };

  if (isLoadingLists) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col bg-bg-primary">
      {/* Task Lists Drawer */}

      <Drawer
        isOpen={showListsPanel}
        onClose={() => setShowListsPanel(false)}
        width="sm"
        position="right"
        title="Task Lists">
        <TaskListPanel
          lists={allTaskLists}
          currentList={currentTaskList}
          onSelectList={handleSelectList}
          onAddList={handleAddList}
        />
      </Drawer>

      {/* Task Details Drawer */}
      <div>{clickedTask && <TaskDetails />}</div>

      {/* Main content */}
      <div className="flex flex-col px-4 py-2 md:px-4 md:py-4 h-full overflow-hidden">
        <div className="flex-shrink-0">
          {/* Header with Task Lists */}
          <TaskViewHeader onToggleLists={() => setShowListsPanel(!showListsPanel)} listsOpen={showListsPanel} />
        </div>

        {/* Empty State when no lists */}
        {!currentTaskList && allTaskLists.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyStates type="no-lists" onCreateListClick={() => setIsCreateListModalOpen(true)} />
          </div>
        )}

        {/* Task list content */}
        {currentTaskList && (
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="flex-shrink-0">
              <TaskStatistics tasks={tasks} filter={filter} onFilterChange={setFilter} />
              {/* Alerts in case some task is overdue */}
              <TaskAlerts tasks={tasks} />
            </div>

            {/* Task list with proper scrolling */}
            <TaskList tasks={tasks} filter={filter} isLoading={isLoadingTasks} />
          </div>
        )}

        {/* Create Task List Modal */}
        <CreateTaskListModal isOpen={isCreateListModalOpen} onClose={() => setIsCreateListModalOpen(false)} />
      </div>
    </div>
  );
}

export default function TasksView() {
  return (
    <TaskViewProvider>
      <TasksViewContent />
    </TaskViewProvider>
  );
}
