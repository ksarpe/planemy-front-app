import { useState, useRef, useEffect } from "react";
import { ChevronDown, List, Calendar, Users } from "lucide-react";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { TaskListInterface } from "@/data/Tasks/interfaces";

export default function TaskListDropdown() {
  const { taskLists, currentTaskList, setCurrentTaskListId, setClickedTask } = useTaskContext();
  const { mainListId } = usePreferencesContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2 shadow-sm hover:shadow-md dark:hover:bg-gray-800/60 transition-all duration-200 min-w-[250px] h-[64px]">
        <List size={18} className="text-gray-500 dark:text-gray-400" />
        <div className="flex-1 text-left">
          {currentTaskList && (
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{currentTaskList.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                {currentTaskList.shared && (
                  <span className="text-blue-600 dark:text-blue-400">
                    <Users size={12} />
                  </span>
                )}
                <span className="text-gray-400 dark:text-gray-500">
                  Ilość zadań: {currentTaskList.totalTasks ?? 0}{" "}
                </span>
              </div>
            </div>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {taskLists.map((list: TaskListInterface) => {
            const isSelected = currentTaskList?.id === list.id;

            return (
              <button
                key={list.id}
                onClick={() => {
                  setCurrentTaskListId(list.id);
                  setClickedTask(null);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                  isSelected ? " dark:bg-blue-900/30 border-l-4 border-l-primary dark:border-l-blue-400" : ""
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div
                      className={`font-medium`}>
                      {list.name}
                    </div>
                    {mainListId === list.id && (
                      <span className="text-xs font-light text-gray-500 dark:text-gray-400">domyślna</span>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {list.shared && (
                        <span className="text-blue-600 dark:text-blue-400">
                          <Users size={12} />
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {list.totalTasks ?? 0} zadań
                      </span>
                    </div>
                  </div>
                  {isSelected && <div className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full"></div>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
