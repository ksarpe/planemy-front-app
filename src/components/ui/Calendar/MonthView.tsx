import { useMemo } from "react";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import EnhancedEventBlock from "./EnhancedEventBlock";
import { EventInterface } from "../../../data/types";

export default function MonthView() {
  const { currentDate, events } = useCalendarContext();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeksArray.push(calendarDays.slice(i, i + 7));
    }
    return weeksArray;
  }, [calendarDays]);

  const getEventsForDay = (day: Date): EventInterface[] => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      if (event.allDay) {
        return isSameDay(eventStart, day);
      }
      
      // Check if the day falls within the event's time range
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      return (eventStart <= dayEnd && eventEnd >= dayStart);
    });
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="h-full flex flex-col">
      {/* Week header */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-rows-6">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={dayIndex}
                  className={`relative border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[120px] ${
                    !isCurrentMonth ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"
                  } hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                >
                  {/* Day number */}
                  <div className="p-2">
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full ${
                        isDayToday
                          ? "bg-blue-600 text-white"
                          : isCurrentMonth
                          ? "text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                  </div>

                  {/* Events */}
                  <div className="px-2 pb-2 space-y-1">
                    {/* Standard events */}
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <EnhancedEventBlock
                        key={`${event.id}-${eventIndex}`}
                        event={event}
                        className="w-full"
                        showTime={false}
                      />
                    ))}

                    
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pl-2 py-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Add event overlay (appears on hover) */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute top-2 right-2">
                      <button
                        className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs flex items-center justify-center pointer-events-auto"
                        title="Add event"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Open add event modal with this date pre-selected
                          console.log("Add event for", format(day, "yyyy-MM-dd"));
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
