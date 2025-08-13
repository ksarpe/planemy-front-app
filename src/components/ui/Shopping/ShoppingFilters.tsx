import { Search } from "lucide-react";
import type { ShoppingFiltersProps } from "@/data/Shopping/interfaces";

export function ShoppingFilters({ searchQuery, onSearchChange }: ShoppingFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
      <div className="relative flex gap-1">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Szukaj produktów..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
}
