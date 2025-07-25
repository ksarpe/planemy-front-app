import type { TaskInterface } from "@/data/types";
import { useTaskContext } from "@/hooks/useTaskContext";
import { Calendar, AlertCircle, Clock, CheckCircle2, Tag } from "lucide-react";

interface TaskItemProps {
  task: TaskInterface;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { clickedTask, setClickedTask, toggleTaskComplete, currentTaskList } = useTaskContext();

  const getDaysUntilDue = () => {
    if (!task.dueDate) return null;
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
    if (!task.dueDate) return null;
    const days = getDaysUntilDue()!;
    if (days === 0) return "Dziś";
    if (days === 1) return "Jutro";
    if (days === -1) return "Wczoraj";
    if (days < -1) return `${Math.abs(days)} dni temu`;
    if (days > 1) return `Za ${days} dni`;
    return task.dueDate;
  };

  const handleToggleComplete = async () => {
    if (!currentTaskList) return;
    await toggleTaskComplete(currentTaskList.id, task.id);
  };

  return (
    <li
      className={`border-l-4 rounded-lg p-4 transition-all duration-200 cursor-pointer
        ${task.isCompleted ? 'bg-gray-100 opacity-75' : 'bg-white hover:shadow-md'}
        ${isOverdue() ? 'border-l-red-500 ring-2 ring-red-200' : 
          isDueSoon() ? 'border-l-yellow-500' : 'border-l-gray-300'}
        ${clickedTask?.id === task.id ? 'ring-2 ring-blue-300' : ''}
      `}
      onClick={() => setClickedTask(task)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Completion checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComplete();
            }}
            className="mt-0.5 text-gray-400 hover:text-blue-500 transition-colors"
          >
            {task.isCompleted ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors" />
            )}
          </button>

          {/* Task content */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm leading-5 ${
              task.isCompleted ? "line-through text-gray-500" : "text-gray-900"
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`text-xs mt-1 ${
                task.isCompleted ? "line-through text-gray-400" : "text-gray-600"
              }`}>
                {task.description}
              </p>
            )}

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.labels.map((label, index) => (
                  <span
                    key={label.id || index}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                    style={{ backgroundColor: label.color + '20', color: label.color }}
                  >
                    <Tag size={10} />
                    {label.name}
                  </span>
                ))}
              </div>
            )}

            {/* Due date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${
                isOverdue() ? 'text-red-600' :
                isDueSoon() ? 'text-yellow-600' :
                'text-gray-500'
              }`}>
                <Calendar size={12} />
                <span>{formatDueDate()}</span>
                {isOverdue() && (
                  <AlertCircle size={12} className="text-red-500" />
                )}
                {isDueSoon() && (
                  <Clock size={12} className="text-yellow-500" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-col items-end gap-1">
          {task.isCompleted && (
            <span className="text-xs text-green-600 font-medium">Ukończone</span>
          )}
          {isOverdue() && (
            <span className="text-xs text-red-600 font-medium">Przeterminowane</span>
          )}
          {isDueSoon() && (
            <span className="text-xs text-yellow-600 font-medium">Pilne</span>
          )}
        </div>
      </div>
    </li>
  );
}
