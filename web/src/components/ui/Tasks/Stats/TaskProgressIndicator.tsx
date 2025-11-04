import type { TaskProgressIndicatorProps } from "@shared/data/Tasks/interfaces";

export default function TaskProgressIndicator({
  completedTasksLength,
  pendingTasksLength,
}: TaskProgressIndicatorProps) {
  const progressPercentage =
    completedTasksLength + pendingTasksLength > 0
      ? (completedTasksLength / (completedTasksLength + pendingTasksLength)) * 100
      : 0;

  return (
    <div className="bg-bg-alt  text-text border border-bg-muted-light rounded-2xl p-4 shadow-md text-sm">
      <div className="flex justify-between items-center mb-2">
        <span>Progress</span>
        {completedTasksLength} of {completedTasksLength + pendingTasksLength}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
}
