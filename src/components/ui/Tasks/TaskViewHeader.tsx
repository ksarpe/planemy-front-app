import { ArrowBigRightDash, FolderPlus } from "lucide-react";
import TaskListDropdown from "./TaskListDropdown";
import TaskListActions from "./TaskListActions";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { ActionButton, AITextbox } from "../Common";
import type { TaskViewHeaderProps } from "@/data/Tasks/interfaces";

const placeholders = ["@Co należałoby zrobić najpilniej?", "@Pokaż mi zadania na ten tydzień"];

export default function TaskViewHeader({ onNewListClick, tasks }: TaskViewHeaderProps) {
  const { currentTaskList } = useTaskContext();

  if (!currentTaskList) return null;

  return (
    <div className="flex justify-between items-center gap-3">
      {/* Task List Dropdown and Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <TaskListDropdown />
        <div className="h-[64px] w-[140px] flex flex-col gap-1">
          <TaskListActions tasks={tasks} />
          {/* New List Button */}
          <ActionButton
            onClick={onNewListClick}
            icon={FolderPlus}
            iconSize={16}
            text="Nowa lista"
            color="green"
            size="md"
            className="w-full"
          />
        </div>
      </div>

      {/* AI Textbox - Center */}
      <AITextbox placeholder={placeholders} />

      {/* Pomodoro Mode - Right */}
      <div className="flex-shrink-0">
        <ActionButton
          onClick={onNewListClick}
          icon={ArrowBigRightDash}
          iconSize={24}
          text="Tryb Pomodoro"
          color="primary"
          size="lg"
        />
      </div>
    </div>
  );
}
