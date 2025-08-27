import { useState, useRef, useEffect } from "react";
import { EventInterface } from "@/data/Calendar/events";
import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import { Clock } from "lucide-react";
import EventEditModal from "./EventEditModal";
import EventDetailsModal from "./EventDetailsModal";

interface EventBlockProps {
  event: EventInterface;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
}

export default function EventBlock({ event, style, className = "", onClick, showTime = true }: EventBlockProps) {
  const { updateEvent } = useCalendarContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const editRef = useRef<HTMLDivElement>(null);
  const eventBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(e.target as Node)) {
        setIsEditing(false);
        setShowDetails(false);
      }
    };

    if (isEditing || showDetails) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isEditing, showDetails]);

  const handleSave = async (updatedEvent: EventInterface) => {
    await updateEvent(updatedEvent);
    setIsEditing(false);
  };

  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Zapisz pozycję kursora dla obu modali
    setMousePosition({ x: e.clientX, y: e.clientY });

    if (onClick) {
      onClick(e);
    } else if (!isEditing) {
      setShowDetails(!showDetails);
    }
  };

  const getEventColor = () => {
    // Use event color if available, otherwise fallback to primary color
    if (event.color && event.color.startsWith("#")) {
      return { backgroundColor: event.color };
    }

    // Map our color system to CSS variables
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
        return { backgroundColor: "var(--color-primary)" };
    }
  };

  const getTimeString = () => {
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
    <div className="relative" ref={editRef}>
      {/* Main event block */}
      <div
        ref={eventBlockRef}
        className={`text-white rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${className}`}
        style={{ ...style, ...getEventColor(), borderLeftColor: getEventColor().backgroundColor }}
        onClick={handleEventClick}>
        <div className="p-0.5 sm:p-1">
          <div className="text-[10px] sm:text-sm truncate flex items-center space-x-1">
            <span>{event.title}</span>
          </div>
          {showTime && !event.allDay && (
            <div className="text-white/80 text-xs mt-1 flex items-center">
              <Clock className="inline h-3 w-3 mr-1" />
              {getTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isEditing && (
        <EventEditModal
          event={event}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          elementPosition={mousePosition}
        />
      )}

      {showDetails && !isEditing && (
        <EventDetailsModal
          event={event}
          onClose={() => setShowDetails(false)}
          onEdit={(newMousePosition) => {
            setMousePosition(newMousePosition);
            setShowDetails(false);
            setIsEditing(true);
          }}
          elementPosition={mousePosition}
        />
      )}
    </div>
  );
}
