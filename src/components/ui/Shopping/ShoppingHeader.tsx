import type { ShoppingHeaderProps } from "@/data/Shopping/interfaces";

export function ShoppingHeader({ name, stats }: ShoppingHeaderProps) {
  const { pending, completed, totalValue } = stats;

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <h1 className="text-2xl font-semibold">{name}</h1>
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
