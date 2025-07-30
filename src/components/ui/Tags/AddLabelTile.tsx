import { Plus } from "lucide-react";

interface AddLabelTileProps {
  onClick: () => void;
  loading: boolean;
}

export default function AddLabelTile({ onClick, loading }: AddLabelTileProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-white dark:bg-bg-hover-dark rounded-lg p-4 shadow-sm border-2 border-dashed border-gray-300 cursor-pointer dark:border-gray-600 hover:border-primary hover:shadow-md transition-all duration-200 disabled:opacity-50 group">
      <div className="flex items-center justify-center">
        <h3 className="font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
          <Plus size={16} />
          Nowa etykieta
        </h3>
      </div>
    </button>
  );
}
