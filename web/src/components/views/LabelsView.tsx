import LabelPanel from "@/components/ui/Tags/LabelPanel";
import LabelsGrid from "@/components/ui/Tags/LabelsGrid";
import { ColorName } from "@shared/data/Utils";
import { LabelInterface } from "@shared/data/Utils/interfaces";
import { useLabelContext } from "@shared/hooks/context/useLabelContext";
import { useCreateLabel, useDeleteLabel, useUpdateLabel } from "@shared/hooks/labels/useLabels";
import { useT } from "@shared/hooks/utils/useT";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/shadcn/button";

export default function LabelsView() {
  const { t } = useT();
  const { labels, isLoadingLabels } = useLabelContext();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<LabelInterface | null>(null);
  const { mutateAsync: createLabel } = useCreateLabel();
  const { mutateAsync: updateLabel } = useUpdateLabel();
  const { mutateAsync: deleteLabel } = useDeleteLabel();

  const handleCreateLabel = async (data: { label_name: string; color: ColorName; description?: string }) => {
    await createLabel({ label_name: data.label_name, color: data.color, description: data.description });
  };

  const handleUpdateLabel = async (
    data: { label_name: string; color: ColorName; description?: string },
    labelId?: string,
  ) => {
    if (!labelId) return;
    await updateLabel({ id: labelId, data: { ...data } });
  };

  const handleDeleteLabel = async (labelId: string) => {
    await deleteLabel(labelId);
  };

  const handleOpenCreatePanel = () => {
    setSelectedLabel(null);
    setIsPanelOpen(true);
  };

  const handleOpenEditPanel = (label: LabelInterface) => {
    setSelectedLabel(label);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedLabel(null);
  };

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full rounded-2xl overflow-auto scrollbar-hide flex flex-col gap-6 bg-bg p-6">
        {/* Header */}
        <div className="flex flex-col justify-between items-start gap-4">
          <h2 className="text-2xl font-semibold text-text ">{t("labels.title")}</h2>
          <Button onClick={handleOpenCreatePanel} variant="primary">
            <Plus size={16} />
            Create label
          </Button>
        </div>

        {/* Labels Grid */}
        <div className="flex-1">
          <LabelsGrid
            labels={labels}
            onEdit={handleOpenEditPanel}
            onDelete={handleDeleteLabel}
            onCreateNew={handleOpenCreatePanel}
            loading={isLoadingLabels}
          />
        </div>
      </div>

      {/* Label Panel (Create/Edit) */}
      <LabelPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        label={selectedLabel}
        onSubmit={selectedLabel ? handleUpdateLabel : handleCreateLabel}
        onDelete={handleDeleteLabel}
        loading={isLoadingLabels}
      />
    </div>
  );
}
