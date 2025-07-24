import LiveTimeline from "@/components/ui/Calendar/Utils/LiveTimeline";
import DayEventsColumn from "@/components/ui/Calendar/WeeklyView/DayEventsColumn";
import EventBlock from "@/components/ui/Calendar/WeeklyView/EventBlock";
import { useCalendarContext } from "@/context/CalendarContext";
import { EventInterface } from "@/data/types";
import { getWeek, getEventsInWeekAndTop } from "@/utils/weeksHelper";
import { useRef } from "react";
import { getDateKey } from "@/utils/helpers";

export default function WeeklyBlock() {
  const { currentDate, hourlyEvents, dailyEvents, setCalendarClickContent, setModalPosition } = useCalendarContext();
  const week = getWeek(currentDate);
  const eventsInWeek = getEventsInWeekAndTop(dailyEvents, currentDate);
  console.log("WeeklyBlock eventsInWeek", eventsInWeek);
  const maxTopEvent =
    eventsInWeek.length > 0 ? eventsInWeek.reduce((max, event) => (event.top > max ? event.top : max), -Infinity) : 0;
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  //TODO: fix scroll to current hour
  // useEffect(() => {
  //   const now = new Date();
  //   const hour = now.getHours();
  //   const target = document.getElementById(`hour-${hour}`);
  //   if (target && scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollTop = target.offsetTop - 128;
  //   }
  // }, []);

  const openModal = (e: React.MouseEvent, event: EventInterface) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setCalendarClickContent({ type: "event", data: event });
    setModalPosition({ top: rect.top + 20, left: rect.left + rect.width });
  };

  const openDateModal = (e: React.MouseEvent, day: Date) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setCalendarClickContent({ type: "date", data: day });
    setModalPosition({ top: rect.top + 20, left: rect.left + rect.width });
  };

  return (
    <>
      <div className="grid bg-white" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }} ref={scrollContainerRef}>
        {/* 1. Sticky header */}
        <div className="sticky top-0 bg-white z-999 border-b border-gray-300 h-11" />
        {week.map((day) => (
          <div
            key={day.toLocaleDateString("pl-PL")}
            className="sticky top-0 h-11 bg-white z-999 flex items-center justify-center text-2xl border-b border-gray-300">
            <span
              className={`${
                new Date().toDateString() === day.toDateString() ? "bg-primary rounded-xl px-6" : ""
              }`}>
              {day.toLocaleDateString("pl-PL", { day: "numeric" })}
            </span>
          </div>
        ))}

        {/* Sticky all-day row */}
        {/* label */}
        <div className="text-sm text-right pr-2 border-r border-b sticky top-11 bg-white z-999 border-gray-300 flex items-center justify-end">
          all-day
        </div>

        {/* all-day events layer */}
        <div
          className={`col-span-7 sticky top-11 bg-white z-999 border-b border-gray-300`}
          style={{ height: maxTopEvent + 34 }}>
          {/* one row */}
          {eventsInWeek.map((event) => {
            const startDate = new Date(event.data.start);
            let startIndex = week.findIndex((d) => getDateKey(d) === getDateKey(startDate));
            if (startIndex === -1) startIndex = 0; // if not found, default to first day

            const left = `${(startIndex * 100) / 7}%`;
            const width = `${(event.data.colSpan ?? 1) * (100 / 7)}%`;
            const top = event.top;

            return (
              <div key={event.data.id} className={`absolute px-1 py-1`} style={{ left, width, top }}>
                <EventBlock event={event.data} onClick={(e, event) => openModal(e, event)} />
              </div>
            );
          })}
        </div>

        {/* 3. Column z godzinami */}
        <div className="border-r border-gray-300">
          <div className="mt-2">
            {hours.map((hour) => (
              <div id={`hour-${hour}`} key={hour} className="h-16 px-2 text-sm flex items-end justify-end pr-1 pt-1">
                {hour < 10 ? `0${hour}:00` : hour >= 24 ? "" : `${hour}:00`}
              </div>
            ))}
          </div>
        </div>
        {/* 4. Kolumny dni z eventami i slotami */}
        {week.map((day, idx) => (
          <div key={idx} className="relative border-r border-gray-300" style={{ height: `${hours.length * 4}rem` }}>
            <DayEventsColumn events={hourlyEvents[getDateKey(day)] || []} />
            {hours.map((_, i) => (
              <div key={i} className="h-16 border-b border-gray-200 relative" onClick={(e) => openDateModal(e, day)}>
                <LiveTimeline day={day} hour={i} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
