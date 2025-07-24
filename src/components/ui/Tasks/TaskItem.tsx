import type { TaskInterface } from "@/data/types";
import { useTaskContext } from "@/context/TaskContext";
import { Calendar, AlertCircle, Clock, CheckCircle2, RotateCcw } from "lucide-react";

interface TaskItemProps {
  task: TaskInterface;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { clickedTask, setClickedTask, markTaskAsDoneOrUndone } = useTaskContext();

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = () => {
    return getDaysUntilDue() < 0;
  };

  const isDueSoon = () => {
    const days = getDaysUntilDue();
    return days >= 0 && days <= 2;
  };

  const formatDueDate = () => {
    const days = getDaysUntilDue();
    if (days === 0) return "Dziś";
    if (days === 1) return "Jutro";
    if (days === -1) return "Wczoraj";
    if (days < 0) return `${Math.abs(days)} dni temu`;
    if (days <= 7) return `Za ${days} dni`;
    return new Date(task.dueDate).toLocaleDateString('pl-PL');
  };

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markTaskAsDoneOrUndone(task.id);
  };

  return (
    <li
      onClick={() => {
        if (clickedTask?.id === task.id) {
          setClickedTask(null);
        } else {
          setClickedTask(task);
        }
      }}
      className={`
        border-l-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer
        ${task.completed ? 'bg-gray-100 opacity-75' : 'bg-white hover:shadow-md'}
        ${getPriorityColor(task.priority)}
        ${clickedTask?.id === task.id ? 'ring-2 ring-blue-300' : ''}
        ${isOverdue() && !task.completed ? 'ring-2 ring-red-300' : ''}
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getPriorityIcon(task.priority)}</span>
              <h4 className={`font-medium text-base truncate ${
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}>
                {task.title}
              </h4>
              {task.priority && (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority === 'high' ? 'Wysoki' : task.priority === 'medium' ? 'Średni' : 'Niski'}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-1 ${
                isOverdue() && !task.completed ? 'text-red-600' : 
                isDueSoon() && !task.completed ? 'text-yellow-600' : 
                'text-gray-500'
              }`}>
                <Calendar size={14} />
                <span className="font-medium">{formatDueDate()}</span>
                {isOverdue() && !task.completed && (
                  <AlertCircle size={14} className="text-red-500" />
                )}
                {isDueSoon() && !task.completed && (
                  <Clock size={14} className="text-yellow-500" />
                )}
              </div>

              {task.createdAt && (
                <div className="text-gray-400 text-xs">
                  Utworzono: {new Date(task.createdAt).toLocaleDateString('pl-PL')}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleToggleComplete}
              className={`
                p-2 rounded-full transition-colors
                ${task.completed 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-green-600'
                }
              `}
              title={task.completed ? "Oznacz jako nieukończone" : "Oznacz jako ukończone"}
            >
              {task.completed ? (
                <RotateCcw size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
            </button>

            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              task.completed ? "bg-green-500 text-white" : "bg-blue-100 text-blue-700"
            }`}>
              {task.completed ? "Ukończone" : "W toku"}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
