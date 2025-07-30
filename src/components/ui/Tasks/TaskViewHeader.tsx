import { ArrowBigRightDash, FolderPlus } from "lucide-react";
import TaskListDropdown from "./TaskListDropdown";
import TaskListActions from "./TaskListActions";
import { useTaskContext } from "@/hooks/useTaskContext";
import { ActionButton, AITextbox } from "../Common";

interface TaskViewHeaderProps {
  onNewListClick: () => void;
  onShareListClick: (listId: string) => void;
}

export default function TaskViewHeader({ onNewListClick }: TaskViewHeaderProps) {
  const { currentTaskList } = useTaskContext();

  if (!currentTaskList) return null;

  return (
    <div className="flex justify-between items-center gap-4">
      {/* Task List Dropdown and Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <TaskListDropdown />
        <div className="h-[58px] w-[140px] flex flex-col gap-1">
          <TaskListActions />
          {/* New List Button */}
          <ActionButton
            onClick={onNewListClick}
            icon={FolderPlus}
            iconSize={16}
            text="Utwórz listę"
            color="green"
            size="xs"
            className="w-full"
          />
        </div>
      </div>

      {/* AI Textbox - Center */}
      <AITextbox placeholder="Zapytaj mnie o coś..." />

      {/* Pomodoro Mode - Right */}
      <div className="flex-shrink-0">
        <ActionButton
          onClick={onNewListClick}
          icon={ArrowBigRightDash}
          iconSize={24}
          text="Tryb Pomodoro"
          color="orange"
          size="lg"
        />
      </div>
    </div>
  );
}
