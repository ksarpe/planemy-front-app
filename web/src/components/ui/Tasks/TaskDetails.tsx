import { Button } from "@/components/ui/shadcn/button";
import { Calendar as CalendarRAC } from "@/components/ui/shadcn/calendar-rac";
import { DateInput } from "@/components/ui/shadcn/datefield-rac";
import { Input } from "@/components/ui/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { parseDate } from "@internationalized/date";
import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useDeleteLabelConnection } from "@shared/hooks/labels/useLabels";
import { useDeleteTask, useUpdateTask } from "@shared/hooks/tasks/useTasks";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Tag, Trash, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button as AriaButton, Popover as AriaPopover, DatePicker, Dialog, Group } from "react-aria-components";
import { useTranslation } from "react-i18next";
import { BasicDropdown, BasicDropdownItem, DeleteConfirmationModal } from "../Common";
import { Label } from "../shadcn/label";

export default function TaskDetails() {
  const { t } = useTranslation();
  const { clickedTask, setClickedTask, currentTaskListId } = useTaskViewContext();

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: removeTask } = useDeleteTask();
  const { mutate: removeLabelConnection } = useDeleteLabelConnection();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [title, setTitle] = useState(clickedTask?.title || "");
  const [task_description, setDescription] = useState(clickedTask?.task_description || "");
  const [dueDate, setDueDate] = useState<Date | null>(
    clickedTask?.dueDate && clickedTask.dueDate !== "" ? new Date(clickedTask.dueDate) : new Date(),
  );
  const [dueTime, setDueTime] = useState(() => {
    if (clickedTask?.dueDate && clickedTask.dueDate !== "") {
      const date = new Date(clickedTask.dueDate);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
    return "12:00";
  });

  // Sync form state when clickedTask changes (when user clicks on a different task)
  useEffect(() => {
    if (clickedTask) {
      setTitle(clickedTask.title || "");
      setDescription(clickedTask.task_description || "");

      if (clickedTask.dueDate && clickedTask.dueDate !== "") {
        const date = new Date(clickedTask.dueDate);
        setDueDate(date);
        setDueTime(`${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`);
      } else {
        setDueDate(null);
        setDueTime("12:00");
      }
    }
  }, [clickedTask]); // Only re-run when the task ID changes (different task clicked)

  if (!clickedTask || !currentTaskListId) return null;

  // Generate time options (same as event-panel)
  const timeOptions = [];
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      const value = `${formattedHour}:${formattedMinute}`;
      const displayHour = hour % 12 || 12;
      const period = hour < 12 ? "AM" : "PM";
      const label = `${displayHour}:${formattedMinute} ${period}`;
      timeOptions.push({ value, label });
    }
  }

  const handleSave = () => {
    const updates: Partial<{ title: string; task_description: string; dueDate: string }> = {};

    if (title.trim() !== clickedTask.title) {
      updates.title = title.trim();
    }

    if (task_description !== (clickedTask.task_description || "")) {
      updates.task_description = task_description;
    }

    if (dueDate) {
      const [hours, minutes] = dueTime.split(":").map(Number);
      const combinedDate = new Date(dueDate);
      combinedDate.setHours(hours, minutes, 0, 0);
      updates.dueDate = combinedDate.toISOString();
    } else if (clickedTask.dueDate) {
      updates.dueDate = "";
    }

    if (Object.keys(updates).length > 0) {
      updateTask({ id: clickedTask.id, data: updates, listId: currentTaskListId  });
    }

    setClickedTask(null);
  };

  const handleToggleComplete = () => {
    updateTask({ id: clickedTask.id, data: { isCompleted: !clickedTask.isCompleted }, listId: currentTaskListId  });
    setClickedTask(null);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    setClickedTask(null);
    removeTask(clickedTask.id);
  };

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="p-6 border-b border-bg-alt">
        <div className="flex items-center justify-between">
          {/* Delete Button */}
          <button
            onClick={() => setClickedTask(null)}
            className="text-text-muted hover:text-text hover:bg-bg-muted-light cursor-pointer rounded-lg p-2 transition-colors"
            aria-label="Close panel">
            <X size={24} />
          </button>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="delete"
            size="icon"
            className="flex-shrink-0"
            aria-label={t("tasks.details.actions.delete")}>
            <Trash2 size={18} />
          </Button>
          {/* Close Button */}
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Labels */}
          {clickedTask.labels && clickedTask.labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {clickedTask.labels.map((label) => (
                <div onClick={(e) => e.stopPropagation()} key={label.id}>
                  <BasicDropdown
                    trigger={
                      <div
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
          )}

          {/* Title */}
          <div className="group relative">
            <label
              htmlFor="title"
              className="cursor-text absolute top-1/2 -translate-y-1/2 px-1 text-sm text-text transition-all group-focus-within:top-0 group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-text has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-text">
              <span className="inline-flex bg-bg px-2">{t("tasks.details.titleLabel")}</span>
            </label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="" autoFocus />
          </div>

          {/* Description */}
          <div className="group relative">
            <label
              htmlFor="task_description"
              className="origin-start absolute top-0 block translate-y-2 cursor-text px-1 text-sm text-text-muted/70 transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-text has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-text">
              <span className="inline-flex bg-bg px-2">{t("tasks.details.descriptionLabel")}</span>
            </label>
            <Textarea
              id="task_description"
              value={task_description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder=" "
            />
          </div>

          {/* Due Date & Time */}
          <div className="space-y-3">
            <div>
              <DatePicker
                value={dueDate ? parseDate(format(dueDate, "yyyy-MM-dd")) : null}
                onChange={(date) => {
                  if (date) {
                    const jsDate = new Date(date.year, date.month - 1, date.day);
                    setDueDate(jsDate);
                  }
                }}
                className="group flex flex-col gap-1">
                <Group className="flex w-full items-center rounded-lg border border-text-muted-more bg-bg hover:border-white px-3 py-2 text-xs transition-colors focus-within:border-ring">
                  <DateInput className="flex flex-1 text-text" unstyled />
                  <AriaButton className="ml-2 outline-none text-text-muted hover:text-white cursor-pointer">
                    <Calendar size={16} />
                  </AriaButton>
                </Group>
                <AriaPopover className="rounded-lg border border-text-muted-more bg-bg p-2 shadow-lg">
                  <Dialog className="outline-none">
                    <CalendarRAC />
                  </Dialog>
                </AriaPopover>
              </DatePicker>
              {!dueDate && (
                <Label className="text-text-muted-more text-xs">Task doesn't have due date by default</Label>
              )}
            </div>

            {/* Time Select */}
            {dueDate && (
              <div>
                <Select value={dueTime} onValueChange={setDueTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Remove Due Date Button */}
            {dueDate && (
              <Button variant="default" onClick={() => setDueDate(null)} className="w-full">
                {t("tasks.details.actions.removeDueDate")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="p-4 border-t border-bg-alt flex items-center justify-end gap-2">
        {/* Complete and Save buttons */}
        <Button
          onClick={handleToggleComplete}
          variant={clickedTask.isCompleted ? "default" : "success"}
          className="flex items-center justify-center gap-2">
          <CheckCircle2 size={18} />
          {clickedTask.isCompleted ? t("tasks.details.actions.markIncomplete") : "Complete"}
        </Button>

        <Button onClick={handleSave} variant="primary">
          {t("tasks.details.actions.save")}
        </Button>
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
