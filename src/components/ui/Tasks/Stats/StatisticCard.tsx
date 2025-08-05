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
      className={clsx("w-full text-left px-2 rounded-md", {
        // Zaznaczony
        "bg-white dark:bg-bg-item-hover-dark border-primary dark:bg-hover-dark shadow-md border-2": isSelected,
        // Niezaznaczony
        "bg-white dark:bg-bg-item-dark shadow-sm hover:shadow-lg hover:-translate-y-0.5":
          !isSelected,
      })}>
      {/* Górna część: Ikona i Tytuł */}
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
        <Icon size={16} className={clsx("flex-shrink-0", iconColor)} />
        <span className="text-sm font-medium truncate">{title}</span>
      </div>

      {/* Dolna część: Licznik */}
      <div className="block text-xl font-bold text-gray-800 dark:text-text-dark">{count}</div>
    </button>
  );
}
