import { ArrowBigRightDash, FolderPlus } from "lucide-react";
import TaskListDropdown from "./TaskListDropdown";
import TaskListActions from "./TaskListActions";
import { useTaskContext } from "@/hooks/useTaskContext";

interface TaskViewHeaderProps {
  onNewListClick: () => void;
  onShareListClick: (listId: string) => void;
}

export default function TaskViewHeader({ onNewListClick }: TaskViewHeaderProps) {
  const { currentTaskList, loading } = useTaskContext();
  if (loading) return null;
  return (
    <div className="flex justify-between items-center">
      {/* Task List Dropdown and Actions */}
      {currentTaskList && (
        <>
          <div className="flex items-center gap-3">
            <TaskListDropdown />
            <TaskListActions />
            {/* New List Button */}
            <button
              onClick={onNewListClick}
              className="flex items-center gap-2 bg-green-600 text-white px-4 rounded-lg hover:opacity-90 transition-all duration-200 min-h-[58px] shadow-sm hover:shadow-md cursor-pointer">
              <FolderPlus size={18} />
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">Utwórz listę</span>
              </div>
            </button>
          </div>
          {/* Pomodoro Mode */}
          <button
            onClick={onNewListClick}
            className="flex bg-orange-600 text-white px-4 rounded-lg hover:opacity-90 transition-all duration-200 min-h-[58px] shadow-sm hover:shadow-md cursor-pointer">
            <div className="flex items-center gap-2">
              <ArrowBigRightDash size={24} />
              <span className="text-sm font-medium">Tryb Pomodoro</span>
            </div>
          </button>{" "}
        </>
      )}
    </div>
  );
}
