import { FolderPlus, Share2 } from "lucide-react";
import { TaskListInterface } from "@/data/types";
import TaskListDropdown from "./TaskListDropdown";
import TaskListActions from "./TaskListActions";

interface TaskViewHeaderProps {
  taskLists: TaskListInterface[];
  currentTaskList: TaskListInterface | null;
  onTaskListChange: (list: TaskListInterface | null) => void;
  onNewListClick: () => void;
  onShareListClick: (listId: string) => void;
  onRenameList: (listId: string, newName: string) => void;
  onDeleteList: (listId: string) => void;
  onClearCompletedTasks: (listId: string) => void;
  onUncheckAllTasks: (listId: string) => void;
  loading: boolean;
}

export default function TaskViewHeader({
  taskLists,
  currentTaskList,
  onTaskListChange,
  onNewListClick,
  onShareListClick,
  onRenameList,
  onDeleteList,
  onClearCompletedTasks,
  onUncheckAllTasks,
  loading
}: TaskViewHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      {/* Task List Dropdown and Actions */}
      <div className="flex items-center gap-3">
        {taskLists.length > 0 && (
          <TaskListDropdown
            taskLists={taskLists}
            currentTaskList={currentTaskList}
            onTaskListChange={onTaskListChange}
          />
        )}
        
        {/* Task List Actions */}
        {currentTaskList && (
          <TaskListActions
            currentTaskList={currentTaskList}
            onRenameList={onRenameList}
            onDeleteList={onDeleteList}
            onClearCompletedTasks={onClearCompletedTasks}
            onUncheckAllTasks={onUncheckAllTasks}
            loading={loading}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        

        {/* New List Button */}
        <button
          onClick={onNewListClick}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          disabled={loading}
        >
          <FolderPlus size={18} />
          Nowa lista
        </button>
        
        {/* Share Button */}
        {currentTaskList && (
          <button
            onClick={() => onShareListClick(currentTaskList.id)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            <Share2 size={18} />
            Udostępnij
          </button>
        )}
      </div>
    </div>
  );
}
