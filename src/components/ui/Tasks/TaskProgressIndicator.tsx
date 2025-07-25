import { TrendingUp } from "lucide-react";
import { TaskInterface } from "@/data/types";

interface TaskProgressIndicatorProps {
  tasks: TaskInterface[];
}

export default function TaskProgressIndicator({ tasks }: TaskProgressIndicatorProps) {
  const completedTasks = tasks.filter(task => task.isCompleted);
  const progressPercentage = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  if (tasks.length === 0) return null;

  return (
    <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-text-dark">
          Postęp zadań
        </span>
        <span className="text-sm text-gray-500">
          {completedTasks.length} z {tasks.length}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{Math.round(progressPercentage)}% ukończone</span>
        <span className="flex items-center gap-1">
          <TrendingUp size={12} />
          Kontynuuj!
        </span>
      </div>
    </div>
  );
}
