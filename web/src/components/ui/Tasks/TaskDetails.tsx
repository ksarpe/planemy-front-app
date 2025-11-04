import { Button } from "@/components/ui/shadcn/button";
import { Calendar as CalendarRAC } from "@/components/ui/shadcn/calendar-rac";
import { DateInput } from "@/components/ui/shadcn/datefield-rac";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/select";
import { parseDate } from "@internationalized/date";
import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useDeleteLabelConnection } from "@shared/hooks/labels/useLabels";
import { useDeleteTask, useUpdateTask } from "@shared/hooks/tasks/useTasks";
import { useToast } from "@shared/hooks/toasts/useToast";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Tag, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button as AriaButton, Popover as AriaPopover, DatePicker, Dialog, Group } from "react-aria-components";
import { useTranslation } from "react-i18next";
import { BasicDropdown, BasicDropdownItem, DeleteConfirmationModal } from "../Common";
import { Drawer } from "../Common/Drawer";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";
import { Textarea } from "../shadcn/textarea";

export default function TaskDetails() {
  const { t } = useTranslation();
  const { clickedTask, setClickedTask, currentTaskListId } = useTaskViewContext();
  const { showSuccess } = useToast();

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: removeTask } = useDeleteTask();
  const { mutate: removeLabelConnection } = useDeleteLabelConnection();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync drawer open state with clickedTask
  useEffect(() => {
    setIsDrawerOpen(!!clickedTask);
  }, [clickedTask]);

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
    if (!clickedTask || !currentTaskListId) return;

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
      updateTask({ id: clickedTask.id, data: updates, listId: currentTaskListId });
      showSuccess("Task updated successfully");
    }

    setClickedTask(null);
  };

  const handleToggleComplete = () => {
    if (!clickedTask || !currentTaskListId) return;
    updateTask({ id: clickedTask.id, data: { isCompleted: !clickedTask.isCompleted }, listId: currentTaskListId });
    setClickedTask(null);
  };

  const handleDelete = () => {
    if (!clickedTask) return;
    setShowDeleteConfirm(false);
    setClickedTask(null);
    removeTask(clickedTask.id);
  };

  const handleClose = () => {
    setIsDrawerOpen(false);
    // Wait for animation to finish before clearing clickedTask
    setTimeout(() => {
      setClickedTask(null);
    }, 300); // Match animation duration
  };

  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleClose}
        width="sm"
        position="right"
        title="Task Details"
        header={
          clickedTask && (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="delete"
              size="icon"
              className="flex-shrink-0"
              aria-label={t("tasks.details.actions.delete")}>
              <Trash2 size={18} />
            </Button>
          )
        }
        footer={
          clickedTask && (
            <div className="flex items-center justify-end gap-2">
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
          )
        }>
        {clickedTask && currentTaskListId && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
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
                          {label.label_name}
                        </div>
                      }
                      usePortal={true}>
                      <BasicDropdownItem
                        icon={Trash}
                        variant="red"
                        onClick={() => removeLabelConnection(clickedTask.id)}>
                        {t("tasks.item.labels.remove")}
                      </BasicDropdownItem>
                    </BasicDropdown>
                  </div>
                ))}
              </div>
            )}

            {/* Title */}
            <Input
              label="Title"
              placeholder="Make sandwich"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            {/* Description */}
            <Textarea
              label="Description"
              value={task_description}
              placeholder="buy ham and cheese"
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />

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
                  <Group className="flex w-full items-center rounded-2xl border border-text-muted-more bg-bg-alt hover:border-white px-3 py-2 text-xs transition-colors focus-within:border-ring">
                    <DateInput className="flex flex-1 text-text" unstyled />
                    <AriaButton className="ml-2 outline-none text-text-muted hover:text-white cursor-pointer">
                      <Calendar size={16} />
                    </AriaButton>
                  </Group>
                  <AriaPopover className="rounded-2xl border border-text-muted-more bg-bg-alt p-2 shadow-lg">
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
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      {clickedTask && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title={t("tasks.details.deleteConfirmation.title")}
          message={t("tasks.details.deleteConfirmation.message")}
          itemName={clickedTask.title}
          confirmButtonText={t("tasks.details.deleteConfirmation.confirmButton")}
        />
      )}
    </>
  );
}
