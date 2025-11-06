import type { LabelCardProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";
import { getBadgeColorClasses, type ColorName } from "@shared/data/Utils/colors";
import { Tag } from "lucide-react";
import { Badge } from "../Common/Badge";

export default function LabelCard({ label, onEdit }: LabelCardProps) {
  const colorClasses = getBadgeColorClasses(label.color as ColorName);

  return (
    <div
      className="group bg-bg-alt rounded-2xl p-5 border border-bg-muted-light hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
      onClick={() => onEdit(label)}>
      {/* Color accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${colorClasses} opacity-50 group-hover:opacity-100 transition-opacity`}
      />

      {/* Header with color indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center group-hover:scale-110 transition-transform ${colorClasses}`}>
            <Tag size={18} className="text-white" />
          </div>
          <h3 className="font-semibold text-text text-base truncate">{label.label_name}</h3>
        </div>
      </div>

      {/* Description */}
      {label.description && <p className="text-sm text-text-muted mb-4 line-clamp-2">{label.description}</p>}

      {/* Badge preview */}
      <div className="flex items-center gap-2">
        <Badge variant={label.color as ColorName} size="lg">
          <Tag size={12} />
          {label.label_name}
        </Badge>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-primary/80 font-medium">Edit →</span>
      </div>
    </div>
  );
}
