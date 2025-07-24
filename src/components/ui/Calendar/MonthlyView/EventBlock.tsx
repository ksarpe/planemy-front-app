import { useCalendarContext } from "@/context/CalendarContext";
import { EventInterface } from "@/data/types";

interface EventBlockProps {
  event: { data: EventInterface; top: number };
  skipLeftPadding?: boolean; // Optional prop to handle left padding
}

export default function EventBlock({ event, skipLeftPadding = false }: EventBlockProps) {
  const { setCalendarClickContent, setModalPosition } = useCalendarContext();

  const openEventModal = (e: React.MouseEvent, event: EventInterface) => {
    e.stopPropagation();
    setCalendarClickContent({ type: "event", data: event });
    setModalPosition({ top: e.clientY + 10, left: e.clientX + 10 });
  };
  return (
    <div
      onClick={(e) => openEventModal(e, event.data)}
      className={`absolute z-1 ${skipLeftPadding ? `rounded-r-sm` : `rounded-sm`} px-2 mt-2 flex cursor-pointer h-6 items-center ${event.data.color}`}
      style={{
        top: event.top,
        width: `calc(${(event.data.colSpan ?? 1) * 100}% - 20px)`,
        left: !skipLeftPadding ? "5px" : undefined,
      }}>
      <span className="text-white text-xs">{event.data.title}</span>
    </div>
  );
}
