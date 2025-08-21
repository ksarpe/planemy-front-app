import { clsx } from "clsx";
import type { StatisticCardProps } from "@/data/Tasks/interfaces";

export default function StatisticCard({
  title,
  count,
  icon: Icon,
  iconColor,
  isSelected,
  onClick,
}: StatisticCardProps) {
  return (
    <button
      onClick={onClick}
      className={clsx("w-full text-center sm:text-left px-2 rounded-md", {
        // Zaznaczony
        "bg-white  border-primary  shadow-md border-2": isSelected,
        // Niezaznaczony
        "bg-white  shadow-sm hover:shadow-lg hover:-translate-y-0.5": !isSelected,
      })}>
      <div className="flex flex-col lg:flex-row xl:flex-col justify-center gap-2">
        {/* Górna część: Ikona i Tytuł */}
        <div className="flex items-center gap-2 text-gray-500 text-center justify-center xl:justify-start">
          <Icon size={16} className={clsx("flex-shrink-0", iconColor)} />
          <span className="text-sm font-medium truncate hidden xl:block">{title}</span>
        </div>

        {/* Dolna część: Licznik */}
        <div className="block text-xl font-bold text-gray-800 text-center xl:text-left ">{count}</div>
      </div>
    </button>
  );
}
