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
    <div className="flex flex-col gap-4">
      {/* Top row: Task List Dropdown, Actions and Pomodoro */}
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 md:flex-none">
            <TaskListDropdown />
          </div>
          <div className="flex flex-col gap-1 min-w-[120px]">
            <TaskListActions tasks={tasks} />
            {/* New List Button */}
            <ActionButton
              onClick={onNewListClick}
              icon={FolderPlus}
              iconSize={16}
              text="Nowa lista"
              color="green"
              size="sm"
              className="w-full text-xs"
            />
          </div>
        </div>

        {/* AI Textbox - hidden on mobile, shown on desktop */}
        <div className="hidden lg:block flex-1 mx-4">
          <AITextbox placeholder={placeholders} />
        </div>

        {/* Pomodoro Mode - always on top row */}
        <div className="flex-shrink-0">
          <ActionButton
            onClick={onNewListClick}
            icon={ArrowBigRightDash}
            iconSize={20}
            text="Pomodoro"
            color="primary"
            size="lg"
            className="whitespace-nowrap"
          />
        </div>
      </div>

      {/* AI textbox - separate row on mobile only */}
      <div className="md:hidden">
        <AITextbox placeholder={placeholders} />
      </div>
    </div>
  );
}
