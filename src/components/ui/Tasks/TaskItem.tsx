import { useTaskContext } from "@/hooks/useTaskContext";
import { useLabelContext } from "@/hooks/useLabelContext";
import { Calendar, AlertCircle, Clock, CheckCircle2, Tag } from "lucide-react";
import type { TaskItemProps } from "@/data/Tasks/interfaces";
import { ActionButton, BasicDropdown, BasicDropdownItem } from "../Common";

export default function TaskItem({ task }: TaskItemProps) {
  const { clickedTask, setClickedTask, toggleTaskComplete, currentTaskList } = useTaskContext();
  const { labels, createLabelConnection } = useLabelContext();


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
    if (days === 0) return "Dziś";
    if (days === 1) return "Jutro";
    if (days === -1) return "Wczoraj";
    if (days < -1) return `${Math.abs(days)} dni temu`;
    if (days > 1) return `Za ${days} dni`;
    return task.dueDate;
  };

  const handleToggleComplete = async () => {
    if (!currentTaskList) return;
    await toggleTaskComplete(task.id);
  };
  return (
    <li
      style={{
        borderColor: task.labels?.length === 1 ? task.labels[0].color : "#d1d5db", // gray-300
      }}
      className={`border-l-4 rounded-lg p-4 transform 
      ${task.isCompleted ? "bg-gray-100 opacity-75" : "bg-white hover:shadow-md"}
      ${task.labels?.length === 1 ? "border-l-1" : "border-l-gray-300"}
      ${
        clickedTask?.id === task.id
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-b-blue-500 border-b"
          : "hover:bg-gray-50"
      }  
      `}
      onClick={() => {
        // Toggle functionality - if already selected, deselect it
        if (clickedTask?.id === task.id) {
          setClickedTask(null);
        } else {
          setClickedTask(task);
          console.log("Selected task:", task);
        }
      }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Completion checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComplete();
            }}
            className="mt-0.5 text-gray-400 hover:text-blue-500 transition-colors">
            {task.isCompleted ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors" />
            )}
          </button>

          {/* Task content */}
          <div className="">
            <h3
              className={`font-medium text-sm leading-5 transition-colors duration-200 ${
                task.isCompleted
                  ? "line-through text-gray-500"
                  : clickedTask?.id === task.id
                  ? "text-blue-800"
                  : "text-gray-900"
              }`}>
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-xs mt-1 transition-colors duration-200 ${
                  task.isCompleted
                    ? "line-through text-gray-400"
                    : clickedTask?.id === task.id
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}>
                {task.description}
              </p>
            )}

            {/* Due date */}
            {task.dueDate && task.dueDate !== "" && (
              <div
                className={`flex items-center gap-1 mt-2 text-xs transition-colors duration-200 ${
                  isOverdue()
                    ? "text-red-600"
                    : isDueSoon()
                    ? "text-yellow-600"
                    : clickedTask?.id === task.id
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}>
                <Calendar size={12} />
                <span>{formatDueDate()}</span>
                {isOverdue() && <AlertCircle size={12} className="text-red-500" />}
                {isDueSoon() && <Clock size={12} className="text-yellow-500" />}
              </div>
            )}
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex flex-col items-end gap-3">
          {task.isCompleted && <span className="text-xs text-green-600 font-medium">Ukończone</span>}
          {isOverdue() && <span className="text-xs text-red-600 font-medium">Przeterminowane</span>}
          {isDueSoon() && <span className="text-xs text-yellow-600 font-medium">Pilne</span>}
          {labels.length > 0 && task.labels?.length === 0 && (
            <div onClick={(e) => e.stopPropagation()}>
              <BasicDropdown
                trigger={
                  <ActionButton
                    onClick={() => {}}
                    icon={Tag}
                    iconSize={16}
                    justIcon={true}
                    text=""
                    color="white"
                    size="xs"
                  />
                }
                align="right"
                width="w-64"
                closeOnItemClick={true}>
                {labels.length > 0 ? (
                  labels.map((label) => (
                    <BasicDropdownItem
                      key={label.id}
                      onClick={() => {
                        createLabelConnection(task.id, "task", label.id);
                        task.labels?.push(label); // Update local task labels
                      }}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: label.color }} />
                        {label.name}
                      </div>
                    </BasicDropdownItem>
                  ))
                ) : (
                  <BasicDropdownItem icon={Tag} onClick={() => {}}>
                    Brak dostępnych tagów
                  </BasicDropdownItem>
                )}
              </BasicDropdown>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
