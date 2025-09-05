import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { TaskStatisticsProps } from "@shared/data/Tasks/interfaces";
import StatisticCard from "./StatisticCard";
import TaskProgressIndicator from "@/components/ui/Tasks/Stats/TaskProgressIndicator";

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
    <div className="grid grid-cols-9 gap-2">
      {/* Task Statistics Cards */}
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
        title="Zaległe"
        count={overdueTasks.length}
        icon={AlertTriangle}
        iconColor="text-red-600"
        isSelected={filter === "overdue"}
        onClick={() => onFilterChange("overdue")}
      />
      <div className="col-span-6">
        <TaskProgressIndicator completedTasksLength={completedTasks.length} pendingTasksLength={pendingTasks.length} />
      </div>
    </div>
  );
}
