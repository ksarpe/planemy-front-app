import type { CalendarEvent } from "@/components/shadcn/types";
import { Badge } from "@/components/ui/Common/Badge";
import { cn } from "@/lib/shadcn/utils";
import { LabelInterface } from "@shared/data/Utils";
import { useLabelContext } from "@shared/hooks/context/useLabelContext";
import { format, getMinutes, isValid } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Edit, MapPin, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface EventTooltipProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  anchorElement: HTMLElement | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const formatTimeWithOptionalMinutes = (date: Date | string | number) => {
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return "Invalid time";
    return format(dateObj, getMinutes(dateObj) === 0 ? "ha" : "h:mma").toLowerCase();
  } catch {
    return "Invalid time";
  }
};

const formatFullDate = (date: Date | string | number) => {
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return "Invalid date";
    return format(dateObj, "EEEE, MMMM d, yyyy");
  } catch {
    return "Invalid date";
  }
};

export function EventTooltip({
  event,
  isOpen,
  onClose,
  onDelete,
  onEdit,
  anchorElement,
  onMouseEnter,
  onMouseLeave,
}: EventTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { getLabelForObject } = useLabelContext();

  // Get label for event
  const eventLabel: LabelInterface | undefined = (() => {
    try {
      return getLabelForObject("event", event.id);
    } catch {
      return undefined;
    }
  })();

  // Calculate position based on anchor element
  useEffect(() => {
    if (!isOpen || !anchorElement || !tooltipRef.current) return;

    const updatePosition = () => {
      const anchorRect = anchorElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = anchorRect.bottom + 8; // 8px gap below anchor
      let left = anchorRect.left;

      // If tooltip would go off right edge, align to right side of anchor
      if (left + tooltipRect.width > viewportWidth - 16) {
        left = anchorRect.right - tooltipRect.width;
      }

      // If tooltip would go off left edge, align to left viewport edge
      if (left < 16) {
        left = 16;
      }

      // If tooltip would go off bottom, show above anchor instead
      if (top + tooltipRect.height > viewportHeight - 16) {
        top = anchorRect.top - tooltipRect.height - 8;
      }

      // If still off top, clamp to top of viewport
      if (top < 16) {
        top = 16;
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, anchorElement]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        anchorElement &&
        !anchorElement.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    // Delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorElement]);

  if (!isOpen) return null;

  const tooltipContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            zIndex: 9999,
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="w-80 bg-bg rounded-xl shadow-2xl border border-bg-muted-light overflow-hidden">
          {/* Header with color accent */}
          <div
            className={cn("h-1.5")}
            style={{
              backgroundColor: eventLabel?.color || event.color || "var(--color-primary)",
            }}
          />

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title and close button */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-text leading-tight flex-1">{event.title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-bg-muted-light transition-colors text-text-muted hover:text-text flex-shrink-0">
                <X size={18} />
              </button>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3 text-sm">
              <Clock size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-text font-medium">{formatFullDate(event.start)}</div>
                {event.allDay ? (
                  <div className="text-text-muted">All day</div>
                ) : (
                  <div className="text-text-muted">
                    {formatTimeWithOptionalMinutes(event.start)} - {formatTimeWithOptionalMinutes(event.end)}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
                <div className="text-text-muted flex-1">{event.location}</div>
              </div>
            )}

            {/* Labels */}
            {eventLabel && (
              <div className="flex items-center gap-2">
                <Badge variant={eventLabel.color}>{eventLabel.label_name}</Badge>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="pt-2 border-t border-bg-muted-light">
                <p className="text-sm text-text-muted leading-relaxed line-clamp-4">{event.description}</p>
              </div>
            )}
          </div>

          {/* Actions footer */}
          <div className="px-4 py-3 bg-bg-alt border-t border-bg-muted-light flex items-center gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  onClose();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-text bg-bg hover:bg-bg-muted-light transition-colors">
                <Edit size={14} />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  onClose();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-negative hover:bg-negative/10 transition-colors ml-auto">
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(tooltipContent, document.body);
}
