import { useState } from "react";

interface CreateTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  loading: boolean;
}

export default function CreateTaskListModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading 
}: CreateTaskListModalProps) {
  const [listName, setListName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;
    
    await onSubmit(listName.trim());
    setListName("");
    onClose();
  };

  const handleClose = () => {
    setListName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-semibold mb-4">Utwórz nową listę zadań</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nazwa listy
            </label>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="np. Zadania domowe, Praca..."
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!listName.trim() || loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Utwórz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
