import { EventInterface } from "@/data/Calendar/events";
import { Clock } from "lucide-react";

interface PreviewEventBlockInlineProps {
  event: Partial<EventInterface>;
  showTime?: boolean;
  className?: string;
}

export default function PreviewEventBlockInline({
  event,
  showTime = false,
  className = "",
}: PreviewEventBlockInlineProps) {
  const getEventColor = () => {
    if (event.color && event.color.startsWith("#")) {
      return { backgroundColor: event.color };
    }

    switch (event.color) {
      case "primary":
        return { backgroundColor: "var(--color-primary)" };
      case "success":
        return { backgroundColor: "var(--color-success)" };
      case "negative":
        return { backgroundColor: "var(--color-negative)" };
      case "bg-hover":
        return { backgroundColor: "var(--color-bg-hover)" };
      default:
        return { backgroundColor: "#3b82f6" }; // default blue
    }
  };

  const getTimeString = () => {
    if (!event.start || !event.end) return "";

    const start = new Date(event.start);
    const end = new Date(event.end);

    if (event.allDay) {
      return "All day";
    }

    return `${start.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString("en", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  };

  return (
    <div
      className={`text-white rounded-md shadow-md hover:shadow-md transition-all border-l-4 border-dashed animate-pulse ${className}`}
      style={{
        ...getEventColor(),
        borderLeftColor: getEventColor().backgroundColor,
        opacity: 0.7,
      }}>
      <div className="p-0.5 sm:p-1">
        <div className="text-[10px] sm:text-sm truncate flex items-center space-x-1">
          <span>{event.title || "New Event"}</span>
        </div>
        {showTime && !event.allDay && event.start && event.end && (
          <div className="text-white/80 text-xs mt-1 flex items-center">
            <Clock className="inline h-3 w-3 mr-1" />
            {getTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
