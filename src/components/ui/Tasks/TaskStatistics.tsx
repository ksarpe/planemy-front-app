import { 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { TaskInterface } from "@/data/types";

interface TaskStatisticsProps {
  tasks: TaskInterface[];
}

export default function TaskStatistics({ tasks }: TaskStatisticsProps) {
  // Calculate statistics
  const completedTasks = tasks.filter(task => task.isCompleted);
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const overdueTasks = tasks.filter(task => {
    if (task.isCompleted) return false;
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <ListTodo size={18} />
          <span className="text-sm font-medium">Wszystkie</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
          {tasks.length}
        </div>
      </div>

      <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-yellow-600 mb-1">
          <Clock size={18} />
          <span className="text-sm font-medium">W toku</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
          {pendingTasks.length}
        </div>
      </div>

      <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-green-600 mb-1">
          <CheckCircle2 size={18} />
          <span className="text-sm font-medium">Ukończone</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
          {completedTasks.length}
        </div>
      </div>

      <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-red-600 mb-1">
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">Przeterminowane</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
          {overdueTasks.length}
        </div>
      </div>
    </div>
  );
}
