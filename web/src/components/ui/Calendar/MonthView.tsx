import React, { useMemo, useState, useEffect } from "react";
import { useCalendarContext } from "@shared/hooks/context/useCalendarContext";
import { useElementPosition } from "@shared/hooks/useElementPosition";
import { useT } from "@shared/hooks/useT";
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
import PreviewEventBlockInline from "./PreviewEventBlockInline";
import { EventInterface } from "@shared/data/Calendar/events";

export default function MonthView() {
  const { currentDate, events } = useCalendarContext();
  const { t } = useT();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showQuickCreator, setShowQuickCreator] = useState(false);
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Preview event state
  const [previewEvent, setPreviewEvent] = useState<Partial<EventInterface>>({});
  // Use element position hook
  const { positionStyles } = useElementPosition({
    isOpen: showQuickCreator && !isMobile,
    elementPosition,
    modalWidth: 320,
    modalHeight: 400,
    offset: 8,
  });

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
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle day tile click
  const handleDayClick = (day: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedDate(day);

    if (isMobile) {
      setShowQuickCreator(true);
    } else {
      // Get position from the clicked day cell directly
      const dayCell = event.currentTarget as HTMLDivElement;
      const dayRect = dayCell.getBoundingClientRect();

      setElementPosition({
        x: dayRect.left,
        y: dayRect.top,
        width: dayRect.width,
        height: dayRect.height,
      });

      setShowQuickCreator(true);
    }
  };

  // Close quick creator
  const closeQuickCreator = () => {
    setShowQuickCreator(false);
    setSelectedDate(null);
    setElementPosition({ x: 0, y: 0, width: 0, height: 0 });
    setPreviewEvent({});
  };

  // Handler dla zmiany danych preview
  const handlePreviewChange = (newPreviewEvent: Partial<EventInterface>) => {
    setPreviewEvent(newPreviewEvent);
  };

  const getEventsForDay = (day: Date): EventInterface[] => {
    const dayEvents = events.filter((event) => {
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

    return dayEvents;
  };

  // Funkcja do uzyskania eventów z preview eventem wstawionym w odpowiednie miejsce
  const getEventsForDayWithPreview = (
    day: Date,
  ): (EventInterface | { isPreview: true; event: Partial<EventInterface> })[] => {
    const dayEvents = getEventsForDay(day);

    // Sprawdź czy to dzień dla którego pokazujemy preview
    const isPreviewDay = selectedDate && isSameDay(day, selectedDate);
    if (!isPreviewDay || !previewEvent.title) {
      return dayEvents;
    }

    // Dodaj preview event na początek, nie sortuj regularnych eventów
    const previewItem = { isPreview: true as const, event: previewEvent };
    return [previewItem, ...dayEvents];
  };

  const weekDays = [
    t("calendar.weekdays.short.monday"),
    t("calendar.weekdays.short.tuesday"),
    t("calendar.weekdays.short.wednesday"),
    t("calendar.weekdays.short.thursday"),
    t("calendar.weekdays.short.friday"),
    t("calendar.weekdays.short.saturday"),
    t("calendar.weekdays.short.sunday"),
  ];

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
              const dayEventsWithPreview = getEventsForDayWithPreview(day);
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
                    {/* Preview event (always first if exists) */}
                    {(() => {
                      const previewItem = dayEventsWithPreview.find((item) => "isPreview" in item && item.isPreview);
                      if (previewItem && "isPreview" in previewItem && previewItem.isPreview) {
                        return (
                          <div>
                            <PreviewEventBlockInline event={previewItem.event} className="w-full" showTime={false} />
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Regular events */}
                    {(() => {
                      const regularEvents = dayEventsWithPreview.filter((eventItem) => !("isPreview" in eventItem));
                      const hasPreview = dayEventsWithPreview.some((item) => "isPreview" in item && item.isPreview);

                      // Jeśli jest preview, pokaż mniej regularnych eventów aby nie rozszerzać kafelka
                      const maxRegularEvents = hasPreview ? 2 : 3;

                      return regularEvents.slice(0, maxRegularEvents).map((eventItem, eventIndex) => {
                        const event = eventItem as EventInterface;
                        return (
                          <EventBlock
                            key={`${event.id}-${eventIndex}`}
                            event={event}
                            className="w-full"
                            showTime={false}
                          />
                        );
                      });
                    })()}

                    {/* Show "more" indicator */}
                    {(() => {
                      const regularEventsCount = dayEventsWithPreview.filter((item) => !("isPreview" in item)).length;
                      const hasPreview = dayEventsWithPreview.some((item) => "isPreview" in item && item.isPreview);

                      // Jeśli jest preview, pokazujemy 1 preview + 1 regular, więc remaining = regularEventsCount - 1
                      // Jeśli nie ma preview, pokazujemy 2 regular, więc remaining = regularEventsCount - 2
                      const maxRegularEvents = hasPreview ? 2 : 3;
                      const shownRegularEvents = Math.min(regularEventsCount, maxRegularEvents);
                      const remainingEvents = regularEventsCount - shownRegularEvents;

                      if (remainingEvents > 0) {
                        return <div className="text-xs text-gray-500 pl-2 py-1">+{remainingEvents} more</div>;
                      }
                      return null;
                    })()}
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
            <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
                <QuickEventCreator
                  selectedDate={selectedDate}
                  onClose={closeQuickCreator}
                  onPreviewChange={handlePreviewChange}
                />
              </div>
            </div>
          ) : (
            /* Desktop: Popup positioned using useElementPosition - only render when position is ready */
            positionStyles.left !== undefined &&
            positionStyles.top !== undefined && (
              <div
                className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm transition-opacity duration-150 opacity-100"
                style={positionStyles}>
                <QuickEventCreator
                  selectedDate={selectedDate}
                  onClose={closeQuickCreator}
                  onPreviewChange={handlePreviewChange}
                />
              </div>
            )
          )}

          {/* Overlay to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={closeQuickCreator} />
        </>
      )}
    </div>
  );
}
