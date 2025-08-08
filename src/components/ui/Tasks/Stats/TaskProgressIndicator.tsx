import { TrendingUp } from "lucide-react";
import type { TaskProgressIndicatorProps } from "@/data/Tasks/interfaces";

export default function TaskProgressIndicator({
  completedTasksLength,
  pendingTasksLength,
}: TaskProgressIndicatorProps) {
  const progressPercentage =
    completedTasksLength + pendingTasksLength > 0
      ? (completedTasksLength / (completedTasksLength + pendingTasksLength)) * 100
      : 0;

  return (
    <div className="bg-white  rounded-md p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 ">Postęp zadań</span>
        <span className="text-sm text-gray-500 ">
          {completedTasksLength} z {completedTasksLength + pendingTasksLength}
        </span>
      </div>
      <div className="w-full bg-gray-200  rounded-full h-2">
        <div
          className="bg-green-500  h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500  mt-1">
        <span>{Math.round(progressPercentage)}% ukończone</span>
        <span className="flex items-center gap-1">
          <TrendingUp size={12} />
          Kontynuuj!
        </span>
      </div>
    </div>
  );
}
