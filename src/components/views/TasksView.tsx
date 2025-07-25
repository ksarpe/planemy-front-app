import { useState } from "react";
import { useTaskContext } from "@/hooks/useTaskContext";
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
  TrendingUp,
  List,
  FolderPlus
} from "lucide-react";

export default function TasksView() {
  const { 
    taskLists, 
    currentTaskList, 
    setCurrentTaskList, 
    clickedTask, 
    addTask,
    createTaskList,
    loading
  } = useTaskContext();
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  // Get tasks from current list or empty array
  const tasks = currentTaskList?.tasks || [];

  // Calculate statistics
  const completedTasks = tasks.filter(task => task.isCompleted);
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const overdueTasks = tasks.filter(task => {
    if (task.isCompleted) return false;
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  });
  
  const dueSoonTasks = tasks.filter(task => {
    if (task.isCompleted) return false;
    if (!task.dueDate) return false;
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

  const getFilterButtonClass = (filterType: typeof filter) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      filter === filterType
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    
    await createTaskList(newListName.trim());
    setNewListName("");
    setIsListModalOpen(false);
  };

  const handleAddTask = async (title: string, description?: string, dueDate?: string) => {
    if (!currentTaskList) return;
    await addTask(currentTaskList.id, title, description, dueDate);
  };

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Main panel */}
      <div className={`${clickedTask ? 'w-2/3' : 'w-full'} rounded-3xl shadow-md overflow-auto flex flex-col gap-6 bg-bg-alt dark:bg-bg-dark p-6 transition-all duration-300`}>
        
        {/* Header with Task Lists */}
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
                      setCurrentTaskList(list || null);
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Wybierz listę</option>
                    {taskLists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.name} ({list.tasks.length})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {/* Statistics Cards - only show if we have a current list */}
            {currentTaskList && (
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
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsListModalOpen(true)}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              <FolderPlus size={18} />
              Nowa lista
            </button>
            
            {currentTaskList && (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                <Plus size={18} />
                Dodaj zadanie
              </button>
            )}
          </div>
        </div>

        {/* No task lists state */}
        {taskLists.length === 0 && (
          <div className="text-center py-12">
            <ListTodo size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Brak list zadań</h3>
            <p className="text-gray-500 mb-4">Utwórz swoją pierwszą listę zadań, aby rozpocząć organizację.</p>
            <button
              onClick={() => setIsListModalOpen(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Utwórz pierwszą listę
            </button>
          </div>
        )}

        {/* No current list selected */}
        {taskLists.length > 0 && !currentTaskList && (
          <div className="text-center py-12">
            <List size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Wybierz listę zadań</h3>
            <p className="text-gray-500">Wybierz listę z menu powyżej, aby wyświetlić zadania.</p>
          </div>
        )}

        {/* Task list content */}
        {currentTaskList && (
          <>
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
                      {task.title} - termin: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pl-PL') : 'Brak terminu'}
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
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('pl-PL') : 'Brak terminu'}</span>
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
            <div className="flex-1 min-h-0">
              {filteredTasks.length === 0 ? (
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
              ) : (
                <ul className="space-y-3 overflow-auto">
                  {sortedTasks.map(task => (
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
          </>
        )}

        {/* Create Task List Modal */}
        {isListModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Utwórz nową listę zadań</h2>
              <form onSubmit={handleCreateList}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nazwa listy
                  </label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="np. Zadania domowe, Praca..."
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsListModalOpen(false);
                      setNewListName("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={!newListName.trim() || loading}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Utwórz
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {isTaskModalOpen && (
          <AddTaskModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onSubmit={handleAddTask}
          />
        )}
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
