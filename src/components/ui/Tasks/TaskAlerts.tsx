import { AlertTriangle, Calendar } from "lucide-react";
import { TaskAlertsProps } from "@/data/Tasks/interfaces";

export default function TaskAlerts({ tasks }: TaskAlertsProps) {
  // Calculate overdue tasks
  const overdueTasks = tasks.filter((task) => {
    if (task.isCompleted) return false;
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });

  // Calculate due soon tasks (within 2 days)
  const dueSoonTasks = tasks.filter((task) => {
    if (task.isCompleted) return false;
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  });

  return (
    <>
      {/* Overdue tasks alert */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2 flex items-center gap-2">
            <AlertTriangle size={18} className="animate-pulse" />
            Masz {overdueTasks.length} przeterminowane zadania
          </h3>
        </div>
      )}

      {/* Due soon tasks alert */}
      {dueSoonTasks.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2 flex items-center gap-2">
            <Calendar size={18} />
            Zadania do wykonania w najbliższych dniach
          </h3>
          <div className="space-y-1">
            {dueSoonTasks.map((task) => (
              <div key={task.id} className="text-yellow-700 text-sm flex justify-between">
                <span>{task.title}</span>
                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString("pl-PL") : "Brak terminu"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
