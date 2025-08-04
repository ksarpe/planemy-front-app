import { LucideIcon } from "lucide-react";
import { clsx } from "clsx"; // Proponuję użyć `clsx` do łatwiejszego łączenia klas

interface StatisticCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string; // np. "text-blue-500"
  isSelected: boolean;
  onClick: () => void;
}

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
      className={clsx(
        // Style podstawowe
        "w-full text-left p-3 rounded-lg border transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",

        // Style w zależności od stanu zaznaczenia
        {
          // Zaznaczony
          "bg-blue-50 dark:bg-blue-950/50 border-blue-500 shadow-md": isSelected,
          // Niezaznaczony
          "bg-white dark:bg-gray-800 border-transparent shadow-sm hover:shadow-lg hover:-translate-y-0.5": !isSelected,
        }
      )}
    >
      {/* Górna część: Ikona i Tytuł */}
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Icon size={16} className={clsx("flex-shrink-0", iconColor)} />
        <span className="text-sm font-medium truncate">{title}</span>
      </div>

      {/* Dolna część: Licznik */}
      <div className="block mt-1 text-2xl font-bold text-gray-800 dark:text-white">
        {count}
      </div>
    </button>
  );
}