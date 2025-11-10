import { Button } from "@/components/ui/Utils/button";
import type { EmptyLabelsStateProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";
import { useT } from "@shared/hooks/utils/useT";
import { Plus, Tag } from "lucide-react";

export default function EmptyLabelsState({ onCreateFirst }: EmptyLabelsStateProps) {
  const { t } = useT();

  return (
    <div className="text-center py-12">
      <Tag size={48} className="mx-auto text-text-muted mb-4" />
      <h3 className="text-lg font-medium text-text-muted  mb-2">{t("labels.noLabels")}</h3>
      <p className="text-gray-500  mb-4">{t("labels.startOrganizing")}</p>
      <Button onClick={onCreateFirst} variant="primary" size="lg">
        <Plus size={18} />
        {t("labels.createFirstLabel")}
      </Button>
    </div>
  );
}
