import { CheckCircle2, Plus } from "lucide-react";
import { TaskInterface } from "@/data/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: TaskInterface[];
  filter: 'all' | 'pending' | 'completed' | 'overdue';
  onAddTaskClick: () => void;
  loading?: boolean;
}

export default function TaskList({ tasks, filter, onAddTaskClick, loading = false }: TaskListProps) {
  // Calculate filtered tasks
  const completedTasks = tasks.filter(task => task.isCompleted);
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const overdueTasks = tasks.filter(task => {
    if (task.isCompleted) return false;
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });

  // Get filtered tasks based on current filter
  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending': return pendingTasks;
      case 'completed': return completedTasks;
      case 'overdue': return overdueTasks;
      default: return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  // Sort tasks by completion status and due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First by completion status
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    
    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Finally by title
    return a.title.localeCompare(b.title);
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Brak zadań</h3>
        <p className="text-gray-500">
          {filter === 'all' 
            ? 'Dodaj swoje pierwsze zadanie do tej listy.'
            : `Brak zadań w kategorii "${filter}".`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0">
      {/* Add Task Button */}
      <div className="mb-2 w-fit">
        <button
          onClick={onAddTaskClick}
          className="w-full flex items-center justify-center gap-2  border-l-4 border-green-700 bg-green-600 text-white px-2 py-1 rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer"
          disabled={loading}
        >
          <Plus size={18} />
          <span className="text-sm">Dodaj nowe zadanie</span>
        </button>
      </div>
      
      <ul className="space-y-3 overflow-auto py-2">
        {sortedTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
