import { List, Plus, FolderPlus, Share2 } from "lucide-react";
import { TaskListInterface } from "@/data/types";

interface TaskViewHeaderProps {
  taskLists: TaskListInterface[];
  currentTaskList: TaskListInterface | null;
  onTaskListChange: (list: TaskListInterface | null) => void;
  onNewListClick: () => void;
  onAddTaskClick: () => void;
  onShareListClick: (listId: string) => void;
  loading: boolean;
}

export default function TaskViewHeader({
  taskLists,
  currentTaskList,
  onTaskListChange,
  onNewListClick,
  onAddTaskClick,
  onShareListClick,
  loading
}: TaskViewHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold">Zadania</h1>
          
          {/* Task List Selector */}
          {taskLists.length > 0 && (
            <div className="flex items-center gap-2">
              <List size={18} className="text-gray-500" />
              <select
                value={currentTaskList?.id || ""}
                onChange={(e) => {
                  const list = taskLists.find(l => l.id === e.target.value);
                  onTaskListChange(list || null);
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {taskLists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.name} ({list.tasks.length})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onNewListClick}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          disabled={loading}
        >
          <FolderPlus size={18} />
          Nowa lista
        </button>
        
        {currentTaskList && (
          <>
            <button
              onClick={onAddTaskClick}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              <Plus size={18} />
              Dodaj zadanie
            </button>
            
            <button
              onClick={() => onShareListClick(currentTaskList.id)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              <Share2 size={18} />
              Udostępnij
            </button>
          </>
        )}
      </div>
    </div>
  );
}
