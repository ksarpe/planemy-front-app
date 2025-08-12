import { Star } from "lucide-react";

type Props = {
  total: number;
  completed: number;
};

export function ShoppingProgress({ total, completed }: Props) {
  if (total <= 0) return null;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="bg-white  rounded-md p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 ">Postęp zakupów</span>
        <span className="text-sm text-gray-500">
          {completed} z {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{percent}% ukończone</span>
        <span className="flex items-center gap-1">
          <Star size={12} />
          Świetna robota!
        </span>
      </div>
    </div>
  );
}
