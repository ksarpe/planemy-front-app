import { useState } from "react";
import { useTaskContext } from "@/hooks/useTaskContext";
import { useTasksForList } from "@/firebase/tasks";
import { AddTaskModal } from "@/components/ui/Tasks/Modals/AddTaskModal";
import TaskDetails from "@/components/ui/Tasks/TaskDetails";
import ManageTaskListSharingModal from "@/components/ui/Tasks/Modals/ManageTaskListSharingModal";
import PendingSharesNotification from "@/components/ui/Tasks/PendingSharesNotification";
import TaskViewHeader from "@/components/ui/Tasks/TaskViewHeader";
import TaskStatistics from "@/components/ui/Tasks/TaskStatistics";
import TaskAlerts from "@/components/ui/Tasks/TaskAlerts";
import TaskFilters from "@/components/ui/Tasks/TaskFilters";
import TaskList from "@/components/ui/Tasks/TaskList";
import TaskProgressIndicator from "@/components/ui/Tasks/TaskProgressIndicator";
import EmptyStates from "@/components/ui/Tasks/EmptyStates";
import CreateTaskListModal from "@/components/ui/Tasks/Modals/CreateTaskListModal";

export default function TasksView() {
  const { 
    taskLists, 
    currentTaskList, 
    setCurrentTaskList, 
    clickedTask, 
    addTask,
    createTaskList,
    renameTaskList,
    deleteTaskList,
    clearCompletedTasks,
    uncheckAllTasks,
    loading
  } = useTaskContext();
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareListId, setShareListId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  // Get tasks from current list using new hook
  const tasks = useTasksForList(currentTaskList?.id || null);

  const handleAddTask = async (title: string, description?: string | null, dueDate?: string | null) => {
    if (!currentTaskList) return;
    await addTask(currentTaskList.id, title, description, dueDate);
  };

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
      <div className={`${clickedTask ? 'w-2/3' : 'w-full'} rounded-3xl shadow-md overflow-auto flex flex-col gap-6 bg-bg-alt dark:bg-bg-dark p-6 transition-all duration-300`}>
        
        {/* Header with Task Lists */}
        <TaskViewHeader
          taskLists={taskLists}
          currentTaskList={currentTaskList}
          onTaskListChange={setCurrentTaskList}
          onNewListClick={() => setIsListModalOpen(true)}
          onShareListClick={handleShareList}
          onRenameList={renameTaskList}
          onDeleteList={deleteTaskList}
          onClearCompletedTasks={clearCompletedTasks}
          onUncheckAllTasks={uncheckAllTasks}
          loading={loading}
        />

        {/* No task lists state */}
        {taskLists.length === 0 && (
          <EmptyStates 
            type="no-lists" 
            onCreateListClick={() => setIsListModalOpen(true)} 
          />
        )}

        {/* No current list selected */}
        {taskLists.length > 0 && !currentTaskList && (
          <EmptyStates type="no-list-selected" onCreateListClick={() => {}} />
        )}

        {/* Task list content */}
        {currentTaskList && (
          <>
            {/* Statistics Cards */}
            <TaskStatistics tasks={tasks} />

            {/* Alerts for overdue and due soon tasks */}
            <TaskAlerts tasks={tasks} />

            {/* Filter Buttons */}
            <TaskFilters 
              filter={filter} 
              onFilterChange={setFilter} 
              tasks={tasks} 
            />

            {/* Tasks List */}
            <TaskList 
              tasks={tasks} 
              filter={filter} 
              onAddTaskClick={() => setIsTaskModalOpen(true)}
              loading={loading}
            />

            {/* Progress indicator */}
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
        {isTaskModalOpen && (
          <AddTaskModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onSubmit={handleAddTask}
          />
        )}

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
      {clickedTask && (
        <div className="w-1/3 bg-bg-alt dark:bg-bg-dark rounded-3xl p-6 shadow-md transition-all duration-300">
          <TaskDetails />
        </div>
      )}
    </div>
  );
}
