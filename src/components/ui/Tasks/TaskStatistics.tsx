import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { TaskStatisticsProps } from "@/data/Tasks/interfaces";
import StatisticCard from "./Stats/StatisticCard";

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

  return (
    <div className="mb-4">
      {/* Task Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatisticCard
          title="W toku"
          count={pendingTasks.length}
          icon={Clock}
          iconColor="text-amber-600"
          isSelected={filter === "pending"}
          onClick={() => onFilterChange("pending")}
        />

        <StatisticCard
          title="Ukończone"
          count={completedTasks.length}
          icon={CheckCircle2}
          iconColor="text-green-600"
          isSelected={filter === "completed"}
          onClick={() => onFilterChange("completed")}
        />

        <StatisticCard
          title="Przetermin"
          count={overdueTasks.length}
          icon={AlertTriangle}
          iconColor="text-red-600"
          isSelected={filter === "overdue"}
          onClick={() => onFilterChange("overdue")}
        />
      </div>
    </div>
  );
}
