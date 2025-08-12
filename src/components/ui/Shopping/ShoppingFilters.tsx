import { Search, List, Grid3X3 } from "lucide-react";
import type { ShoppingCategoryInterface } from "@/data/types";

type Props = {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (v: string | null) => void;
  categories: ShoppingCategoryInterface[];
  viewMode: "grid" | "list";
  onToggleView: () => void;
};

export function ShoppingFilters({
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleView,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
      <div className="relative flex gap-1">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Szukaj produktów..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onToggleView}
          className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 w-10 md:w-auto flex items-center justify-center">
          {viewMode === "grid" ? <List size={20} /> : <Grid3X3 size={20} />}
        </button>
      </div>

      <div className="flex gap-2 md:items-center">
        {/* <select
          value={selectedCategory || ""}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="flex-1 md:flex-none w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Wszystkie kategorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.emoji} {category.name}
            </option>
          ))}
        </select> */}
      </div>
    </div>
  );
}
