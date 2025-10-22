import { useMemo } from "react";
import { RiCalendarEventLine } from "@remixicon/react";
import { addDays, format, isToday } from "date-fns";

import { AgendaDaysToShow } from "@/components/shadcn/constants";
import { EventItem } from "@/components/shadcn/Calendar/event-item";
import { getAgendaEventsForDay } from "@/components/shadcn/utils";
import type { CalendarEvent } from "@/components/shadcn/types";

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
}

export function AgendaView({ currentDate, events, onEventSelect }: AgendaViewProps) {
  // Show events for the next days based on constant
  const days = useMemo(() => {
    console.log("Agenda view updating with date:", currentDate.toISOString());
    return Array.from({ length: AgendaDaysToShow }, (_, i) => addDays(new Date(currentDate), i));
  }, [currentDate]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Agenda view event clicked:", event);
    onEventSelect(event);
  };

  // Check if there are any days with events
  const hasEvents = days.some((day) => getAgendaEventsForDay(events, day).length > 0);

  return (
    <div className="flex-1 px-4 overflow-y-auto bg-bg rounded-tl-xl">
      {!hasEvents ? (
        <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
          <RiCalendarEventLine size={32} className="mb-2" style={{ color: "var(--color-text-muted-more)" }} />
          <h3 className="text-lg font-medium" style={{ color: "var(--color-text)" }}>
            No events found
          </h3>
          <p style={{ color: "var(--color-text-muted)" }}>There are no events scheduled for this time period.</p>
        </div>
      ) : (
        days.map((day) => {
          const dayEvents = getAgendaEventsForDay(events, day);

          if (dayEvents.length === 0) return null;

          return (
            <div
              key={day.toString()}
              className="relative my-12 border-t bg-bg"
              style={{ borderColor: "var(--color-text-muted-more)" }}>
              <span
                className="absolute -top-3 left-0 flex h-6 items-center pe-4 text-[10px] uppercase data-today:font-medium sm:pe-4 sm:text-xs"
                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                data-today={isToday(day) || undefined}>
                {format(day, "d MMM, EEEE")}
              </span>
              <div className="mt-6 space-y-2">
                {dayEvents.map((event: CalendarEvent) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    view="agenda"
                    onClick={(e: React.MouseEvent) => handleEventClick(event, e)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
