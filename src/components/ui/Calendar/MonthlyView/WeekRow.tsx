import DayCell from "@/components/ui/Calendar/MonthlyView/DayCell";
import { useCalendarContext } from "@/context/CalendarContext";
import { EventInterface } from "@/data/types";
import { getEventsInWeekAndTop } from "@/utils/weeksHelper";

export default function WeekRow({ days }: { days: Date[] }) {
  const { dailyEvents, hourlyEvents } = useCalendarContext();
  //Get all events for the current week Row and then pass certain events to each day cell
  const allEvents: Record<string, EventInterface[]> = {};
  for (const key of new Set([...Object.keys(hourlyEvents), ...Object.keys(dailyEvents)])) {
    allEvents[key] = [...(hourlyEvents[key] || []), ...(dailyEvents[key] || [])];
  }
  const formatedEvents: { data: EventInterface; top: number }[] = getEventsInWeekAndTop(allEvents, days[0]);

  return (
    <>
      {days.map((day, idx) => (
        <DayCell key={idx} date={day} currentWeekEvents={formatedEvents} weekStart={days[0]}/>
      ))}
    </>
  );
}
