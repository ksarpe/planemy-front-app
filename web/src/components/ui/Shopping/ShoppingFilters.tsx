import { Search } from "lucide-react";
import type { ShoppingFiltersProps } from "@shared/data/Shopping/Components/ShoppingComponentInterfaces";

export function ShoppingFilters({ searchQuery, onSearchChange }: ShoppingFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex">
        <Search size={20} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-light" />
        <input
          type="text"
          placeholder="Szukaj..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 py-2 border border-text-light rounded-lg"
        />
      </div>
    </div>
  );
}
