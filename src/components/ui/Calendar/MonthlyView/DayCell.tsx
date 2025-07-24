import EventBlock from "@/components/ui/Calendar/MonthlyView/EventBlock";
import { useCalendarContext } from "@/context/CalendarContext";
import { EventInterface } from "@/data/types";
import { formatDateToYMD, getDatePart } from "@/utils/helpers";

export default function DayCell({
  date,
  currentWeekEvents = [],
  weekStart,
}: {
  date: Date;
  currentWeekEvents: { data: EventInterface; top: number }[];
  weekStart: Date;
}) {
  const { currentDate, setModalPosition, setCalendarClickContent, setView } = useCalendarContext();
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  const isOtherMonth = date.getMonth() !== currentDate.getMonth();

  const todayDateString = formatDateToYMD(date);
  const weekStartDateString = formatDateToYMD(weekStart);

  // Check if we have to generate any event block for today
  // Basically we skip only if event is just going thorugh today.
  const eventsForDay = currentWeekEvents.filter(
    (event) =>
      //events started today
      todayDateString === getDatePart(event.data.start) ||
      // OR event started in previous week and ends in this week
      (new Date(event.data.start) < weekStart &&
        todayDateString < getDatePart(event.data.end) &&
        weekStartDateString === todayDateString) ||
      // OR event started in previous week and ends at the first day of this week
      (new Date(event.data.start) < weekStart &&
        todayDateString === getDatePart(event.data.end) &&
        weekStartDateString === getDatePart(event.data.end))
  );

  const openDateModal = (e: React.MouseEvent, day: Date) => {
    setCalendarClickContent({ type: "date", data: day });
    setModalPosition({ top: e.clientY + 10, left: e.clientX + 10 });
  };

  return (
    <div
      onClick={(e) => openDateModal(e, date)}
      className={`relative flex flex-col items-center justify-start border-b border-r-1 dark:border-gray-600 border-slate-100 pt-1 bg-white`}>
      {/* TODO: maybe some loop which will iterate thorugh additionalData and span this here. */}
     
      {/* Check if this date belongs to other month so color should be different */}
      <span
        className={`text-xs ${
          isOtherMonth
            ? "text-gray-400"
            : isToday
            ? "text-black bg-primary rounded-lg font-bold px-4"
            : "text-black dark:text-white"
        }`}>
        {date.getDate() === 1 ? date.getDate() + " " + date.toLocaleString("en", { month: "short" }) : date.getDate()}
      </span>
      {/* Events */}
      {/* Generate event block for each event that will fit there (<84px) */}
      <div className="flex flex-col items-start w-full">
        {eventsForDay
          .filter((ev) => ev.top <= 84)
          .map((eventObj, idx) => (
            <div className={`w-full relative`} key={idx}>
              <EventBlock event={eventObj} skipLeftPadding={getDatePart(eventObj.data.start) < weekStartDateString} />
            </div>
          ))}
        {/* If there are more than 3 events, show +X more */}
        {eventsForDay.some((event) => event.top > 84) && (
          <span
            className="absolute text-[10px] text-gray-500 dark:text-white cursor-pointer px-1"
            onClick={(e) => {
              setView("week");
              e.stopPropagation();
            }}
            style={{ top: `140px` }}>
            +{eventsForDay.filter((event) => event.top > 84).length} more
          </span>
        )}
      </div>
    </div>
  );
}
