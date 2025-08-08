import EditableText from "@/components/ui/Utils/EditableText";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { useCompleteTask, useDeleteTask, useUpdateTask } from "@/hooks/tasks/useTasks";
import { Calendar, CheckCircle2, Trash2, PanelRightClose, Trash, Tag } from "lucide-react";
import { useState } from "react";
import { BasicDropdown, BasicDropdownItem, DeleteConfirmationModal } from "../Common";
import { useLabelContext } from "@/hooks/context/useLabelContext";

export default function TaskDetails() {
  const { clickedTask, setClickedTask, currentTaskList } = useTaskContext();
  const { removeLabelConnection } = useLabelContext();

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: toggleTaskComplete } = useCompleteTask();
  const { mutate: removeTask } = useDeleteTask();
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
    if (!clickedTask.dueDate || clickedTask.dueDate === "") return "Wybierz termin";

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
    updateTask({ taskId: clickedTask.id, updates: { title: newTitle } });
  };

  const handleUpdateDescription = async (newDescription: string) => {
    updateTask({ taskId: clickedTask.id, updates: { description: newDescription } });
  };

  const handleUpdateDueDate = async (newDueDate: string) => {
    updateTask({ taskId: clickedTask.id, updates: { dueDate: newDueDate } });
    // Aktualizuj lokalny stan zadania
    setClickedTask({ ...clickedTask, dueDate: newDueDate });
    setIsEditingDate(false);
  };

  const handleRemoveDueDate = async () => {
    updateTask({ taskId: clickedTask.id, updates: { dueDate: "" } });
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
    toggleTaskComplete(clickedTask.id);
    setClickedTask(null);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setClickedTask(null);
    removeTask(clickedTask.id);
  };

  return (
    <div className="w-1/5 bg-gradient-to-r from-bg-alt to-bg-bg   rounded-md p-4 shadow-[-8px_0_10px_rgba(0,0,0,0.1)]">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center pb-4 justify-between">
          <button
            onClick={() => setClickedTask(null)}
            className="text-gray-400  hover:text-gray-600  transition-colors">
            <PanelRightClose size={20} />
          </button>
          <div>
            {/* even though there is a map, we cannot add more labels  (frontend purposes) */}
            {clickedTask.labels?.map((label) => (
              <div onClick={(e) => e.stopPropagation()} key={label.id}>
                <BasicDropdown
                  trigger={
                    <div
                      key={label.id}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full cursor-pointer"
                      style={{ backgroundColor: label.color + "20", color: label.color }}>
                      <Tag size={12} />
                      {label.name}
                    </div>
                  }
                  usePortal={true}>
                  <BasicDropdownItem
                    icon={Trash}
                    variant="red"
                    onClick={() => removeLabelConnection(clickedTask.id, "task", label.id)}>
                    Usuń etykietę
                  </BasicDropdownItem>
                </BasicDropdown>
              </div>
            ))}
          </div>
        </div>

        {/* Task Content */}
        <div className="flex-1 space-y-6">
          {/* Title */}
          <div>
            <EditableText value={clickedTask.title} onSave={handleUpdateTitle} placeholder="Tytuł zadania..." />
          </div>

          {/* Description */}
          <div>
            <EditableText
              value={clickedTask.description || ""}
              onSave={handleUpdateDescription}
              placeholder="Dodaj opis zadania..."
            />
          </div>

          {/* Due Date */}
          <div>
            {!isEditingDate ? (
              <button
                onClick={startEditingDate}
                className="w-full flex items-center justify-between bg-gray-50  rounded-md p-3 hover:bg-gray-100  transition-colors cursor-pointer">
                <p
                  className={`text-sm ${isOverdue() && !clickedTask.isCompleted ? "text-red-700 " : "text-gray-700 "}`}>
                  {formatDueDate()}
                </p>
                <Calendar size={16} className="text-primary " />
              </button>
            ) : (
              <div className="space-y-3 bg-white  border border-gray-200  rounded-md p-4">
                {/* Data i godzina w jednym wierszu */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 ">Data</label>
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
                      className="w-full px-3 py-2 border border-gray-300    rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-600 ">Godzina</label>
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
                      className="w-full px-3 py-2 border border-gray-300    rounded-md"
                    />
                  </div>
                </div>

                {/* Przyciski w drugim wierszu */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsEditingDate(false)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100  text-gray-700  rounded-md hover:bg-gray-200  transition-colors">
                    Anuluj
                  </button>
                  <button
                    onClick={updateDateFromTemp}
                    className="flex-1 px-3 py-2 text-sm bg-green-100  text-green-700  rounded-md hover:bg-green-200  transition-colors">
                    Zapisz
                  </button>
                  <button
                    onClick={handleRemoveDueDate}
                    className="flex-1 px-3 py-2 text-sm bg-red-100  text-red-700  rounded-md hover:bg-red-200  transition-colors">
                    Usuń termin
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6 border-t border-gray-200 ">
          {/* Toggle Complete */}
          <button
            onClick={handleToggleComplete}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium shadow-md
      ${
        clickedTask.isCompleted
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200   " // Stan: Zrobione (akcja cofająca)
          : "bg-success text-white hover:bg-success-hover" // Stan: Do zrobienia (akcja główna)
      }`}>
            <CheckCircle2 size={18} />
            {clickedTask.isCompleted ? "Oznacz jako nieukończone" : "Oznacz jako ukończone"}
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium shadow-md
               bg-red-50 text-red-600 hover:bg-red-100
                 ">
            <Trash2 size={16} />
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
