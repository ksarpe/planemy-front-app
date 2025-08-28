import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import type { CalendarBodyProps } from "@/data/Calendar/UI/ComponentInterfaces";

export default function CalendarBody({ className = "" }: CalendarBodyProps) {
  const { view } = useCalendarContext();

  return <div className={`flex-1 min-h-0 bg-bg  ${className}`}>{view === "month" ? <MonthView /> : <WeekView />}</div>;
}
