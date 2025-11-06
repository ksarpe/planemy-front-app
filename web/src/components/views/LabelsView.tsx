import LabelPanel from "@/components/ui/Tags/LabelPanel";
import LabelsGrid from "@/components/ui/Tags/LabelsGrid";
import { ColorName } from "@shared/data/Utils";
import { LabelInterface } from "@shared/data/Utils/interfaces";
import { useLabelContext } from "@shared/hooks/context/useLabelContext";
import { useCreateLabel, useDeleteLabel, useUpdateLabel } from "@shared/hooks/labels/useLabels";
import { Palette, Plus, Sparkles, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/shadcn/button";

export default function LabelsView() {
  const { labels, isLoadingLabels } = useLabelContext();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<LabelInterface | null>(null);
  const { mutateAsync: createLabel } = useCreateLabel();
  const { mutateAsync: updateLabel } = useUpdateLabel();
  const { mutateAsync: deleteLabel } = useDeleteLabel();

  // Calculate color distribution
  const colorStats = useMemo(() => {
    const colorCounts = labels.reduce((acc, label) => {
      acc[label.color] = (acc[label.color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
    return {
      total: labels.length,
      mostUsedColor: sortedColors[0]?.[0],
      uniqueColors: Object.keys(colorCounts).length,
      colorDistribution: sortedColors,
    };
  }, [labels]);

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
    <div className="flex h-full p-6 gap-4">
      <div className="w-full rounded-2xl scrollbar-hide flex flex-col gap-6">
        {/* Header with Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Tag className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text">Labels</h1>
              <p className="text-sm text-text-muted">Organize with colors</p>
            </div>
          </div>

          <Button onClick={handleOpenCreatePanel} variant="primary" className="gap-2">
            <Plus size={16} />
            New Label
          </Button>
        </div>

        {/* Quick Stats */}
        {labels.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-bg-alt rounded-2xl p-4 border border-bg-muted-light">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="text-primary" size={16} />
                <span className="text-xs text-text-muted">Total</span>
              </div>
              <p className="text-2xl font-bold text-text">{colorStats.total}</p>
            </div>

            <div className="bg-bg-alt rounded-2xl p-4 border border-bg-muted-light">
              <div className="flex items-center gap-2 mb-1">
                <Palette className="text-purple-500" size={16} />
                <span className="text-xs text-text-muted">Colors</span>
              </div>
              <p className="text-2xl font-bold text-text">{colorStats.uniqueColors}</p>
            </div>

            <div className="bg-bg-alt rounded-2xl p-4 border border-bg-muted-light">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="text-green-500" size={16} />
                <span className="text-xs text-text-muted">Most Used</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${colorStats.mostUsedColor || "gray"}-500`} />
                <p className="text-sm font-semibold text-text capitalize">{colorStats.mostUsedColor || "None"}</p>
              </div>
            </div>
          </div>
        )}

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
