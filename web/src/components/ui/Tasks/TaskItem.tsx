import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useUpdateTask } from "@shared/hooks/tasks/useTasks";
import { useTranslation } from "react-i18next";
import { Calendar, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import type { TaskItemProps } from "@shared/data/Tasks/interfaces";

export default function TaskItem({ task }: TaskItemProps) {
  const { t } = useTranslation();
  const { mutate: updateTask } = useUpdateTask();
  const { clickedTask, setClickedTask } = useTaskViewContext();
  //const { labels, createLabelConnection, removeLabelConnection } = useLabelContext();

  const getDaysUntilDue = () => {
    if (!task.dueDate || task.dueDate === "") return null;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = () => {
    const days = getDaysUntilDue();
    return days !== null && days < 0 && !task.isCompleted;
  };

  const isDueSoon = () => {
    const days = getDaysUntilDue();
    return days !== null && days >= 0 && days <= 2 && !task.isCompleted;
  };

  const formatDueDate = () => {
    if (!task.dueDate || task.dueDate === "") return null;
    const days = getDaysUntilDue()!;
    if (days === 0) return t("tasks.dates.today");
    if (days === 1) return t("tasks.dates.tomorrow");
    if (days === -1) return t("tasks.dates.yesterday");
    if (days < -1) return t("tasks.dates.daysAgo", { count: Math.abs(days) });
    if (days > 1) return t("tasks.dates.inDays", { count: days });
    return task.dueDate;
  };

  const handleToggleComplete = async () => {
    updateTask({ id: task.id, data: { isCompleted: !task.isCompleted } });
  };

  return (
    <li
      style={{
        borderColor: task.labels?.length === 1 ? task.labels[0].color : "#dcc5b2", // gray-300
      }}
      className={`border-l-4 rounded-lg p-4 bg-white  hover:-translate-y-0.5 hover:shadow-md 
      ${clickedTask?.id === task.id ? "border-b border-l-10 border-r-10 border-t " : "hover:bg-gray-50 "}`}
      onClick={() => {
        // Toggle functionality - if already selected, deselect it
        if (clickedTask?.id === task.id) {
          setClickedTask(null);
        } else {
          setClickedTask(task);
        }
      }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Completion checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComplete();
            }}>
            {task.isCompleted ? (
              <CheckCircle2 size={20} className="text-green-500 " />
            ) : (
              <div className="w-5 h-5 border-1 border-gray-300  hover:border-green-500  rounded-full hover:bg-green-500  transition-colors" />
            )}
          </button>

          {/* Task content */}
          <div className="">
            <h3
              className={`font-medium text-sm leading-5 transition-colors duration-200 ${
                task.isCompleted ? "line-through text-gray-500 " : ""
              }`}>
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-xs mt-1 transition-colors duration-200 ${
                  task.isCompleted
                    ? "line-through text-gray-400 "
                    : clickedTask?.id === task.id
                    ? "text-blue-600 "
                    : "text-gray-600 "
                }`}>
                {task.description}
              </p>
            )}

            {/* Due date */}
            {task.dueDate && task.dueDate !== "" && (
              <div
                className={`flex items-center gap-1 mt-2 text-xs transition-colors duration-200 ${
                  isOverdue()
                    ? "text-red-600 "
                    : isDueSoon()
                    ? "text-yellow-600 "
                    : clickedTask?.id === task.id
                    ? "text-blue-600 "
                    : "text-gray-500 "
                }`}>
                <Calendar size={12} />
                <span>{formatDueDate()}</span>
                {isOverdue() && <AlertCircle size={12} className="text-red-500 " />}
                {isDueSoon() && <Clock size={12} className="text-yellow-500 " />}
              </div>
            )}
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-col items-end gap-3">
          {task.isCompleted && (
            <span className="text-xs text-green-600  font-medium">{t("tasks.status.completed")}</span>
          )}
          {isOverdue() && <span className="text-xs text-red-600  font-medium">{t("tasks.item.overdue")}</span>}
          {isDueSoon() && <span className="text-xs text-yellow-600  font-medium">{t("tasks.item.urgent")}</span>}

          {/* If task has no labels, show the button to add labels */}
        </div>
      </div>
    </li>
  );
}
