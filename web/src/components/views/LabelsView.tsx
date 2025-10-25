import LabelForm from "@/components/ui/Tags/LabelForm";
import LabelsGrid from "@/components/ui/Tags/LabelsGrid";
import { LabelInterface } from "@shared/data/Utils/interfaces";
import { useLabelContext } from "@shared/hooks/context/useLabelContext";
import { useCreateLabel, useDeleteLabel, useUpdateLabel } from "@shared/hooks/labels/useLabels";
import { useT } from "@shared/hooks/utils/useT";
import { useState } from "react";

export default function LabelsView() {
  const { t } = useT();
  const { labels, isLoadingLabels } = useLabelContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelInterface | null>(null);
  const { mutateAsync: createLabel } = useCreateLabel();
  const { mutateAsync: updateLabel } = useUpdateLabel();
  const { mutateAsync: deleteLabel } = useDeleteLabel();

  const handleCreateLabel = async (data: { name: string; color: string; description?: string }) => {
    await createLabel({ label_name: data.name, color: data.color, description: data.description });
    setIsCreating(false);
  };

  const handleUpdateLabel = async (data: { name: string; color: string; description?: string }, labelId?: string) => {
    if (!labelId) return;
    await updateLabel({ id: labelId, data: { ...data } });
    setEditingLabel(null);
  };

  const handleDeleteLabel = async (labelId: string) => {
    await deleteLabel(labelId);
  };

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full rounded-lg shadow-md overflow-auto scrollbar-hide flex flex-col gap-6 bg-bg  p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold text-text ">{t("labels.title")}</h2>
        </div>

        {/* Create New Label Form */}
        {isCreating && (
          <LabelForm
            mode="create"
            onSubmit={handleCreateLabel}
            onCancel={() => setIsCreating(false)}
            loading={isLoadingLabels}
          />
        )}

        {/* Edit Label Form */}
        {editingLabel && (
          <LabelForm
            mode="edit"
            initialLabel={editingLabel}
            onSubmit={handleUpdateLabel}
            onCancel={() => setEditingLabel(null)}
            loading={isLoadingLabels}
          />
        )}

        {/* Labels Grid */}
        <div className="flex-1">
          <LabelsGrid
            labels={labels}
            onEdit={setEditingLabel}
            onDelete={handleDeleteLabel}
            onCreateNew={() => setIsCreating(true)}
            loading={isLoadingLabels}
          />
        </div>
      </div>
    </div>
  );
}
