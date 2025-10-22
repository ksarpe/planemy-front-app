import { Tag, Plus } from "lucide-react";
import type { EmptyLabelsStateProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";
import { useT } from "@shared/hooks/utils/useT";

export default function EmptyLabelsState({ onCreateFirst }: EmptyLabelsStateProps) {
  const { t } = useT();

  return (
    <div className="text-center py-12">
      <Tag size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-600  mb-2">{t("labels.noLabels")}</h3>
      <p className="text-gray-500  mb-4">{t("labels.startOrganizing")}</p>
      <button
        onClick={onCreateFirst}
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors duration-200 mx-auto">
        <Plus size={18} />
        {t("labels.createFirstLabel")}
      </button>
    </div>
  );
}
