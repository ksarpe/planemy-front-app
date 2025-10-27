import { DeleteConfirmationModal, FloatingLabelInput } from "@/components/ui/Common";
import { ColorPicker } from "@/components/ui/Common/ColorPicker";
import { Drawer } from "@/components/ui/Common/Drawer";
import { Button } from "@/components/ui/shadcn/button";
import type { ColorName } from "@shared/data/Utils/colors";
import type { LabelInterface } from "@shared/data/Utils/interfaces";
import { useT } from "@shared/hooks/utils/useT";
import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";

interface LabelPanelProps {
  isOpen: boolean;
  onClose: () => void;
  label?: LabelInterface | null;
  onSubmit: (data: { label_name: string; color: string; description?: string }, labelId?: string) => Promise<void>;
  onDelete?: (labelId: string) => Promise<void>;
  loading?: boolean;
}

export default function LabelPanel({ isOpen, onClose, label, onSubmit, onDelete, loading }: LabelPanelProps) {
  const { t } = useT();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    label_name: "",
    color: "sky" as ColorName,
    description: "",
  });

  // Sync form data when label changes
  useEffect(() => {
    if (label) {
      setFormData({
        label_name: label.label_name || "",
        color: (label.color as ColorName) || "sky",
        description: label.description || "",
      });
    } else {
      setFormData({
        label_name: "",
        color: "rose",
        description: "",
      });
    }
  }, [label]);

  const handleSubmit = async () => {
    if (!formData.label_name.trim()) return;

    try {
      if (label?.id) {
        await onSubmit(formData, label.id);
      } else {
        await onSubmit(formData);
      }
      onClose();
    } catch (error) {
      console.error(`Error ${label ? "updating" : "creating"} label:`, error);
    }
  };

  const handleDelete = async () => {
    if (!label?.id || !onDelete) return;
    setShowDeleteConfirm(false);
    await onDelete(label.id);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      label_name: "",
      color: "rose",
      description: "",
    });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={label?.id ? "Edit Label" : "Create Label"}
      width="sm"
      position="right"
      header={
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold text-text">
            {label?.id ? t("labels.form.editTitle") : t("labels.form.createTitle")}
          </h2>
          {label?.id && onDelete && (
            <Button variant="delete" onClick={() => setShowDeleteConfirm(true)} disabled={loading}>
              <RiDeleteBinLine size={24} />
            </Button>
          )}
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button onClick={handleClose} variant="default" disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} variant="primary" disabled={!formData.label_name.trim() || loading}>
            {label?.id ? t("labels.form.save") : t("labels.form.create")}
          </Button>
        </div>
      }>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Name */}
          <FloatingLabelInput
            id="label-name"
            label={t("labels.form.name")}
            value={formData.label_name}
            labelBg="bg-bg-alt"
            onChange={(e) => setFormData({ ...formData, label_name: e.target.value })}
            autoFocus
          />

          {/* Description */}
          {/* <FloatingLabelTextarea
            id="label-description"
            label={label?.id ? t("labels.form.description") : t("labels.form.descriptionOptional")}
            labelBg="bg-bg-alt"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          /> */}

          {/* Color Picker */}
          <div>
            {/* <label className="block text-sm font-medium text-text-muted mb-3">{t("labels.form.color")}</label> */}
            <ColorPicker
              selectedColor={formData.color}
              onSelectColor={(color) => setFormData({ ...formData, color })}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {label && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title={t("labels.deleteConfirmation.title")}
          message={t("labels.deleteConfirmation.message")}
          itemName={label.label_name}
          confirmButtonText={t("labels.deleteConfirmation.confirmButton")}
        />
      )}
    </Drawer>
  );
}
