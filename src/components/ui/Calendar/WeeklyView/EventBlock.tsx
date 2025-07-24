import type { EventInterface } from "@/data/types";
import { getTimePart } from "@/utils/helpers";

interface EventBlockProps {
  event: EventInterface;
  layout?: {
    width: number;
    left: number;
  };
  onClick: (e: React.MouseEvent, event: EventInterface) => void;
}

export default function EventBlock({ event, layout, onClick }: EventBlockProps) {
  let durationSlots = 1.5;
  let topOffset = 0;

  if (!event.allDay) {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const durationMinutes = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
    durationSlots = durationMinutes / 15; // 15 min slot height
    const minutesFromMidnight = eventStart.getHours() * 60 + eventStart.getMinutes();
    topOffset = minutesFromMidnight / 15; // 1rem = 15 min
  }

  return (
    <button
      className={`rounded-sm ${event.color} text-white px-3 py-1 text-sm shadow-sm shadow-black text-left flex flex-col justify-center pointer-events-auto cursor-pointer relative`}
      style={{
        position: `${event.allDay ? "relative" : "absolute"}`,
        top: `${topOffset}rem`,
        height: `${durationSlots}rem`,
        left: `${layout?.left ?? 0}%`,
        width: `${layout?.width ?? 100}%`,
      }}
      onClick={(e) => onClick(e, event)}>
      <span className="text-sm whitespace-nowrap">{event.title}</span>
      {!event.allDay && (
        <span className="text-xs">
          {getTimePart(event.start)} - {getTimePart(event.end)}
        </span>
      )}
    </button>
  );
}
