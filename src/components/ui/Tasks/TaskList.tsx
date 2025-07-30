import { CheckCircle2, Plus } from "lucide-react";
import TaskItem from "./TaskItem";
import QuickAddTask from "./QuickAddTask";
import { TaskInterface } from "@/data/types";
import { useState } from "react";

interface TaskListProps {
  filter: "all" | "pending" | "completed" | "overdue";
  tasks: TaskInterface[]; // Optional tasks prop for filtering
}

export default function TaskList({ filter, tasks }: TaskListProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
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
        <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Brak zadań</h3>
        <p className="text-gray-500">
          {filter === "all" ? "Dodaj swoje pierwsze zadanie do tej listy." : `Brak zadań w wybranej kategorii.`}
        </p>
        <div className="mb-2 w-full max-w-md mt-4">
          {showQuickAdd ? (
            <QuickAddTask onCancel={() => setShowQuickAdd(false)} />
          ) : (
            <button
              onClick={() => setShowQuickAdd(true)}
              className="w-full flex items-center justify-center gap-2 border-l-4 border-green-700 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer">
              <Plus size={18} />
              <span className="text-sm">Nowe zadanie</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0">
      <ul className="space-y-3 overflow-auto py-2">
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
      {/* Add Task Button */}
      <div className={`mb-3 ${showQuickAdd ? "w-full" : "w-fit"} mt-1`}>
        {showQuickAdd ? (
          <QuickAddTask onCancel={() => setShowQuickAdd(false)} />
        ) : (
          <button
            onClick={() => setShowQuickAdd(true)}
            className="w-full flex items-center justify-center gap-2 border-l-4 border-green-700 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer">
            <Plus size={18} />
            <span className="text-sm">Nowe zadanie</span>
          </button>
        )}
      </div>
    </div>
  );
}
