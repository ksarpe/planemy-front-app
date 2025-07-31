import EditableText from "@/components/ui/Utils/EditableText";
import { useTaskContext } from "@/hooks/useTaskContext";
import { Calendar, CheckCircle2, Trash2, CalendarPlus, Edit3, PanelRightClose } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "../Common";

export default function TaskDetails() {
  const { updateTask, toggleTaskComplete, removeTask, convertToEvent, clickedTask, setClickedTask, currentTaskList } =
    useTaskContext();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // wether the delete confirmation modal is open
  const [tempDate, setTempDate] = useState("");
  const [tempTime, setTempTime] = useState("");

  if (!clickedTask || !currentTaskList) return;

  const isOverdue = () => {
    if (clickedTask.isCompleted || !clickedTask.dueDate || clickedTask.dueDate === "") return false;
    const today = new Date();
    const dueDate = new Date(clickedTask.dueDate);
    return dueDate < today;
  };

  const getDaysUntilDue = () => {
    if (!clickedTask.dueDate || clickedTask.dueDate === "") return null;
    const today = new Date();
    const dueDate = new Date(clickedTask.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = () => {
    if (!clickedTask.dueDate || clickedTask.dueDate === "") return "Brak terminu";

    const daysUntil = getDaysUntilDue()!;
    const dateStr = new Date(clickedTask.dueDate).toLocaleDateString("pl-PL");

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

  const handleUpdateDueDate = async (newDueDate: string) => {
    await updateTask(currentTaskList.id, clickedTask.id, { dueDate: newDueDate });
    // Aktualizuj lokalny stan zadania
    setClickedTask({ ...clickedTask, dueDate: newDueDate });
    setIsEditingDate(false);
  };

  const handleRemoveDueDate = async () => {
    await updateTask(currentTaskList.id, clickedTask.id, { dueDate: "" });
    // Aktualizuj lokalny stan zadania
    setClickedTask({ ...clickedTask, dueDate: "" });
    setIsEditingDate(false);
  };

  // Inicjalizacja temp wartości przy rozpoczęciu edycji
  const startEditingDate = () => {
    if (clickedTask.dueDate && clickedTask.dueDate !== "") {
      const date = new Date(clickedTask.dueDate);
      setTempDate(date.toISOString().split("T")[0]);
      setTempTime(date.toTimeString().split(" ")[0].slice(0, 5));
    } else {
      setTempDate("");
      setTempTime("12:00");
    }
    setIsEditingDate(true);
  };

  // Aktualizacja daty na podstawie temp wartości
  const updateDateFromTemp = () => {
    if (tempDate && tempTime) {
      const newDateTime = `${tempDate}T${tempTime}:00`;
      handleUpdateDueDate(newDateTime);
    }
  };

  const handleToggleComplete = async () => {
    await toggleTaskComplete(currentTaskList.id, clickedTask.id);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setClickedTask(null);
    await removeTask(currentTaskList.id, clickedTask.id);
  };

  return (
    <div className="w-1/4 bg-bg-alt dark:bg-bg-dark rounded-lg p-6 shadow-md transition-all duration-300">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center pb-4">
          <button onClick={() => setClickedTask(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <PanelRightClose size={20} />
          </button>
        </div>

        {/* Task Content */}
        <div className="flex-1 space-y-6">
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

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar
                size={16}
                className={
                  isOverdue() && !clickedTask.isCompleted ? "inline mr-1 text-red-500" : "inline mr-1 text-gray-500"
                }
              />
              Termin wykonania
            </label>

            {!isEditingDate ? (
              <button
                onClick={startEditingDate}
                className="w-full flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                <p className={`text-sm ${isOverdue() && !clickedTask.isCompleted ? "text-red-700" : "text-gray-700"}`}>
                  {formatDueDate()}
                </p>
                <Edit3 size={16} className="text-blue-600" />
              </button>
            ) : (
              <div className="space-y-3 bg-white border border-gray-200 rounded-lg p-4">
                {/* Data i godzina w jednym wierszu */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Data</label>
                    <input
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      onBlur={updateDateFromTemp}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateDateFromTemp();
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600">Godzina</label>
                    <input
                      type="time"
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                      onBlur={updateDateFromTemp}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateDateFromTemp();
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Przyciski w drugim wierszu */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsEditingDate(false)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Anuluj
                  </button>
                  <button
                    onClick={handleRemoveDueDate}
                    className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    Usuń termin
                  </button>
                </div>
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
            }`}>
            <CheckCircle2 size={18} />
            {clickedTask.isCompleted ? "Oznacz jako nieukończone" : "Oznacz jako ukończone"}
          </button>

          {/* Convert to Event */}
          <button
            onClick={convertToEvent}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors">
            <CalendarPlus size={18} />
            Konwertuj na event
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors">
            <Trash2 size={18} />
            Usuń zadanie
          </button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Usuń zadanie"
        message="Czy na pewno chcesz usunąć zadanie"
        itemName={clickedTask.title}
        confirmButtonText="Usuń zadanie"
      />
    </div>
  );
}
