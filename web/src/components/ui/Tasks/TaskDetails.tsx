import { Calendar as CalendarRAC } from "@/components/ui/Calendar/calendar-rac";
import { Button } from "@/components/ui/Utils/button";
import { DateInput } from "@/components/ui/Utils/datefield-rac";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Utils/select";
import { parseDate } from "@internationalized/date";
import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useDeleteLabelConnection } from "@shared/hooks/labels/useLabels";
import { useDeleteTask, useUpdateTask } from "@shared/hooks/tasks/useTasks";
import { useToast } from "@shared/hooks/toasts/useToast";
import { useT } from "@shared/hooks/utils/useT";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Tag, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button as AriaButton, Popover as AriaPopover, DatePicker, Dialog, Group } from "react-aria-components";
import { BasicDropdown, BasicDropdownItem, DeleteConfirmationModal } from "../Common";
import { Drawer } from "../Common/Drawer";
import { Input } from "../Utils/input";
import { Label } from "../Utils/label";
import { Textarea } from "../Utils/textarea";

export default function TaskDetails() {
  const { t } = useT();
  const { clickedTask, setClickedTask, currentTaskListId } = useTaskViewContext();
  const { showSuccess } = useToast();

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: removeTask } = useDeleteTask();
  const { mutate: removeLabelConnection } = useDeleteLabelConnection();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [displayTask, setDisplayTask] = useState(clickedTask);

  // Sync drawer open state with clickedTask
  useEffect(() => {
    setIsDrawerOpen(!!clickedTask);
    if (clickedTask) {
      setDisplayTask(clickedTask);
    }
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
  // Sync form state when displayTask changes
  useEffect(() => {
    if (displayTask) {
      setTitle(displayTask.title || "");
      setDescription(displayTask.task_description || "");

      if (displayTask.dueDate && displayTask.dueDate !== "") {
        const date = new Date(displayTask.dueDate);
        setDueDate(date);
        setDueTime(`${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`);
      } else {
        setDueDate(null);
        setDueTime("12:00");
      }
    }
  }, [displayTask]);

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
    if (!displayTask || !currentTaskListId) return;

    const updates: Partial<{ title: string; task_description: string; dueDate: string }> = {};

    if (title.trim() !== displayTask.title) {
      updates.title = title.trim();
    }

    if (task_description !== (displayTask.task_description || "")) {
      updates.task_description = task_description;
    }

    if (dueDate) {
      const [hours, minutes] = dueTime.split(":").map(Number);
      const combinedDate = new Date(dueDate);
      combinedDate.setHours(hours, minutes, 0, 0);
      updates.dueDate = combinedDate.toISOString();
    } else if (displayTask.dueDate) {
      updates.dueDate = "";
    }

    if (Object.keys(updates).length > 0) {
      updateTask({ id: displayTask.id, data: updates, listId: currentTaskListId });
      showSuccess("Task updated successfully");
    }

    setClickedTask(null);
  };

  const handleToggleComplete = () => {
    if (!displayTask || !currentTaskListId) return;
    updateTask({ id: displayTask.id, data: { isCompleted: !displayTask.isCompleted }, listId: currentTaskListId });
    setClickedTask(null);
  };

  const handleDelete = () => {
    if (!displayTask) return;
    setShowDeleteConfirm(false);
    setClickedTask(null);
    removeTask(displayTask.id);
    showSuccess("Task deleted successfully");
  };

  const handleClose = () => {
    setClickedTask(null);
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
          displayTask && (
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
          displayTask && (
            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={handleToggleComplete}
                variant={displayTask.isCompleted ? "default" : "success"}
                className="flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                {displayTask.isCompleted ? t("tasks.details.actions.markIncomplete") : "Complete"}
              </Button>
              <Button onClick={handleSave} variant="primary">
                {t("tasks.details.actions.save")}
              </Button>
            </div>
          )
        }>
        {displayTask && currentTaskListId && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
            {/* Labels */}
            {displayTask.labels && displayTask.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayTask.labels.map((label) => (
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
                        onClick={() => removeLabelConnection(displayTask.id)}>
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
                  <Group className="flex w-full items-center rounded-2xl border border-text-muted bg-bg-primary hover:border-white px-3 py-2 text-xs transition-colors focus-within:border-ring">
                    <DateInput className="flex flex-1 text-text" unstyled />
                    <AriaButton className="ml-2 outline-none text-text-muted hover:text-white cursor-pointer">
                      <Calendar size={16} />
                    </AriaButton>
                  </Group>
                  <AriaPopover className="rounded-2xl border border-text-muted bg-bg-primary p-2 shadow-lg">
                    <Dialog className="outline-none">
                      <CalendarRAC />
                    </Dialog>
                  </AriaPopover>
                </DatePicker>
                {!dueDate && <Label className="text-text-muted text-xs">Task doesn't have due date by default</Label>}
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
      {displayTask && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title={t("tasks.details.deleteConfirmation.title")}
          message={t("tasks.details.deleteConfirmation.message")}
          itemName={displayTask.title}
          confirmButtonText={t("tasks.details.deleteConfirmation.confirmButton")}
        />
      )}
    </>
  );
}
