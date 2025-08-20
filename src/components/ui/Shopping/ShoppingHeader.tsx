import type { ExtendedShoppingHeaderProps } from "@/data/Shopping/Components/ShoppingComponentInterfaces";
import { Menu } from "lucide-react";

export function ShoppingHeader({ name, stats, onToggleLists, listsOpen }: ExtendedShoppingHeaderProps) {
  const { pending, completed, totalValue } = stats;

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-2 md:mb-4 flex-wrap justify-between md:justify-start">
          <h1 className="text-2xl font-semibold">{name}</h1>
          {onToggleLists && !listsOpen && (
            <button
              type="button"
              onClick={onToggleLists}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-bg-alt border border-bg-hover hover:bg-bg-hover transition-colors text-sm">
              <Menu size={16} /> {listsOpen ? "Zamknij listy" : "Listy / Ulubione"}
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-2 mb-1 md:mb-0">
          {/* Do kupienia */}
          <div className="bg-white rounded-md p-2 shadow-sm flex flex-col justify-evenly h-full">
            <span className="text-xs sm:text-sm font-medium text-yellow-600 whitespace-nowrap">Do kupienia</span>
            <div className="text-lg sm:text-2xl font-bold text-gray-800">{pending}</div>
          </div>

          {/* Kupione */}
          <div className="bg-white rounded-md p-2 shadow-sm flex flex-col justify-evenly h-full">
            <span className="text-xs sm:text-sm font-medium text-green-600 whitespace-nowrap">Kupione</span>
            <div className="text-lg sm:text-2xl font-bold text-gray-800">{completed}</div>
          </div>

          {/* Wartość */}
          <div className="bg-white rounded-md p-2 shadow-sm flex flex-col justify-evenly h-full">
            <span className="text-xs sm:text-sm font-medium text-purple-600 whitespace-nowrap">Wartość</span>
            <div className="text-lg sm:text-xl font-bold text-gray-800 flex items-end gap-1">
              {totalValue.toFixed(2)}
              <span className="text-[10px] sm:text-xs">zł</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
