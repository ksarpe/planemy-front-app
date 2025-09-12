import { Tag, Edit3, Trash2 } from "lucide-react";
import type { LabelCardProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";
import { useT } from "@shared/hooks/utils/useT";

export default function LabelCard({ label, onEdit, onDelete }: LabelCardProps) {
  const { t } = useT();

  const handleDelete = () => {
    if (window.confirm(t("labels.actions.confirmDelete"))) {
      onDelete(label.id);
    }
  };

  return (
    <div className="bg-white  rounded-md p-4 shadow-md border border-gray-200  hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: label.color }} />
          <h3 className="font-medium text-text  truncate">{label.name}</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(label)}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
            title={t("labels.actions.edit")}>
            <Edit3 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
            title={t("labels.actions.delete")}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {label.description && <p className="text-sm text-gray-600  mb-3">{label.description}</p>}

      <div
        className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
        style={{ backgroundColor: label.color + "20", color: label.color }}>
        <Tag size={12} />
        {label.name}
      </div>
    </div>
  );
}
