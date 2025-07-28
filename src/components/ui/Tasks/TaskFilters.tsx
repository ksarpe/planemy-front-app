import { TaskInterface } from "@/data/types";

interface TaskFiltersProps {
  filter: 'pending' | 'completed' | 'overdue';
  onFilterChange: (filter: 'pending' | 'completed' | 'overdue') => void;
  tasks: TaskInterface[];
}

export default function TaskFilters({ filter, onFilterChange, tasks }: TaskFiltersProps) {
  // Calculate task counts for filters
  const completedTasks = tasks.filter(task => task.isCompleted);
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const overdueTasks = tasks.filter(task => {
    if (task.isCompleted) return false;
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });

  const getFilterButtonClass = (filterType: typeof filter) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      filter === filterType
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onFilterChange('pending')}
        className={getFilterButtonClass('pending')}
      >
        W toku ({pendingTasks.length})
      </button>
      <button
        onClick={() => onFilterChange('completed')}
        className={getFilterButtonClass('completed')}
      >
        Ukończone ({completedTasks.length})
      </button>
      <button
        onClick={() => onFilterChange('overdue')}
        className={getFilterButtonClass('overdue')}
      >
        Przeterminowane ({overdueTasks.length})
      </button>
    </div>
  );
}
