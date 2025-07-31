import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { TaskStatisticsProps } from "@/data/Tasks/interfaces";

export default function TaskStatistics({ tasks, onFilterChange, filter }: TaskStatisticsProps) {
  // Calculate statistics
  const completedTasks = tasks.filter((task) => task.isCompleted);
  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const overdueTasks = tasks.filter((task) => {
    if (task.isCompleted) return false;
    if (!task.dueDate || task.dueDate === "") return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });

  const getCardClasses = (cardType: "pending" | "completed" | "overdue") => {
    const baseClasses =
      "bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md transform hover:scale-105 relative";
    const selectedClasses = "ring-2 ring-blue-500 shadow-lg";

    return filter === cardType ? `${baseClasses} ${selectedClasses}` : baseClasses;
  };

  const getSelectedIndicator = (cardType: "pending" | "completed" | "overdue") => {
    if (filter === cardType) {
      return <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-5 gap-4 mb-4">
      {/* Pending Tasks */}
      <button onClick={() => onFilterChange("pending")} className="text-left group cursor-pointer">
        <div className={getCardClasses("pending")}>
          {getSelectedIndicator("pending")}
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Clock size={20} />
            <span className="text-sm font-semibold">W toku</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-text-dark mb-1">{pendingTasks.length}</div>
        </div>
      </button>

      {/* Completed Tasks */}
      <button onClick={() => onFilterChange("completed")} className="text-left group cursor-pointer">
        <div className={getCardClasses("completed")}>
          {getSelectedIndicator("completed")}
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle2 size={20} />
            <span className="text-sm font-semibold">Ukończone</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-text-dark mb-1">{completedTasks.length}</div>
        </div>
      </button>

      {/* Overdue Tasks */}
      <button onClick={() => onFilterChange("overdue")} className="text-left group cursor-pointer">
        <div className={getCardClasses("overdue")}>
          {getSelectedIndicator("overdue")}
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle size={20} />
            <span className="text-sm font-semibold">Przeterminowane</span>
          </div>
          <div className="text-3xl font-bold text-gray-800 dark:text-text-dark mb-1">{overdueTasks.length}</div>
        </div>
      </button>
    </div>
  );
}
