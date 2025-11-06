import type { LabelsGridProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";
import { LabelInterface } from "@shared/data/Utils/interfaces";
import { Plus } from "lucide-react";
import { Button } from "../shadcn/button";
import EmptyLabelsState from "./EmptyLabelsState";
import LabelCard from "./LabelCard";

export default function LabelsGrid({ labels, onEdit, onDelete, onCreateNew }: LabelsGridProps) {
  if (labels.length === 0) {
    return <EmptyLabelsState onCreateFirst={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Existing Labels */}
      {labels.map((label: LabelInterface) => (
        <LabelCard key={label.id} label={label} onEdit={onEdit} onDelete={onDelete} />
      ))}

      {/* Add New Label Button */}
      <div className="flex items-stretch">
        <Button
          onClick={onCreateNew}
          className="aspect-square h-full min-h-[64px] max-h-[120px] w-full rounded-full border-dashed border-2 border-bg hover:border-primary hover:scale-105 hover:bg-transparent flex items-center justify-center group"
          style={{ minWidth: "64px", maxWidth: "120px" }}
          variant="ghost">
          <Plus size="32" className="text-primary/20 group-hover:text-primary/60 group-hover:scale-110 group-hover:rotate-180 duration-500 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
