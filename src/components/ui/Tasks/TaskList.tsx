import { CheckCircle2 } from "lucide-react";
import { TaskInterface } from "@/data/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: TaskInterface[];
  filter: 'all' | 'pending' | 'completed' | 'overdue';
}

export default function TaskList({ tasks, filter }: TaskListProps) {
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
      <ul className="space-y-3 overflow-auto">
        {sortedTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
