import type { LabelsGridProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";
import { LabelInterface } from "@shared/data/Utils/interfaces";
import EmptyLabelsState from "./EmptyLabelsState";
import LabelCard from "./LabelCard";

export default function LabelsGrid({ labels, onEdit, onDelete, onCreateNew }: LabelsGridProps) {
  if (labels.length === 0) {
    return <EmptyLabelsState onCreateFirst={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4-visible">
      {/* Existing Labels */}
      {labels.map((label: LabelInterface) => (
        <LabelCard key={label.id} label={label} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
