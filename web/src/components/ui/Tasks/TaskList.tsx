import { CheckCircle2, Plus } from "lucide-react";
import TaskItem from "./TaskItem";
import QuickAddTask from "./QuickAddTask";
import { useState } from "react";
import { ActionButton } from "../Common";
import Spinner from "../Utils/Spinner";
import { useTranslation } from "react-i18next";
import type { TaskListProps } from "@shared/data/Tasks/interfaces";

export default function TaskList({ filter, tasks, isLoading }: TaskListProps) {
  const { t } = useTranslation();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Loading placeholder to prevent layout jump
  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-8">
        <Spinner />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t("tasks.loading.tasks")}</p>
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

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 flex flex-col items-center">
        <CheckCircle2 size={48} className="mx-auto text-gray-400  mb-4" />
        <h3 className="text-lg font-medium text-gray-600  mb-2">{t("tasks.list.empty.title")}</h3>
        <div className="mb-2 w-full max-w-md mt-4">
          {showQuickAdd ? (
            <QuickAddTask onCancel={() => setShowQuickAdd(false)} />
          ) : (
            <button
              onClick={() => setShowQuickAdd(true)}
              className="w-full flex items-center justify-center gap-2 border-l-4 border-success  bg-success  text-white px-4 py-3 rounded-lg hover:bg-success-hover  cursor-pointer">
              <Plus size={18} />
              <span className="text-sm">{t("tasks.list.empty.newTask")}</span>
            </button>
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
          <ActionButton
            onClick={() => setShowQuickAdd(true)}
            icon={Plus}
            iconSize={16}
            text={t("tasks.list.empty.newTask")}
            color="green"
            size="md"
          />
        )}
      </div>

      {/* Scrollable task list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ul className="space-y-3 pb-4">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
}
