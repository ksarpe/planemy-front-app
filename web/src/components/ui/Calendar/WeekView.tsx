import { useMemo } from "react";
import { useCalendarContext } from "@shared/hooks/context/useCalendarContext";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { useT } from "@shared/hooks/useT";
import EventBlock from "./Event/EventBlock";
import { EventInterface } from "@/data/Calendar/events";

export default function WeekView() {
  const { currentDate, events } = useCalendarContext();
  const { currentLanguage } = useT();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Choose locale based on current language
  const locale = currentLanguage === "pl" ? pl : undefined;

  // Generate time slots (24 hours)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        hour,
        time: format(new Date().setHours(hour, 0, 0, 0), "HH:mm"),
      });
    }
    return slots;
  }, []);

  const getEventsForDay = (day: Date): EventInterface[] => {
    return events.filter((event) => {
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

      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  };

  const getEventPosition = (event: EventInterface) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    if (event.allDay) {
      return { top: 0, height: 40 };
    }

    // Calculate position based on time
    const startHour = eventStart.getHours();
    const startMinutes = eventStart.getMinutes();
    const endHour = eventEnd.getHours();
    const endMinutes = eventEnd.getMinutes();

    const startPosition = (startHour * 60 + startMinutes) / 60; // Hours from midnight
    const duration = (endHour * 60 + endMinutes - (startHour * 60 + startMinutes)) / 60; // Duration in hours

    return {
      top: startPosition * 60, // 60px per hour
      height: Math.max(duration * 60, 30), // Minimum 30px height
    };
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Week header */}
      <div className="border-b border-gray-200 bg-white flex-shrink-0">
        <div className="grid grid-cols-8">
          {/* Time column header */}
          <div className="border-r border-gray-200"></div>

          {/* Day headers */}
          {weekDays.map((day) => {
            const isDayToday = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`p-2 flex flex-col text-center border-r border-gray-200 last:border-r-0 ${
                  isDayToday ? "bg-bg-alt" : ""
                }`}>
                <span className="text-xs sm:text-sm text-text-light uppercase">{format(day, "EEE", { locale })}</span>
                <span className={`text-sm sm:text-lg font-semibold ${isDayToday ? "text-primary" : "text-gray-900"}`}>
                  {format(day, "d")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-8 min-h-full">
            {/* Time column */}
            <div className="border-r border-gray-200">
              {timeSlots.map((slot) => (
                <div key={slot.hour} className="border-b border-gray-100 px-2 py-1" style={{ height: "60px" }}>
                  <div className="text-xs text-gray-500">{slot.time}</div>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`relative border-r border-gray-200 last:border-r-0 ${isDayToday ? "bg-success/10" : ""}`}>
                  {/* Hour grid lines */}
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.hour}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      style={{ height: "60px" }}
                    />
                  ))}

                  {/* All-day events */}
                  <div className="absolute top-0 left-0 right-0 z-10 p-1 bg-white border-b border-gray-200">
                    {dayEvents
                      .filter((event) => event.allDay)
                      .slice(0, 2)
                      .map((event) => (
                        <div key={event.id} className="mb-1">
                          <EventBlock event={event} className="w-full" />
                        </div>
                      ))}
                  </div>

                  {/* Timed events */}
                  <div className="absolute inset-0 top-16 p-1">
                    {dayEvents
                      .filter((event) => !event.allDay)
                      .map((event) => {
                        const position = getEventPosition(event);

                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 z-20"
                            style={{
                              top: `${position.top}px`,
                              height: `${position.height}px`,
                            }}>
                            <EventBlock event={event} className="w-full h-full" />
                          </div>
                        );
                      })}
                  </div>

                  {/* Current time indicator */}
                  {isDayToday && (
                    <div
                      className="absolute left-0 right-0 z-30 border-t-2 border-red-500"
                      style={{
                        top: `${((new Date().getHours() * 60 + new Date().getMinutes()) / 60) * 60 + 64}px`, // +64px for all-day section
                      }}>
                      <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
