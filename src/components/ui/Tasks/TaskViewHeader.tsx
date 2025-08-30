import { MoreVertical, Users, ArrowBigRightDash } from "lucide-react";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../Common";
import type { TaskViewHeaderProps } from "@/data/Tasks/interfaces";

export function TaskViewHeader({ onToggleLists, listsOpen }: TaskViewHeaderProps) {
  const { t } = useTranslation();
  const { currentTaskList } = useTaskContext();

  if (!currentTaskList) return null;

  return (
    <div>
      {/* Nazwa listy i przycisk trzech kropek */}
      <div className="flex items-start gap-8 justify-between">
        <div className="flex gap-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-text-primary">{currentTaskList.name}</h1>
            {currentTaskList.shared && <Users size={18} className="text-blue-600" />}
          </div>
          {onToggleLists && !listsOpen && (
            <button
              type="button"
              onClick={onToggleLists}
              className="px-2 py-2 rounded-md bg-bg-hover border border-bg-hover hover:bg-primary hover:text-white transition-colors cursor-pointer">
              <MoreVertical size={16} />
            </button>
          )}
        </div>
        {/* Desktop layout */}
        <div className="flex-shrink-0 hidden md:flex">
          <ActionButton
            onClick={() => {}}
            icon={ArrowBigRightDash}
            iconSize={24}
            text={t("tasks.header.pomodoro")}
            color="primary"
            size="lg"
          />
        </div>
        <div className="flex-shrink-0 flex md:hidden">
          <ActionButton
            onClick={() => {}}
            icon={ArrowBigRightDash}
            justIcon={false}
            iconSize={24}
            text={t("tasks.header.pomodoro")}
            color="primary"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
