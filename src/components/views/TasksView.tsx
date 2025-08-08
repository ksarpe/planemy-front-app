import { useState } from "react";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import {
  TaskViewHeader,
  CreateTaskListModal,
  ManageTaskListSharingModal,
  TaskList,
  TaskStatistics,
  TaskAlerts,
  TaskDetails,
  EmptyStates,
} from "@/components/ui/Tasks";
import Spinner from "../ui/Utils/Spinner";
import { useTaskLists, useCreateTaskList } from "@/hooks/tasks/useTasksLists";
import type { TaskListFilter } from "@/data/Tasks/types";

export default function TasksView() {
  const { currentTaskListId, currentTaskList, clickedTask } = useTaskContext();
  const { data: taskLists, isLoading: areListsLoading } = useTaskLists();
  const { data: tasksData, isLoading: loading } = useTasks(currentTaskListId);
  const { mutate: createTaskList } = useCreateTaskList();
  const tasks = tasksData ? tasksData : [];

  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareListId, setShareListId] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskListFilter>("pending");

  // Get tasks from current list using new hook

  const handleShareList = (listId: string) => {
    setShareListId(listId);
    setIsShareModalOpen(true);
  };

  const handleCreateTaskList = async (name: string) => {
    createTaskList(name);
  };

  if (areListsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner />
        <p>Ładowanie list...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Main panel */}
      <div
        className={`${
          clickedTask ? "w-4/5" : "w-full"
        } relative rounded-md overflow-auto scrollbar-hide flex flex-col gap-6 bg-bg  p-6 transition-all duration-600`}>
        {/* Header with Task Lists */}
        <TaskViewHeader
          tasks={tasks}
          onNewListClick={() => setIsCreateListModalOpen(true)}
          onShareListClick={handleShareList}
        />

        {!currentTaskList && (!taskLists || taskLists.length === 0) && (
          <EmptyStates type="no-lists" onCreateListClick={() => setIsCreateListModalOpen(true)} />
        )}

        {/* Task list content */}
        {currentTaskList && (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-4">
              <TaskStatistics tasks={tasks} filter={filter} onFilterChange={setFilter} />
              <TaskAlerts tasks={tasks} />
              <TaskList tasks={tasks} filter={filter} isLoading={loading} />
            </div>
          </div>
        )}

        {/* Create Task List Modal */}
        <CreateTaskListModal
          isOpen={isCreateListModalOpen}
          onClose={() => setIsCreateListModalOpen(false)}
          onSubmit={handleCreateTaskList}
          loading={loading}
        />
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
