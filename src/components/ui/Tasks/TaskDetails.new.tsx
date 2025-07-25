import EditableText from "@/components/ui/Utils/EditableText";
import { useTaskContext } from "@/hooks/useTaskContext";
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2,
  CalendarPlus,
  Edit3,
  Tag
} from "lucide-react";

export default function TaskDetails() {
  const { 
    updateTask, 
    toggleTaskComplete,
    removeTask,
    convertToEvent, 
    clickedTask, 
    setClickedTask,
    currentTaskList
  } = useTaskContext();

  if (!clickedTask || !currentTaskList) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
        <p>Wybierz zadanie, aby zobaczyć szczegóły</p>
      </div>
    );
  }

  const isOverdue = () => {
    if (clickedTask.isCompleted || !clickedTask.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(clickedTask.dueDate);
    return dueDate < today;
  };

  const getDaysUntilDue = () => {
    if (!clickedTask.dueDate) return null;
    const today = new Date();
    const dueDate = new Date(clickedTask.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = () => {
    if (!clickedTask.dueDate) return "Brak terminu";
    
    const daysUntil = getDaysUntilDue()!;
    const dateStr = new Date(clickedTask.dueDate).toLocaleDateString('pl-PL');
    
    if (clickedTask.isCompleted) {
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

  const handleUpdateTitle = async (newTitle: string) => {
    await updateTask(currentTaskList.id, clickedTask.id, { title: newTitle });
  };

  const handleUpdateDescription = async (newDescription: string) => {
    await updateTask(currentTaskList.id, clickedTask.id, { description: newDescription });
  };

  const handleToggleComplete = async () => {
    await toggleTaskComplete(currentTaskList.id, clickedTask.id);
  };

  const handleRemove = async () => {
    await removeTask(currentTaskList.id, clickedTask.id);
    setClickedTask(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Szczegóły zadania</h2>
        <button
          onClick={() => setClickedTask(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Task Content */}
      <div className="flex-1 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {clickedTask.isCompleted ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <CheckCircle2 size={16} />
              Ukończone
            </div>
          ) : isOverdue() ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <AlertTriangle size={16} />
              Przeterminowane
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Clock size={16} />
              W toku
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Edit3 size={16} className="inline mr-1" />
            Tytuł
          </label>
          <EditableText
            value={clickedTask.title}
            onSave={handleUpdateTitle}
            className="text-lg font-medium"
            placeholder="Tytuł zadania..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Edit3 size={16} className="inline mr-1" />
            Opis
          </label>
          <EditableText
            value={clickedTask.description || ""}
            onSave={handleUpdateDescription}
            placeholder="Dodaj opis zadania..."
          />
        </div>

        {/* Labels */}
        {clickedTask.labels && clickedTask.labels.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag size={16} className="inline mr-1" />
              Etykiety
            </label>
            <div className="flex flex-wrap gap-2">
              {clickedTask.labels.map((label, index) => (
                <span
                  key={label.id || index}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                  style={{ backgroundColor: label.color + '20', color: label.color }}
                >
                  <Tag size={12} />
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className={isOverdue() && !clickedTask.isCompleted ? "inline mr-1 text-red-500" : "inline mr-1 text-gray-500"} />
            Termin wykonania
          </label>
          <p className={`text-sm ${
            isOverdue() && !clickedTask.isCompleted ? "text-red-700" : "text-gray-700"
          }`}>
            {formatDueDate()}
          </p>
        </div>

        {/* Task Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className={`font-medium ${
              clickedTask.isCompleted ? "text-green-600" : "text-blue-600"
            }`}>
              {clickedTask.isCompleted ? "Ukończone" : "W toku"}
            </span>
          </div>
          
          {clickedTask.dueDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Dni do wykonania:</span>
              <span className={`font-medium ${
                isOverdue() && !clickedTask.isCompleted ? "text-red-600" : "text-gray-800"
              }`}>
                {getDaysUntilDue() !== null ? getDaysUntilDue() : "Brak terminu"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-6 border-t">
        {/* Toggle Complete */}
        <button
          onClick={handleToggleComplete}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            clickedTask.isCompleted
              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          <CheckCircle2 size={18} />
          {clickedTask.isCompleted ? "Oznacz jako nieukończone" : "Oznacz jako ukończone"}
        </button>

        {/* Convert to Event */}
        <button
          onClick={convertToEvent}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors"
        >
          <CalendarPlus size={18} />
          Konwertuj na event
        </button>

        {/* Delete */}
        <button
          onClick={handleRemove}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors"
        >
          <Trash2 size={18} />
          Usuń zadanie
        </button>
      </div>
    </div>
  );
}
