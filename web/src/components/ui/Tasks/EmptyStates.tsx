import { ListTodo, List } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmptyStatesProps } from "@shared/data/Tasks/interfaces";
import { Button } from "../shadcn/button";

export default function EmptyStates({ type, onCreateListClick }: EmptyStatesProps) {
  const { t } = useTranslation();

  if (type === "no-lists") {
    return (
      <div className="text-center py-12">
        <ListTodo size={48} className="mx-auto text-gray-400  mb-4" />
        <h3 className="text-lg font-medium text-gray-600  mb-2">{t("tasks.empty.noLists.title")}</h3>
        <p className="text-gray-500  mb-4">{t("tasks.empty.noLists.description")}</p>
        <Button onClick={onCreateListClick} variant="primary">
          Create task
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
