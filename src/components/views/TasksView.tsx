import { useState } from "react";
import { useTaskContext } from "@/hooks/useTaskContext";
import { useTasksForList } from "@/firebase/tasks";
import {
  TaskViewHeader,
  CreateTaskListModal,
  AddTaskModal,
  ManageTaskListSharingModal,
  TaskList,
  TaskStatistics,
  TaskAlerts,
  TaskFilters,
  TaskProgressIndicator,
  PendingSharesNotification,
  TaskDetails,
  EmptyStates,
} from "@/components/ui/Tasks";

export default function TasksView() {
  const { taskLists, currentTaskList, clickedTask, loading, createTaskList } = useTaskContext();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareListId, setShareListId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all");

  // Get tasks from current list using new hook
  const tasks = useTasksForList(currentTaskList?.id || null);

  const handleShareList = (listId: string) => {
    setShareListId(listId);
    setIsShareModalOpen(true);
  };

  const handleCreateTaskList = async (name: string) => {
    await createTaskList(name);
  };

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Pending Shares Notification */}
      <PendingSharesNotification />

      {/* Main panel */}
      <div
        className={`${
          clickedTask ? "w-2/3" : "w-full"
        } rounded-3xl shadow-md overflow-auto flex flex-col gap-6 bg-bg-alt dark:bg-bg-dark p-6 transition-all duration-300`}>
        {/* Header with Task Lists */}
        <TaskViewHeader onNewListClick={() => setIsListModalOpen(true)} onShareListClick={handleShareList} />

        {/* No task lists state */}
        {taskLists.length === 0 && <EmptyStates type="no-lists" onCreateListClick={() => setIsListModalOpen(true)} />}

        {/* No current list selected */}
        {taskLists.length > 0 && !currentTaskList && (
          <EmptyStates type="no-list-selected" onCreateListClick={() => {}} />
        )}

        {/* Task list content */}
        {currentTaskList && (
          <>
            <TaskStatistics tasks={tasks} />
            <TaskAlerts tasks={tasks} />
            <TaskFilters filter={filter} onFilterChange={setFilter} tasks={tasks} />
            <TaskList tasks={tasks} filter={filter} onAddTaskClick={() => setIsTaskModalOpen(true)} loading={loading} />
            <TaskProgressIndicator tasks={tasks} />
          </>
        )}

        {/* Create Task List Modal */}
        <CreateTaskListModal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
          onSubmit={handleCreateTaskList}
          loading={loading}
        />

        {/* Add Task Modal */}
        {isTaskModalOpen && <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />}

        {/* Share Task List Modal */}
        {isShareModalOpen && shareListId && currentTaskList && (
          <ManageTaskListSharingModal
            isOpen={isShareModalOpen}
            onClose={() => {
              setIsShareModalOpen(false);
              setShareListId(null);
            }}
            listId={shareListId}
            listName={currentTaskList.name}
          />
        )}
      </div>

      {/* Right Panel - Task Details */}
      {/* Show only when there is task selected */}
      {clickedTask && <TaskDetails />}
    </div>
  );
}
