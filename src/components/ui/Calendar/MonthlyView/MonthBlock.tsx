import WeekRow from "@/components/ui/Calendar/MonthlyView/WeekRow";
import { useCalendarContext } from "@/context/CalendarContext";
import { generateWeeks } from "@/utils/weeksHelper";

export default function MonthBlock() {
  const { currentDate } = useCalendarContext(); // currentDate selected by the user in calendar
  const weeks = generateWeeks(currentDate);     // generate weeks based on the current date

  return (
    <div className="grid grid-cols-7 w-full flex-1" style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
      {weeks.map((week, idx) => (
        <WeekRow key={idx} days={week} />
      ))}
    </div>
  );
}
