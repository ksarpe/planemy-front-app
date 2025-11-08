import type { StatisticCardProps } from "@shared/data/Tasks/interfaces";
import { clsx } from "clsx";

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
      className={clsx("w-full text-center border border-bg-muted-light  shadow-md hover:scale-105 duration-200 sm:text-left px-2 rounded-2xl bg-bg-alt cursor-pointer  ", {
        // Zaznaczony
        " text-text border-primary": isSelected,
        // Niezaznaczony
        " text-text-muted-more   ": !isSelected,
      })}>
      <div className="flex flex-col lg:flex-row xl:flex-col justify-center gap-2">
        {/* Górna część: Ikona i Tytuł */}
        <div className="flex items-center gap-2 text-center justify-center xl:justify-start">
          <Icon size={16} className={clsx("flex-shrink-0", iconColor)} />
          <span className="text-sm font-medium truncate hidden xl:block">{title}</span>
        </div>

        {/* Dolna część: Licznik */}
        <div className="block text-xl font-bold text-center xl:text-left ">{count}</div>
      </div>
    </button>
  );
}
