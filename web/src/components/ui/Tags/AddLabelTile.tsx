import { Plus } from "lucide-react";
import type { AddLabelTileProps } from "@/data/Utils/Components/UtilComponentInterfaces";
import { useT } from "@shared/hooks/useT";

export default function AddLabelTile({ onClick, loading }: AddLabelTileProps) {
  const { t } = useT();

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-white  rounded-md p-4 shadow-md border-2 border-dashed border-gray-300 cursor-pointer  hover:border-primary hover:shadow-md transition-all duration-200 disabled:opacity-50 group">
      <div className="flex items-center justify-center">
        <h3 className="font-medium text-gray-600  group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
          <Plus size={16} />
          {t("labels.newLabel")}
        </h3>
      </div>
    </button>
  );
}
