import { useState, useRef, useEffect } from "react";
import { ChevronDown, List, Calendar, CheckCircle2 } from "lucide-react";
import { TaskListInterface } from "@/data/types";

interface TaskListDropdownProps {
  taskLists: TaskListInterface[];
  currentTaskList: TaskListInterface | null;
  onTaskListChange: (list: TaskListInterface | null) => void;
}

export default function TaskListDropdown({
  taskLists,
  currentTaskList,
  onTaskListChange
}: TaskListDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getTaskStats = (list: TaskListInterface) => {
    const completed = list.tasks.filter(task => task.isCompleted).length;
    const total = list.tasks.length;
    const pending = total - completed;
    return { completed, total, pending };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 min-w-[250px]"
      >
        <List size={18} className="text-gray-500" />
        <div className="flex-1 text-left">
          {currentTaskList ? (
            <div>
              <div className="font-medium text-gray-900">{currentTaskList.name}</div>
              <div className="text-xs text-gray-500">
                {getTaskStats(currentTaskList).total} zadań
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Wybierz listę zadań</div>
          )}
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {taskLists.map(list => {
            const stats = getTaskStats(list);
            const isSelected = currentTaskList?.id === list.id;
            
            return (
              <button
                key={list.id}
                onClick={() => {
                  onTaskListChange(list);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {list.name}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {stats.total} zadań
                      </span>
                      {stats.completed > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 size={12} />
                          {stats.completed} ukończonych
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
