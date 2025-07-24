import EditableText from "@/components/ui/Utils/EditableText";
import { useTaskContext } from "@/context/TaskContext";
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2,
  CalendarPlus,
  Edit3
} from "lucide-react";

export default function TaskDetails() {
  const { 
    updateTask, 
    markTaskAsDoneOrUndone, 
    convertToEvent, 
    clickedTask, 
    setClickedTask, 
    removeTask 
  } = useTaskContext();

  if (!clickedTask) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
        <p>Wybierz zadanie, aby zobaczyć szczegóły</p>
      </div>
    );
  }

  const isOverdue = () => {
    if (clickedTask.completed) return false;
    const today = new Date();
    const dueDate = new Date(clickedTask.dueDate);
    return dueDate < today;
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(clickedTask.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = () => {
    const daysUntil = getDaysUntilDue();
    const dateStr = new Date(clickedTask.dueDate).toLocaleDateString('pl-PL');
    
    if (clickedTask.completed) {
      return `${dateStr}`;
    } else if (daysUntil < 0) {
      return `${dateStr} (${Math.abs(daysUntil)} dni temu)`;
    } else if (daysUntil === 0) {
      return `${dateStr} (dziś)`;
    } else if (daysUntil === 1) {
      return `${dateStr} (jutro)`;
    } else {
      return `${dateStr} (za ${daysUntil} dni)`;
    }
  };

  const getPriorityColor = () => {
    switch (clickedTask.priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = () => {
    switch (clickedTask.priority) {
      case 'high': return 'Wysoki';
      case 'medium': return 'Średni';
      case 'low': return 'Niski';
      default: return 'Średni';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-text-dark flex items-center gap-2">
          <Edit3 size={20} />
          Szczegóły zadania
        </h3>
        <button
          onClick={() => setClickedTask(null)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-bg-hover-dark rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Task Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
          Tytuł
        </label>
        <EditableText
          value={clickedTask.title}
          onSave={(newValue: string) => {
            updateTask(newValue.trim(), clickedTask.description);
          }}
          className="w-full bg-white dark:bg-bg-hover-dark border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-text-dark"
        />
      </div>

      {/* Task Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
          Opis
        </label>
        <EditableText
          value={clickedTask.description}
          onSave={(newValue: string) => {
            updateTask(clickedTask.title, newValue.trim());
          }}
          className="w-full bg-white dark:bg-bg-hover-dark border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-text-dark min-h-[80px]"
          placeholder="Dodaj opis zadania..."
        />
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
          Priorytet
        </label>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor()}`}>
          {getPriorityLabel()}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
          Status
        </label>
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
          clickedTask.completed 
            ? "bg-green-100 text-green-700" 
            : isOverdue() 
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {clickedTask.completed ? (
            <>
              <CheckCircle2 size={16} />
              Ukończone
            </>
          ) : isOverdue() ? (
            <>
              <AlertTriangle size={16} />
              Przeterminowane
            </>
          ) : (
            <>
              <Clock size={16} />
              W toku
            </>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-text-dark">
          Termin wykonania
        </label>
        <div className={`flex items-center gap-2 p-3 rounded-lg border ${
          isOverdue() && !clickedTask.completed
            ? "border-red-200 bg-red-50"
            : "border-gray-200 bg-gray-50"
        }`}>
          <Calendar size={16} className={isOverdue() && !clickedTask.completed ? "text-red-500" : "text-gray-500"} />
          <span className={`text-sm ${
            isOverdue() && !clickedTask.completed ? "text-red-700" : "text-gray-700"
          }`}>
            {formatDueDate()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={() => markTaskAsDoneOrUndone(clickedTask.id)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            clickedTask.completed
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          <CheckCircle2 size={18} />
          {clickedTask.completed ? "Oznacz jako nieukończone" : "Oznacz jako ukończone"}
        </button>

        <button
          onClick={convertToEvent}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
        >
          <CalendarPlus size={18} />
          Konwertuj na wydarzenie
        </button>

        <button
          onClick={() => {
            if (window.confirm('Czy na pewno chcesz usunąć to zadanie?')) {
              removeTask();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
        >
          <Trash2 size={18} />
          Usuń zadanie
        </button>
      </div>
    </div>
  );
}
