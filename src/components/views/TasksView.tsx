import { useState } from "react";
import { useTaskContext } from "@/context/TaskContext";
import { AddTaskModal } from "@/components/ui/Tasks/AddTaskModal";
import TaskDetails from "@/components/ui/Tasks/TaskDetails";
import TaskItem from "@/components/ui/Tasks/TaskItem";
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo,
  Calendar,
  TrendingUp 
} from "lucide-react";

export default function TasksView() {
  const { tasks, clickedTask, addTask } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  // Calculate statistics
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = tasks.filter(task => {
    if (task.completed) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });
  const dueSoonTasks = tasks.filter(task => {
    if (task.completed) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  });

  // Filter tasks based on current filter
  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending': return pendingTasks;
      case 'completed': return completedTasks;
      case 'overdue': return overdueTasks;
      default: return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  // Sort tasks by priority and due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Finally by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getFilterButtonClass = (filterType: typeof filter) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      filter === filterType
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Main panel */}
      <div className={`${clickedTask ? 'w-2/3' : 'w-full'} rounded-3xl shadow-md overflow-auto flex flex-col gap-6 bg-bg-alt dark:bg-bg-dark p-6 transition-all duration-300`}>
        
        {/* Header with Stats */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold mb-4">Zadania</h1>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <ListTodo size={18} />
                  <span className="text-sm font-medium">Wszystkie</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
                  {tasks.length}
                </div>
              </div>

              <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-yellow-600 mb-1">
                  <Clock size={18} />
                  <span className="text-sm font-medium">W toku</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
                  {pendingTasks.length}
                </div>
              </div>

              <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">Ukończone</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
                  {completedTasks.length}
                </div>
              </div>

              <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <AlertTriangle size={18} />
                  <span className="text-sm font-medium">Przeterminowane</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 dark:text-text-dark">
                  {overdueTasks.length}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Dodaj zadanie
          </button>
        </div>

        {/* Alerts for overdue and due soon tasks */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              Masz {overdueTasks.length} przeterminowane zadania
            </h3>
            <div className="space-y-1">
              {overdueTasks.slice(0, 3).map(task => (
                <div key={task.id} className="text-red-700 text-sm">
                  {task.title} - termin: {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                </div>
              ))}
              {overdueTasks.length > 3 && (
                <div className="text-red-600 text-sm">
                  ...i {overdueTasks.length - 3} więcej
                </div>
              )}
            </div>
          </div>
        )}

        {dueSoonTasks.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-yellow-800 font-medium mb-2 flex items-center gap-2">
              <Calendar size={18} />
              Zadania do wykonania w najbliższych dniach
            </h3>
            <div className="space-y-1">
              {dueSoonTasks.map(task => (
                <div key={task.id} className="text-yellow-700 text-sm flex justify-between">
                  <span>{task.title}</span>
                  <span>{new Date(task.dueDate).toLocaleDateString('pl-PL')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={getFilterButtonClass('all')}
          >
            Wszystkie ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={getFilterButtonClass('pending')}
          >
            W toku ({pendingTasks.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={getFilterButtonClass('completed')}
          >
            Ukończone ({completedTasks.length})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={getFilterButtonClass('overdue')}
          >
            Przeterminowane ({overdueTasks.length})
          </button>
        </div>

        {/* Tasks List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {filter === 'all' ? 'Wszystkie zadania' :
               filter === 'pending' ? 'Zadania w toku' :
               filter === 'completed' ? 'Ukończone zadania' :
               'Przeterminowane zadania'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredTasks.length} zadań
            </span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {filter === 'all' ? 'Brak zadań' :
                 filter === 'pending' ? 'Brak zadań w toku' :
                 filter === 'completed' ? 'Brak ukończonych zadań' :
                 'Brak przeterminowanych zadań'}
              </h3>
              <p className="text-gray-400 mb-4">
                {filter === 'all' ? 'Dodaj swoje pierwsze zadanie' : 'Wybierz inny filtr lub dodaj nowe zadanie'}
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Dodaj zadanie
                </button>
              )}
            </div>
          ) : (
            <ul className="space-y-3">
              {sortedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          )}
        </div>

        {/* Progress indicator */}
        {tasks.length > 0 && (
          <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-text-dark">
                Postęp zadań
              </span>
              <span className="text-sm text-gray-500">
                {completedTasks.length} z {tasks.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{Math.round(tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0)}% ukończone</span>
              <span className="flex items-center gap-1">
                <TrendingUp size={12} />
                Kontynuuj!
              </span>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={addTask}
        />
      </div>

      {/* Right Panel - Task Details */}
      {clickedTask && (
        <div className="w-1/3 bg-bg-alt dark:bg-bg-dark rounded-3xl p-6 shadow-md transition-all duration-300">
          <TaskDetails />
        </div>
      )}
    </div>
  );
}
