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
  TaskProgressIndicator,
  PendingSharesNotification,
  TaskDetails,
  EmptyStates,
} from "@/components/ui/Tasks";
import Spinner from "../ui/Utils/Spinner";

export default function TasksView() {
  const { taskLists, currentTaskList, clickedTask, loading, createTaskList } = useTaskContext();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareListId, setShareListId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "completed" | "overdue">("pending");

  // Get tasks from current list using new hook
  const tasks = useTasksForList(currentTaskList?.id || null);

  const handleShareList = (listId: string) => {
    setShareListId(listId);
    setIsShareModalOpen(true);
  };

  const handleCreateTaskList = async (name: string) => {
    await createTaskList(name);
  };

  if (!currentTaskList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Pending Shares Notification */}
      <PendingSharesNotification />

      {/* Main panel */}
      <div
        className={`${
          clickedTask ? "w-3/4" : "w-full"
        } rounded-lg shadow-md overflow-auto flex flex-col gap-6 bg-bg-alt dark:bg-bg-dark p-6 transition-all duration-600`}>
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
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-4">
              <TaskStatistics tasks={tasks} filter={filter} onFilterChange={setFilter} />
              <TaskAlerts tasks={tasks} />
              <TaskList tasks={tasks} filter={filter} onAddTaskClick={() => setIsTaskModalOpen(true)} />
            </div>
            <div>
              <TaskProgressIndicator tasks={tasks} />
            </div>
          </div>
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
