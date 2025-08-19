import { useState, useRef, useEffect } from "react";
import { ChevronDown, List, Users } from "lucide-react";
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
        className="flex items-center gap-3 bg-white  border border-gray-200  rounded-md px-4 py-2 shadow-sm hover:shadow-md truncate transition-all duration-200 h-[64px]">
        <List size={18} className="text-gray-500 " />
        <div className="flex-1 text-left">
          {currentTaskList && (
            <div>
              <div className="font-medium text-gray-900 ">{currentTaskList.name}</div>
              <div className="text-xs text-gray-500  flex items-center gap-2">
                {currentTaskList.shared && (
                  <span className="text-blue-600 ">
                    <Users size={12} />
                  </span>
                )}
                <span className="text-gray-400 flex-shrink-0">Ilość zadań: {currentTaskList.totalTasks ?? 0} </span>
              </div>
            </div>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400  transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white  border border-gray-200  rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
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
                className={`w-full px-4 py-3 text-left hover:bg-gray-50  transition-colors border-b border-gray-100  last:border-b-0 ${
                  isSelected ? "  border-l-4 border-l-primary " : ""
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={`font-medium`}>{list.name}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 ">
                      {list.shared && (
                        <span className="text-blue-600 ">
                          <Users size={12} />
                        </span>
                      )}
                      <span className="">{list.totalTasks ?? 0} zadań</span>
                      {mainListId === list.id && <span className="text-xs font-light text-primary ">domyślna</span>}
                    </div>
                  </div>
                  {isSelected && <div className="w-2 h-2 bg-primary  rounded-full"></div>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
