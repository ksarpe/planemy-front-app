import { useState } from "react";
import { Plus, Edit3 } from "lucide-react";
import { useT } from "@shared/hooks/useT";

const predefinedColors = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#6B7280",
  "#374151",
  "#1F2937",
];

import type { LabelFormProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";

export default function LabelForm({ mode, initialLabel, onSubmit, onCancel, loading }: LabelFormProps) {
  const { t } = useT();
  const [formData, setFormData] = useState({
    name: initialLabel?.name || "",
    color: initialLabel?.color || "#3B82F6",
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
        setFormData({ name: "", color: "#3B82F6", description: "" });
      }
    } catch (error) {
      console.error(`Error ${mode === "create" ? "creating" : "updating"} label:`, error);
    }
  };

  const handleCancel = () => {
    if (mode === "create") {
      setFormData({ name: "", color: "#3B82F6", description: "" });
    }
    onCancel();
  };

  const title = mode === "create" ? t("labels.form.createTitle") : t("labels.form.editTitle");
  const submitText = mode === "create" ? t("labels.form.create") : t("labels.form.save");
  const SubmitIcon = mode === "create" ? Plus : Edit3;

  return (
    <div className="bg-white  rounded-md p-6 shadow-md border border-gray-200 ">
      <h3 className="text-lg font-semibold mb-4 text-text ">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-2">{t("labels.form.name")}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={mode === "create" ? t("labels.form.namePlaceholder") : ""}
            className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-text  focus:ring-2 focus:ring-primary focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-text  focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700  mb-2">{t("labels.form.color")}</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {predefinedColors.map((color) => (
            <button
              key={color}
              onClick={() => setFormData({ ...formData, color })}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                formData.color === color ? "border-gray-800 scale-110" : "border-gray-300 hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <input
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="w-16 h-8 rounded border border-gray-300 "
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!formData.name.trim() || loading}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50">
          <SubmitIcon size={16} />
          {submitText}
        </button>
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
          {t("common.cancel")}
        </button>
      </div>
    </div>
  );
}
