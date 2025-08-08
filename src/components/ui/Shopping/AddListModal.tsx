import { useState } from "react";
import { useShoppingContext } from "../../../hooks/context/useShoppingContext";
import { X, Plus, Palette } from "lucide-react";

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emojis = ["📝", "🛒", "🥕", "🍎", "🥛", "🍞", "🏠", "💼", "🎉", "❤️"];
const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#6B7280", "#84CC16"];

function AddListModal({ isOpen, onClose }: AddListModalProps) {
  const { createList } = useShoppingContext();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "📝",
    color: "#3B82F6",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await createList(formData.name.trim(), formData.description.trim() || "", formData.emoji, formData.color);
      setFormData({ name: "", description: "", emoji: "📝", color: "#3B82F6" });
      onClose();
    } catch (error) {
      console.error("Error creating list:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", emoji: "📝", color: "#3B82F6" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white  rounded-md shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Utwórz nową listę</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100  rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Nazwa listy *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="np. Zakupy na tydzień"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Opis (opcjonalny)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Dodaj opis listy..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Ikona</label>
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, emoji }))}
                  className={`p-3 text-xl rounded-md border-2 transition-colors ${
                    formData.emoji === emoji ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Kolor</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-full h-10 rounded-md border-2 transition-all ${
                    formData.color === color ? "border-gray-800 scale-110" : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}>
                  {formData.color === color && <Palette size={16} className="mx-auto text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Plus size={16} />
                  Utwórz listę
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { AddListModal };
