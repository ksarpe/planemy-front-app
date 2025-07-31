import { LabelInterface } from "@/data/Utils/interfaces";
import LabelCard from "./LabelCard";
import AddLabelTile from "./AddLabelTile";
import EmptyLabelsState from "./EmptyLabelsState";

interface LabelsGridProps {
  labels: LabelInterface[];
  onEdit: (label: LabelInterface) => void;
  onDelete: (labelId: string) => void;
  onCreateNew: () => void;
  loading: boolean;
}

export default function LabelsGrid({ labels, onEdit, onDelete, onCreateNew, loading }: LabelsGridProps) {
  if (labels.length === 0) {
    return <EmptyLabelsState onCreateFirst={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Existing Labels */}
      {labels.map((label: LabelInterface) => (
        <LabelCard key={label.id} label={label} onEdit={onEdit} onDelete={onDelete} />
      ))}

      {/* Add New Label Tile - only shown when labels exist */}
      <AddLabelTile onClick={onCreateNew} loading={loading} />
    </div>
  );
}
