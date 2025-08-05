import { Tag, Plus } from "lucide-react";

interface EmptyLabelsStateProps {
  onCreateFirst: () => void;
}

export default function EmptyLabelsState({ onCreateFirst }: EmptyLabelsStateProps) {
  return (
    <div className="text-center py-12">
      <Tag size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Brak etykiet</h3>
      <p className="text-gray-500 dark:text-gray-500 mb-4">
        Rozpocznij organizację swoich zadań tworząc pierwszą etykietę
      </p>
      <button
        onClick={onCreateFirst}
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md transition-colors duration-200 mx-auto">
        <Plus size={18} />
        Utwórz pierwszą etykietę
      </button>
    </div>
  );
}
