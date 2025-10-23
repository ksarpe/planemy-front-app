import EditableText from "@/components/ui/Utils/EditableText";
import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useDeleteTask, useUpdateTask } from "@shared/hooks/tasks/useTasks";
import { useTranslation } from "react-i18next";
import { Calendar, CheckCircle2, Trash2, PanelRightClose, Trash, Tag } from "lucide-react";
import { useState } from "react";
import { BasicDropdown, BasicDropdownItem, DeleteConfirmationModal } from "../Common";
import { useDeleteLabelConnection } from "@shared/hooks/labels/useLabels";

export default function TaskDetails() {
  const { t } = useTranslation();
  const { clickedTask, setClickedTask, currentTaskListId } = useTaskViewContext();

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: removeTask } = useDeleteTask();
  const { mutate: removeLabelConnection } = useDeleteLabelConnection();
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // wether the delete confirmation modal is open
  const [tempDate, setTempDate] = useState("");
  const [tempTime, setTempTime] = useState("");

  if (!clickedTask || !currentTaskListId) return;

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
    if (!clickedTask.dueDate || clickedTask.dueDate === "") return t("tasks.details.selectDueDate");

    const daysUntil = getDaysUntilDue()!;
    const dateStr = new Date(clickedTask.dueDate).toLocaleDateString("pl-PL");

    if (clickedTask.isCompleted) {
      return `${dateStr}`;
    } else if (daysUntil < 0) {
      return `${dateStr} (${t("tasks.dates.daysAgo", { count: Math.abs(daysUntil) })})`;
    } else if (daysUntil === 0) {
      return `${dateStr} (${t("tasks.dates.today").toLowerCase()})`;
    } else if (daysUntil === 1) {
      return `${dateStr} (${t("tasks.dates.tomorrow").toLowerCase()})`;
    } else {
      return `${dateStr} (${t("tasks.dates.inDays", { count: daysUntil }).toLowerCase()})`;
    }
  };

  const handleUpdateTitle = async (newTitle: string) => {
    updateTask({ id: clickedTask.id, data: { title: newTitle } });
  };

  const handleUpdateDescription = async (newDescription: string) => {
    updateTask({ id: clickedTask.id, data: { description: newDescription } });
  };

  const handleUpdateDueDate = async (newDueDate: string) => {
    updateTask({ id: clickedTask.id, data: { dueDate: newDueDate } });
    // Aktualizuj lokalny stan zadania
    setClickedTask({ ...clickedTask, dueDate: newDueDate });
    setIsEditingDate(false);
  };

  const handleRemoveDueDate = async () => {
    updateTask({ id: clickedTask.id, data: { dueDate: "" } });
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
    updateTask({ id: clickedTask.id, data: { isCompleted: !clickedTask.isCompleted } });
    setClickedTask(null);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setClickedTask(null);
    removeTask(clickedTask.id);
  };

  return (
    <div className="h-full bg-gradient-to-r from-bg-alt to-bg-bg p-4 overflow-auto">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center pb-4 justify-between">
          <button onClick={() => setClickedTask(null)} className="text-text-muted hover:text-text transition-colors">
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
                  <BasicDropdownItem icon={Trash} variant="red" onClick={() => removeLabelConnection(clickedTask.id)}>
                    {t("tasks.item.labels.remove")}
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
            <EditableText
              value={clickedTask.title}
              onSave={handleUpdateTitle}
              placeholder={t("tasks.details.titlePlaceholder")}
            />
          </div>

          {/* Description */}
          <div>
            <EditableText
              value={clickedTask.description || ""}
              onSave={handleUpdateDescription}
              placeholder={t("tasks.details.addDescription")}
            />
          </div>

          {/* Due Date */}
          <div>
            {!isEditingDate ? (
              <button
                onClick={startEditingDate}
                className="w-full flex items-center justify-between bg-bg-alt rounded-lg p-3 hover:bg-bg-hover transition-colors cursor-pointer">
                <p className={`text-sm ${isOverdue() && !clickedTask.isCompleted ? "text-negative " : "text-text "}`}>
                  {formatDueDate()}
                </p>
                <Calendar size={16} className="text-primary " />
              </button>
            ) : (
              <div className="space-y-3 bg-bg border border-text-muted-more rounded-lg p-4">
                {/* Data i godzina w jednym wierszu */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-text-muted ">{t("tasks.details.dateLabel")}</label>
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
                      className="w-full px-3 py-2 border border-text-muted-more rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-text-muted ">{t("tasks.details.timeLabel")}</label>
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
                      className="w-full px-3 py-2 border border-text-muted-more rounded-lg"
                    />
                  </div>
                </div>

                {/* Przyciski w drugim wierszu */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsEditingDate(false)}
                    className="flex-1 px-3 py-2 text-sm bg-bg-alt text-text rounded-lg hover:bg-bg-hover transition-colors">
                    {t("tasks.details.actions.cancel")}
                  </button>
                  <button
                    onClick={updateDateFromTemp}
                    className="flex-1 px-3 py-2 text-sm bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors">
                    {t("tasks.details.actions.save")}
                  </button>
                  <button
                    onClick={handleRemoveDueDate}
                    className="flex-1 px-3 py-2 text-sm bg-negative/20 text-negative rounded-lg hover:bg-negative/30 transition-colors">
                    {t("tasks.details.actions.removeDueDate")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6 border-t border-bg-hover ">
          {/* Toggle Complete */}
          <button
            onClick={handleToggleComplete}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium shadow-md
      ${
        clickedTask.isCompleted
          ? "bg-bg-alt text-text hover:bg-bg-hover " // Stan: Zrobione (akcja cofająca)
          : "bg-success text-white hover:bg-success/90" // Stan: Do zrobienia (akcja główna)
      }`}>
            <CheckCircle2 size={18} />
            {clickedTask.isCompleted
              ? t("tasks.details.actions.markIncomplete")
              : t("tasks.details.actions.markCompleted")}
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium shadow-md
               bg-negative/20 text-negative hover:bg-negative/30
                 ">
            <Trash2 size={16} />
            {t("tasks.details.actions.delete")}
          </button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t("tasks.details.deleteConfirmation.title")}
        message={t("tasks.details.deleteConfirmation.message")}
        itemName={clickedTask.title}
        confirmButtonText={t("tasks.details.deleteConfirmation.confirmButton")}
      />
    </div>
  );
}
