import { useEffect, useState } from "react";
import { useCreateShoppingList } from "@shared/hooks/shopping/useShoppingLists";
import { X } from "lucide-react";
import type { AddListModalProps } from "@/data/Shopping/Components/ShoppingComponentInterfaces";

function AddListModal({ isOpen, onClose }: AddListModalProps) {
  const createList = useCreateShoppingList();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
        setFormData({ name: "" });
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await createList.mutateAsync({
        name: formData.name.trim(),
      });
      setFormData({ name: "" });
      onClose();
    } catch (error) {
      console.error("Error creating list:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white  rounded-md shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center px-4 pt-4">
          <div></div>
          <h2 className="text-xl font-semibold">Utwórz nową listę</h2>
          <button onClick={handleClose} className=" hover:bg-gray-100  rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Zakupy na tydzień"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-300"
              required
              autoFocus
            />
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
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-text-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>Utwórz</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { AddListModal };
