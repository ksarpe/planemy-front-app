import type { TaskViewHeaderProps } from "@shared/data/Tasks/interfaces";
import { useTaskViewContext } from "@shared/hooks/context/useTaskViewContext";
import { useT } from "@shared/hooks/utils/useT";
import { ArrowBigRightDash, MoreVertical, Users } from "lucide-react";
import { Button } from "../Utils/button";

export function TaskViewHeader({ onToggleLists, listsOpen }: TaskViewHeaderProps) {
  const { t } = useT();
  const { currentTaskList } = useTaskViewContext();

  if (!currentTaskList) return null; //TODO: loading state or check chain logic to be sure if we even can get here without currentTaskList

  return (
    <>
      {/* List name and three dots button */}
      <div className="flex items-start gap-8 justify-between">
        <div className="flex gap-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-text">{currentTaskList.name}</h1>
            {currentTaskList.shared && <Users size={18} className="text-blue-600" />}
          </div>
          {onToggleLists && !listsOpen && (
            <button
              type="button"
              onClick={onToggleLists}
              className="text-text cursor-pointer hover:bg-bg-muted-light rounded-2xl">
              <MoreVertical size={22} />
            </button>
          )}
        </div>

        {/* Desktop layout */}
        <div className="flex-shrink-0 hidden md:flex">
          <Button onClick={() => {}} variant={"primary"} size="lg">
            <ArrowBigRightDash />
            {t("tasks.header.pomodoro")}
          </Button>
        </div>
        {/* Mobile layout */}
        <div className="flex-shrink-0 flex md:hidden">
          <Button onClick={() => {}} variant={"primary"} size="sm">
            <ArrowBigRightDash />
            {t("tasks.header.pomodoro")}
          </Button>
        </div>
      </div>
    </>
  );
}
