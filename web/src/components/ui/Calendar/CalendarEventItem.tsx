import React from "react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { EventItem } from "@/components/shadcn/event-item";
import type { CalendarEvent, EventColor } from "@/components/shadcn/types";
import type { EventInterface } from "@shared/data/Calendar/events";

// Bridge component to convert EventInterface to CalendarEvent
interface CalendarEventItemProps {
  event: EventInterface;
  view: "month" | "week" | "day" | "agenda";
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  currentTime?: Date;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  className?: string;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
}

/**
 * Convert EventInterface color to shadcn EventColor
 */
const convertEventColor = (color?: string): EventColor => {
  if (!color) return "sky";

  // Map theme colors to shadcn colors
  const colorMap: Record<string, EventColor> = {
    primary: "sky",
    success: "emerald",
    negative: "rose",
    text: "violet",
    "text-light": "amber",
    "bg-hover": "orange",
    custom: "sky",
  };

  return colorMap[color] || "sky";
};

/**
 * Bridge component that converts EventInterface to CalendarEvent format
 * and renders using the shadcn EventItem component
 */
export function CalendarEventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime = true,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: CalendarEventItemProps) {
  // Convert EventInterface to CalendarEvent format
  const calendarEvent: CalendarEvent = {
    id: event.id,
    title: event.title || "Untitled Event",
    description: event.description || "",
    start: new Date(event.starts_at),
    end: new Date(event.ends_at),
    allDay: false, // EventInterface doesn't have allDay field, defaulting to false
    color: convertEventColor("primary"), // Default to primary color
    location: "", // EventInterface doesn't have location field
  };

  return (
    <EventItem
      event={calendarEvent}
      view={view}
      isDragging={isDragging}
      onClick={onClick}
      showTime={showTime}
      currentTime={currentTime}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
      className={className}
      dndListeners={dndListeners}
      dndAttributes={dndAttributes}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />
  );
}
