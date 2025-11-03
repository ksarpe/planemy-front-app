import type { LabelCardProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";
import { getBadgeColorClasses, type ColorName } from "@shared/data/Utils/colors";
import { Tag } from "lucide-react";
import { Badge } from "../Common/Badge";

export default function LabelCard({ label, onEdit }: LabelCardProps) {
  const colorClasses = getBadgeColorClasses(label.color as ColorName);

  return (
    <div
      className="bg-bg-alt  rounded-2xl p-4 shadow-md border border-bg-muted-light  hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onEdit(label)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full border ${colorClasses}`} />
          <h3 className="font-medium text-text  truncate">{label.label_name}</h3>
        </div>
      </div>

      {label.description && <p className="text-sm text-gray-600  mb-3">{label.description}</p>}

      <Badge variant={label.color as ColorName} size="lg">
        <Tag size={12} />
        {label.label_name}
      </Badge>
    </div>
  );
}
