import { useLabelContext } from "@shared/hooks/context/useLabelContext";
import { LabelInterface } from "@shared/data/Utils/interfaces";
import { useState } from "react";
import LabelForm from "@/components/ui/Tags/LabelForm";
import LabelsGrid from "@/components/ui/Tags/LabelsGrid";
import { useT } from "@shared/hooks/useT";

export default function LabelsView() {
  const { t } = useT();
  const { labels, createLabel, updateLabel, deleteLabel, loading } = useLabelContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelInterface | null>(null);

  const handleCreateLabel = async (data: { name: string; color: string; description?: string }) => {
    await createLabel(data.name, data.color, data.description);
    setIsCreating(false);
  };

  const handleUpdateLabel = async (data: { name: string; color: string; description?: string }, labelId?: string) => {
    if (!labelId) return;
    await updateLabel(labelId, data);
    setEditingLabel(null);
  };

  const handleDeleteLabel = async (labelId: string) => {
    await deleteLabel(labelId);
  };

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full rounded-md shadow-md overflow-auto scrollbar-hide flex flex-col gap-6 bg-bg-alt  p-6">
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
            loading={loading}
          />
        )}

        {/* Edit Label Form */}
        {editingLabel && (
          <LabelForm
            mode="edit"
            initialLabel={editingLabel}
            onSubmit={handleUpdateLabel}
            onCancel={() => setEditingLabel(null)}
            loading={loading}
          />
        )}

        {/* Labels Grid */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4 text-text ">{t("labels.yourLabels")}</h2>

          <LabelsGrid
            labels={labels}
            onEdit={setEditingLabel}
            onDelete={handleDeleteLabel}
            onCreateNew={() => setIsCreating(true)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
