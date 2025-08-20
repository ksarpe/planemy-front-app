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
    <div className="h-full flex flex-col">
      {/* Task Details Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-bg-alt border-l border-bg-hover shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          clickedTask ? "translate-x-0" : "translate-x-full"
        }`}>
        {clickedTask && <TaskDetails />}
      </div>

      {/* Main content - remove redundant height and overflow classes */}
      <div className="flex flex-col p-6 gap-4">
        <div className="">
          {/* Header with Task Lists */}
          <TaskViewHeader
            tasks={tasks}
            onNewListClick={() => setIsCreateListModalOpen(true)}
            onShareListClick={handleShareList}
          />
        </div>

        {!currentTaskList && (!taskLists || taskLists.length === 0) && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyStates type="no-lists" onCreateListClick={() => setIsCreateListModalOpen(true)} />
          </div>
        )}

        {/* Task list content */}
        {currentTaskList && (
          <div className="flex flex-col pb-4">
            <div>
              <TaskStatistics tasks={tasks} filter={filter} onFilterChange={setFilter} />
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
    </div>
  );
}
