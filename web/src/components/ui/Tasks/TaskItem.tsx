import type { TaskItemProps } from "@shared/data/Tasks/interfaces";
import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useUpdateTask } from "@shared/hooks/tasks/useTasks";
import { AlertCircle, Calendar, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

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
    updateTask({ id: task.id, data: { isCompleted: !task.isCompleted }, listId: task.task_list_id });
  };

  return (
    <li
      style={{
        borderColor: task.labels?.length === 1 ? task.labels[0].color : "#dcc5b2", // gray-300
      }}
      className={`border-l-4 rounded-2xl p-4 bg-bg text-text hover:bg-bg-muted-light cursor-pointer
      ${clickedTask?.id === task.id ? "border-b border-l-10 border-r-10 border-t " : "hover:bg-bg-hover "}`}
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
              <CheckCircle2 size={20} className="text-primary" />
            ) : (
              <div className="w-5 h-5 border-1 border-text-muted-more rounded-full hover:bg-success hover:border-success transition-colors" />
            )}
          </button>

          {/* Task content */}
          <div className="">
            <h3
              className={`font-medium text-sm leading-5 transition-colors duration-200 ${
                task.isCompleted ? "line-through text-text-muted " : ""
              }`}>
              {task.title}
            </h3>

            {task.task_description && (
              <p
                className={`text-xs mt-1 transition-colors duration-200 ${
                  task.isCompleted
                    ? "line-through text-text-muted "
                    : clickedTask?.id === task.id
                    ? "text-primary "
                    : "text-text-muted "
                }`}>
                {task.task_description}
              </p>
            )}

            {/* Due date */}
            {task.dueDate && task.dueDate !== "" && (
              <div
                className={`flex items-center gap-1 mt-2 text-xs transition-colors duration-200 ${
                  isOverdue()
                    ? "text-negative "
                    : isDueSoon()
                    ? "text-warning "
                    : clickedTask?.id === task.id
                    ? "text-primary "
                    : "text-text-muted "
                }`}>
                <Calendar size={12} />
                <span>{formatDueDate()}</span>
                {isOverdue() && <AlertCircle size={12} className="text-negative" />}
                {isDueSoon() && <Clock size={12} className="text-warning" />}
              </div>
            )}
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-col items-end gap-3">
          {task.isCompleted && <span className="text-xs text-success font-medium">{t("tasks.status.completed")}</span>}
          {isOverdue() && <span className="text-xs text-negative font-medium">{t("tasks.item.overdue")}</span>}
          {isDueSoon() && <span className="text-xs text-warning font-medium">{t("tasks.item.urgent")}</span>}

          {/* If task has no labels, show the button to add labels */}
        </div>
      </div>
    </li>
  );
}
