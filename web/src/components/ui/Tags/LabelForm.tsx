import { ColorPicker } from "@/components/ui/Common/ColorPicker";
import type { ColorName } from "@shared/data/Utils/colors";
import type { LabelFormProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";
import { useT } from "@shared/hooks/utils/useT";
import { Edit3, Plus } from "lucide-react";
import { useState } from "react";

export default function LabelForm({ mode, initialLabel, onSubmit, onCancel, loading }: LabelFormProps) {
  const { t } = useT();
  const [formData, setFormData] = useState({
    name: initialLabel?.label_name || "",
    color: (initialLabel?.color as ColorName) || "sky",
    description: initialLabel?.description || "",
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    try {
      if (mode === "edit" && initialLabel) {
        await onSubmit(formData, initialLabel.id);
      } else {
        await onSubmit(formData);
      }

      // Reset form only for create mode
      if (mode === "create") {
        setFormData({ name: "", color: "sky", description: "" });
      }
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} label:`, error);
    }
  };

  const handleCancel = () => {
    if (mode === "create") {
      setFormData({ name: "", color: "sky", description: "" });
    }
    onCancel();
  };

  const title = mode === "create" ? t("labels.form.createTitle") : t("labels.form.editTitle");
  const submitText = mode === "create" ? t("labels.form.create") : t("labels.form.save");
  const SubmitIcon = mode === "create" ? Plus : Edit3;

  return (
    <div className="bg-bg-alt rounded-lg p-6 shadow-md border border-gray-200 ">
      <h3 className="text-lg font-semibold mb-4 text-text ">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-2">{t("labels.form.name")}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={mode === "create" ? t("labels.form.namePlaceholder") : ""}
            className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-text  focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700  mb-2">
            {mode === "create" ? t("labels.form.descriptionOptional") : t("labels.form.description")}
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={mode === "create" ? t("labels.form.descriptionPlaceholder") : ""}
            className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-text  focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700  mb-2">{t("labels.form.color")}</label>
        <ColorPicker selectedColor={formData.color} onSelectColor={(color) => setFormData({ ...formData, color })} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!formData.name.trim() || loading}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50">
          <SubmitIcon size={16} />
          {submitText}
        </button>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          {t("common.cancel")}
        </button>
      </div>
    </div>
  );
}
