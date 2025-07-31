import { useCalendarContext } from "@/hooks/useCalendarContext";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

interface ModernCalendarBodyProps {
  className?: string;
}

export default function ModernCalendarBody({ className = "" }: ModernCalendarBodyProps) {
  const { view } = useCalendarContext();

  return (
    <div className={`flex-1 min-h-0 bg-white dark:bg-gray-900 ${className}`}>
      {view === "month" ? <MonthView /> : <WeekView />}
    </div>
  );
}
