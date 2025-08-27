import React, { useMemo, useState } from "react";
import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import EventBlock from "./Event/EventBlock";
import QuickEventCreator from "./QuickEventCreator";
import PreviewEventBlock from "./PreviewEventBlock";
import { EventInterface } from "@/data/Calendar/events";

export default function MonthView() {
  const { currentDate, events } = useCalendarContext();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showQuickCreator, setShowQuickCreator] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Preview event state
  const [previewEvent, setPreviewEvent] = useState<Partial<EventInterface>>({});
  const [selectedDayRect, setSelectedDayRect] = useState<DOMRect | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weeks = useMemo(() => {
    const weeksArray = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeksArray.push(calendarDays.slice(i, i + 7));
    }
    return weeksArray;
  }, [calendarDays]);

  // Dynamically calculate grid rows based on actual number of weeks
  const numberOfWeeks = weeks.length;
  const gridTemplateRows = `repeat(${numberOfWeeks}, 1fr)`;

  // Mobile detection and responsive handling
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle day tile click
  const handleDayClick = (day: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedDate(day);

    // Zapisz rect klikniętego dnia dla preview
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedDayRect(rect);

    if (isMobile) {
      setShowQuickCreator(true);
    } else {
      // Calculate smart popup position
      const modalWidth = 384; // max-w-sm ≈ 384px
      const modalHeight = 400; // estimated height
      const offset = 8;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate available space
      const spaceBelow = viewportHeight - rect.bottom;

      let x = rect.left + rect.width / 2; // center horizontally on day
      let y = rect.bottom + offset; // below by default

      // Adjust horizontal position if modal would overflow
      if (x + modalWidth / 2 > viewportWidth - offset) {
        x = viewportWidth - modalWidth / 2 - offset;
      }
      if (x - modalWidth / 2 < offset) {
        x = modalWidth / 2 + offset;
      }

      // Adjust vertical position if modal would overflow
      if (spaceBelow < modalHeight + offset) {
        // Try above
        if (rect.top > modalHeight + offset) {
          y = rect.top - modalHeight - offset;
        } else {
          // Center vertically if neither works
          y = Math.max(offset, (viewportHeight - modalHeight) / 2);
        }
      }

      setPopupPosition({ x, y });
      setShowQuickCreator(true);
    }
  };

  // Close quick creator
  const closeQuickCreator = () => {
    setShowQuickCreator(false);
    setSelectedDate(null);
    setPopupPosition({ x: 0, y: 0 });

    // Wyczyść preview
    setPreviewEvent({});
    setSelectedDayRect(null);
  };

  // Handler dla zmiany danych preview
  const handlePreviewChange = (newPreviewEvent: Partial<EventInterface>) => {
    setPreviewEvent(newPreviewEvent);
  };

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

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Week header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-bg-alt">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid" style={{ gridTemplateRows }}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0">
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={dayIndex}
                  className={`relative border-r border-gray-200 last:border-r-0 h-full ${
                    !isCurrentMonth ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-50 transition-colors flex flex-col cursor-pointer`}
                  onClick={(e) => handleDayClick(day, e)}>
                  {/* Day number */}
                  <div className="text-center flex-shrink-0">
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 text-xs sm:text-sm font-medium rounded-full ${
                        isDayToday
                          ? "bg-primary text-white"
                          : isCurrentMonth
                          ? "text-gray-900 hover:bg-blue-50"
                          : "text-gray-400"
                      }`}>
                      {format(day, "d")}
                    </div>
                  </div>

                  {/* Events */}
                  <div className="sm:px-1 space-y-1 flex-1">
                    {/* Standard events */}
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <EventBlock key={`${event.id}-${eventIndex}`} event={event} className="w-full" showTime={false} />
                    ))}

                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 pl-2 py-1">+{dayEvents.length - 3} more</div>
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
                          handleDayClick(day, e);
                        }}>
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

      {/* QuickEventCreator */}
      {showQuickCreator && selectedDate && (
        <>
          {isMobile ? (
            /* Mobile: Full screen modal */
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
                <QuickEventCreator
                  selectedDate={selectedDate}
                  onClose={closeQuickCreator}
                  onPreviewChange={handlePreviewChange}
                />
              </div>
            </div>
          ) : (
            /* Desktop: Popup positioned near clicked day */
            <div
              className="fixed z-50"
              style={{
                left: `${popupPosition.x}px`,
                top: `${popupPosition.y}px`,
                transform: "translateX(-50%)",
              }}>
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm">
                <QuickEventCreator
                  selectedDate={selectedDate}
                  onClose={closeQuickCreator}
                  onPreviewChange={handlePreviewChange}
                />
              </div>
            </div>
          )}

          {/* Overlay to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={closeQuickCreator} />
        </>
      )}

      {/* Preview Event Block - pokazuje się w tle podczas tworzenia eventu */}
      {showQuickCreator && selectedDayRect && previewEvent.title && (
        <PreviewEventBlock event={previewEvent} dayRect={selectedDayRect} />
      )}
    </div>
  );
}
