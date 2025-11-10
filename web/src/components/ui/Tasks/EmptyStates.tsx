import { EmptyStatesProps } from "@shared/data/Tasks/interfaces";
import { useT } from "@shared/hooks/utils/useT";
import { List, ListTodo, Plus } from "lucide-react";
import { Button } from "../Utils/button";

export default function EmptyStates({ type, onCreateListClick }: EmptyStatesProps) {
  const { t } = useT();

  if (type === "no-lists") {
    return (
      <div className="text-center py-12">
        <ListTodo size={48} className="mx-auto text-text-muted  mb-4" />
        <h3 className="text-lg font-medium text-text-muted  mb-2">{t("tasks.empty.noLists.title")}</h3>
        <p className="text-text-muted mb-4">{t("tasks.empty.noLists.description")}</p>
        <Button onClick={onCreateListClick} variant="primary" type="button">
          <Plus size={16} />
          Create First List
        </Button>
      </div>
    );
  }

  if (type === "no-list-selected") {
    return (
      <div className="text-center py-12">
        <List size={48} className="mx-auto text-gray-400  mb-4" />
        <h3 className="text-lg font-medium text-gray-600  mb-2">{t("tasks.empty.noListSelected.title")}</h3>
        <p className="text-gray-500 ">{t("tasks.empty.noListSelected.description")}</p>
      </div>
    );
  }

  return null;
}
