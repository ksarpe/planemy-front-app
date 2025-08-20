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
    <div className="space-y-3">
      {/* Desktop layout (xl+): dropdown, actions, aitextbox, pomodoro in one row */}
      <div className="hidden xl:flex items-center gap-4">
        <div className="flex-shrink-0">
          <TaskListDropdown />
        </div>
        <div className="flex-shrink-0">
          <div className="flex flex-col gap-2">
            <TaskListActions tasks={tasks} />
            <ActionButton
              onClick={onNewListClick}
              icon={FolderPlus}
              iconSize={16}
              text="Nowa lista"
              color="green"
              size="sm"
              className="text-xs"
            />
          </div>
        </div>
        <div className="flex-1">
          <AITextbox placeholder={placeholders} />
        </div>
        <div className="flex-shrink-0">
          <ActionButton
            onClick={onNewListClick}
            icon={ArrowBigRightDash}
            iconSize={20}
            text="Pomodoro"
            color="primary"
            size="lg"
          />
        </div>
      </div>

      {/* Tablet layout (lg-xl): dropdown, actions, pomodoro in row, aitextbox below */}
      <div className="hidden lg:block xl:hidden">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-shrink-0">
            <TaskListDropdown />
          </div>
          <div className="flex-shrink-0">
            <div className="flex flex-col gap-2">
              <TaskListActions tasks={tasks} />
              <ActionButton
                onClick={onNewListClick}
                icon={FolderPlus}
                iconSize={16}
                text="Nowa lista"
                color="green"
                size="sm"
                className="text-xs"
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <ActionButton
              onClick={onNewListClick}
              icon={ArrowBigRightDash}
              iconSize={20}
              text="Pomodoro"
              color="primary"
              size="lg"
            />
          </div>
        </div>
        <div>
          <AITextbox placeholder={placeholders} />
        </div>
      </div>

      {/* Small tablet layout (md-lg): dropdown, actions in row, pomodoro and aitextbox below */}
      <div className="hidden md:block lg:hidden">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <TaskListDropdown />
          </div>
          <div className="flex-shrink-0">
            <div className="flex flex-col gap-2">
              <TaskListActions tasks={tasks} />
              <ActionButton
                onClick={onNewListClick}
                icon={FolderPlus}
                iconSize={16}
                text="Nowa lista"
                color="green"
                size="sm"
                className="text-xs"
              />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <ActionButton
            onClick={onNewListClick}
            icon={ArrowBigRightDash}
            iconSize={20}
            text="Pomodoro"
            color="primary"
            size="lg"
            className="w-full"
          />
        </div>
        <div>
          <AITextbox placeholder={placeholders} />
        </div>
      </div>

      {/* Mobile layout (sm-): dropdown + actions in row (50/50), pomodoro below, aitextbox below */}
      <div className="md:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <TaskListDropdown />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <TaskListActions tasks={tasks} />
              <ActionButton
                onClick={onNewListClick}
                icon={FolderPlus}
                iconSize={16}
                text="Nowa lista"
                color="green"
                size="sm"
                className="text-xs w-full"
              />
            </div>
          </div>
        </div>
        <div>
          <ActionButton
            onClick={onNewListClick}
            icon={ArrowBigRightDash}
            iconSize={20}
            text="Pomodoro"
            color="primary"
            size="lg"
            className="w-full"
          />
        </div>
        <div>
          <AITextbox placeholder={placeholders} />
        </div>
      </div>
    </div>
  );
}
