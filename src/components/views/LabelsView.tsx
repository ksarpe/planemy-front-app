import { useLabelContext } from "@/hooks/useLabelContext";
import { LabelInterface } from "@/data/types";
import { useState } from "react";
import { Plus, Tag, Edit3, Trash2 } from "lucide-react";

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

export default function LabelsView() {
  const { labels, createLabel, updateLabel, deleteLabel, loading } = useLabelContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelInterface | null>(null);
  const [newLabel, setNewLabel] = useState({ name: "", color: "#3B82F6", description: "" });

  const handleCreateLabel = async () => {
    if (!newLabel.name.trim()) return;

    try {
      await createLabel(newLabel.name, newLabel.color, newLabel.description);
      setNewLabel({ name: "", color: "#3B82F6", description: "" });
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating label:", error);
    }
  };

  const handleUpdateLabel = async () => {
    if (!editingLabel || !editingLabel.name.trim()) return;

    try {
      await updateLabel(editingLabel.id, {
        name: editingLabel.name,
        color: editingLabel.color,
        description: editingLabel.description,
      });
      setEditingLabel(null);
    } catch (error) {
      console.error("Error updating label:", error);
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę etykietę?")) {
      try {
        await deleteLabel(labelId);
      } catch (error) {
        console.error("Error deleting label:", error);
      }
    }
  };

  const resetCreateForm = () => {
    setNewLabel({ name: "", color: "#3B82F6", description: "" });
    setIsCreating(false);
  };

  const resetEditForm = () => {
    setEditingLabel(null);
  };

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full rounded-lg shadow-md overflow-auto flex flex-col gap-6 bg-bg-alt dark:bg-bg-dark p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold text-text dark:text-text-dark">
            Menedżer etykiet
          </h2>
        </div>

        {/* Create New Label Form */}
        {isCreating && (
          <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-text dark:text-text-dark">Utwórz nową etykietę</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nazwa etykiety
                </label>
                <input
                  type="text"
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                  placeholder="Wprowadź nazwę etykiety..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-bg-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opis (opcjonalny)
                </label>
                <input
                  type="text"
                  value={newLabel.description}
                  onChange={(e) => setNewLabel({ ...newLabel, description: e.target.value })}
                  placeholder="Krótki opis etykiety..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-bg-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kolor etykiety</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewLabel({ ...newLabel, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      newLabel.color === color ? "border-gray-800 scale-110" : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={newLabel.color}
                onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
                className="w-16 h-8 rounded border border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateLabel}
                disabled={!newLabel.name.trim() || loading}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50">
                <Plus size={16} />
                Utwórz
              </button>
              <button
                onClick={resetCreateForm}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Anuluj
              </button>
            </div>
          </div>
        )}

        {/* Edit Label Form */}
        {editingLabel && (
          <div className="bg-white dark:bg-bg-hover-dark rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-text dark:text-text-dark">Edytuj etykietę</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nazwa etykiety
                </label>
                <input
                  type="text"
                  value={editingLabel.name}
                  onChange={(e) => setEditingLabel({ ...editingLabel, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-bg-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opis</label>
                <input
                  type="text"
                  value={editingLabel.description || ""}
                  onChange={(e) => setEditingLabel({ ...editingLabel, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-bg-dark text-text dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kolor etykiety</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditingLabel({ ...editingLabel, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      editingLabel.color === color ? "border-gray-800 scale-110" : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={editingLabel.color}
                onChange={(e) => setEditingLabel({ ...editingLabel, color: e.target.value })}
                className="w-16 h-8 rounded border border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUpdateLabel}
                disabled={!editingLabel.name.trim() || loading}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50">
                <Edit3 size={16} />
                Zapisz
              </button>
              <button
                onClick={resetEditForm}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Anuluj
              </button>
            </div>
          </div>
        )}

        {/* Labels Grid */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4 text-text dark:text-text-dark">Twoje etykiety</h2>

          {labels.length === 0 ? (
            <div className="text-center py-12">
              <Tag size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Brak etykiet</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Rozpocznij organizację swoich zadań tworząc pierwszą etykietę
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors duration-200 mx-auto">
                <Plus size={18} />
                Utwórz pierwszą etykietę
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Add New Label Tile - only shown when labels exist */}

              {/* Existing Labels */}
              {labels.map((label: LabelInterface) => (
                <div
                  key={label.id}
                  className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: label.color }}
                      />
                      <h3 className="font-medium text-text dark:text-text-dark truncate">{label.name}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingLabel(label)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                        title="Edytuj etykietę">
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteLabel(label.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                        title="Usuń etykietę">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {label.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{label.description}</p>
                  )}

                  <div
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ backgroundColor: label.color + "20", color: label.color }}>
                    <Tag size={12} />
                    {label.name}
                  </div>
                </div>
              ))}
              <button
                onClick={() => setIsCreating(true)}
                disabled={loading}
                className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm border-2 border-dashed border-gray-300 cursor-pointer dark:border-gray-600 hover:border-primary hover:shadow-md transition-all duration-200 disabled:opacity-50 group">
                <div className="flex items-center justify-center">
                  <h3 className="font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-200">
                    + Nowa etykieta
                  </h3>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
