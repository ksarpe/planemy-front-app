import type { TaskListProps } from "@shared/data/Tasks/interfaces";
import { useT } from "@shared/hooks/utils/useT";
import { ListX, Plus } from "lucide-react";
import { useState } from "react";
import { SkeletonList, SkeletonTaskCard } from "../Loaders/SkeletonPresets";
import { Button } from "../Utils/button";
import QuickAddTask from "./QuickAddTask";
import TaskItem from "./TaskItem";

export default function TaskList({ filter, tasks, isLoading }: TaskListProps) {
  const { t } = useT();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Loading placeholder to prevent layout jump
  // Loading placeholder to prevent layout jump
  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 bg-bg-primary rounded-2xl overflow-y-auto p-1 scrollbar-hide">
          <div className="space-y-4 p-0 pb-4">
            <SkeletonList count={6} ItemComponent={SkeletonTaskCard} />
          </div>
        </div>
      </div>
    );
  }

  // Calculate filtered tasks
  const completedTasks = tasks.filter((task) => task.isCompleted);
  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const overdueTasks = tasks.filter((task) => {
    if (task.isCompleted) return false;
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });

  // Get filtered tasks based on current filter
  const getFilteredTasks = () => {
    switch (filter) {
      case "pending":
        return pendingTasks;
      case "completed":
        return completedTasks;
      case "overdue":
        return overdueTasks;
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  // Sort tasks by due date and title
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    // Finally by title
    return a.title.localeCompare(b.title);
  });

  // IF THERE ARE NO TASKS TO SHOW
  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 flex flex-col items-center">
        <ListX size={48} className="mx-auto text-text-muted mb-4" />
        <h3 className="text-lg font-medium text-text mb-2">{t("tasks.list.empty.title")}</h3>
        <div className="mb-2 w-full max-w-md mt-4">
          {showQuickAdd ? (
            <QuickAddTask onCancel={() => setShowQuickAdd(false)} />
          ) : (
            <Button onClick={() => setShowQuickAdd(true)} variant="primary" size="lg">
              <Plus size={18} />
              <span className="text-sm">{t("tasks.list.empty.newTask")}</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Add Task Button */}
      <div className={`${showQuickAdd ? "w-full" : "w-fit"} mb-4 flex-shrink-0`}>
        {showQuickAdd ? (
          <QuickAddTask onCancel={() => setShowQuickAdd(false)} />
        ) : (
          <Button onClick={() => setShowQuickAdd(true)} variant="primary" size="lg">
            <Plus size={18} />
            <span className="text-sm">{t("tasks.list.empty.newTask")}</span>
          </Button>
        )}
      </div>

      {/* Scrollable task list - background fills to bottom */}
      <div className="flex-1 bg-bg-primary rounded-2xl overflow-y-auto p-1 scrollbar-hide">
        <ul className="space-y-4 p-0 pb-4">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
}
