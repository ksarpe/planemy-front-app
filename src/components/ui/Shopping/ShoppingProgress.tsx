import type { ShoppingProgressProps } from "@/data/Shopping/Components/ShoppingComponentInterfaces";

export function ShoppingProgress({ total, completed }: ShoppingProgressProps) {
  if (total <= 0) return null;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="bg-white  rounded-md p-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-text-light ">Postęp</span>
        <span className="text-sm text-text-light">
          {completed} z {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
