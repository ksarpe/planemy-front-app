import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { differenceInMinutes, format, getMinutes, isPast, isValid } from "date-fns";
import { useMemo } from "react";

import type { CalendarEvent } from "@/components/shadcn/types";
import { getBorderRadiusClasses, getEventColorClasses } from "@/components/shadcn/utils";
import { cn } from "@/lib/shadcn/utils";
import { LabelInterface } from "@shared/data/Utils";
import { useLabelContext } from "@shared/hooks/context/useLabelContext";

// Safe date formatting with error handling
const formatTimeWithOptionalMinutes = (date: Date | string | number) => {
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) {
      console.warn("Invalid date provided to formatTimeWithOptionalMinutes:", date);
      return "Invalid time";
    }
    return format(dateObj, getMinutes(dateObj) === 0 ? "ha" : "h:mma").toLowerCase();
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid time";
  }
};

// Safe date creation helper
const createSafeDate = (date: Date | string | number): Date => {
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) {
      console.warn("Invalid date provided:", date);
      return new Date(); // Fallback to current date
    }
    return dateObj;
  } catch (error) {
    console.error("Error creating date:", error);
    return new Date(); // Fallback to current date
  }
};

interface EventWrapperProps {
  event: CalendarEvent;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  currentTime?: Date;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  labelColor?: string;
}

function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
  labelColor,
}: EventWrapperProps) {
  // Safe date calculation with error handling
  const displayEnd = useMemo(() => {
    try {
      if (currentTime) {
        const eventStart = createSafeDate(event.start);
        const eventEnd = createSafeDate(event.end);
        const duration = eventEnd.getTime() - eventStart.getTime();
        return new Date(currentTime.getTime() + duration);
      }
      return createSafeDate(event.end);
    } catch (error) {
      console.error("Error calculating display end:", error);
      return new Date();
    }
  }, [currentTime, event.start, event.end]);

  const isEventInPast = useMemo(() => {
    try {
      return isPast(displayEnd);
    } catch (error) {
      console.error("Error checking if event is in past:", error);
      return false;
    }
  }, [displayEnd]);

  return (
    <button
      className={cn(
        // Base styles using theme colors
        "flex size-full overflow-hidden px-1 text-left font-medium transition outline-none select-none focus-visible:ring-[3px]",
        // Dragging state
        isDragging && "cursor-grabbing shadow-lg scale-105 z-50",
        // Past event state
        isEventInPast && "line-through opacity-60",
        // Responsive padding
        "sm:px-2",
        getEventColorClasses(labelColor || event.color),
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className,
      )}
      style={
        {
          color: "var(--color-text)",
          "--tw-ring-color": "var(--color-primary)",
        } as React.CSSProperties
      }
      data-dragging={isDragging || undefined}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}>
      {children}
    </button>
  );
}

interface EventItemProps {
  event: CalendarEvent;
  view: "month" | "week" | "day" | "agenda";
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  currentTime?: Date; // For updating time during drag
  isFirstDay?: boolean;
  isLastDay?: boolean;
  children?: React.ReactNode;
  className?: string;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

export function EventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  const { getLabelForObject } = useLabelContext();

  // Get labels for the current event
  const eventLabel: LabelInterface | undefined = (() => {
    try {
      return getLabelForObject("event", event.id);
    } catch (error) {
      console.error("Error getting labels for event:", error);
      return undefined;
    }
  })();

  // Use the provided currentTime (for dragging) or the event's actual time
  const displayStart = useMemo(() => {
    return currentTime || createSafeDate(event?.start || new Date());
  }, [currentTime, event?.start]);

  const displayEnd = useMemo(() => {
    try {
      if (currentTime && event?.start && event?.end) {
        const eventStart = createSafeDate(event.start);
        const eventEnd = createSafeDate(event.end);
        const duration = eventEnd.getTime() - eventStart.getTime();
        return new Date(currentTime.getTime() + duration);
      }
      return createSafeDate(event?.end || new Date());
    } catch (error) {
      console.error("Error calculating display end:", error);
      return new Date();
    }
  }, [currentTime, event?.start, event?.end]);

  // Calculate event duration in minutes
  const durationMinutes = useMemo(() => {
    try {
      return Math.max(0, differenceInMinutes(displayEnd, displayStart));
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 60; // Default to 1 hour
    }
  }, [displayStart, displayEnd]);

  // Safe event data validation - after hooks
  if (!event?.id || !event?.title) {
    console.warn("Invalid event data provided to EventItem:", event);
    return null;
  }

  const getEventTime = () => {
    if (event.allDay) return "All day";

    try {
      // For short events (less than 45 minutes), only show start time
      if (durationMinutes < 45) {
        return formatTimeWithOptionalMinutes(displayStart);
      }

      // For longer events, show both start and end time
      return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`;
    } catch (error) {
      console.error("Error getting event time:", error);
      return "Time unavailable";
    }
  };

  if (view === "month") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn("mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-xs", className)}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        labelColor={eventLabel?.color}>
        {children || (
          <span className="truncate">
            {!event.allDay && (
              <span className="truncate font-normal opacity-70 sm:text-[11px]">
                {formatTimeWithOptionalMinutes(displayStart)}{" "}
              </span>
            )}
            {event.title}
          </span>
        )}
      </EventWrapper>
    );
  }

  if (view === "week" || view === "day") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          "py-1",
          durationMinutes < 45 ? "items-center" : "flex-col",
          view === "week" ? "text-[10px] sm:text-xs" : "text-xs",
          className,
        )}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}>
        {durationMinutes < 45 ? (
          <div className="truncate">
            {event.title}{" "}
            {showTime && <span className="opacity-70">{formatTimeWithOptionalMinutes(displayStart)}</span>}
          </div>
        ) : (
          <>
            <div className="truncate font-medium">{event.title}</div>
            {showTime && <div className="truncate font-normal opacity-70 sm:text-[11px]">{getEventTime()}</div>}
          </>
        )}
      </EventWrapper>
    );
  }

  // Agenda view - kept separate since it's significantly different
  return (
    <button
      className={cn(
        "flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:ring-[3px] data-past-event:line-through data-past-event:opacity-90",
        getEventColorClasses(event.color),
        className,
      )}
      style={
        {
          color: "var(--color-text)",
          "--tw-ring-color": "var(--color-primary)",
          borderColor: "var(--color-primary)",
        } as React.CSSProperties
      }
      data-past-event={isPast(new Date(event.end)) || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}>
      <div className="text-sm font-medium">{event.title}</div>
      <div className="text-xs opacity-70">
        {event.allDay ? (
          <span>All day</span>
        ) : (
          <span className="uppercase">
            {formatTimeWithOptionalMinutes(displayStart)} - {formatTimeWithOptionalMinutes(displayEnd)}
          </span>
        )}
        {event.location && (
          <>
            <span className="px-1 opacity-35"> · </span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      {event.description && <div className="my-1 text-xs opacity-90">{event.description}</div>}
    </button>
  );
}
