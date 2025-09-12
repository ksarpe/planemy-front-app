import { Edit2, Clock, X } from "lucide-react";
import { useElementPosition } from "@shared/hooks/utils/useElementPosition";
import type { EventDetailsModalProps } from "@shared/data/Calendar/Components/CalendarComponentInterfaces";

export default function EventDetailsModal({ event, onClose, onEdit, elementPosition }: EventDetailsModalProps) {
  // Mouse positioning hook - pozycjonuje blisko kursora
  const { positionStyles } = useElementPosition({
    isOpen: true,
    elementPosition,
    modalWidth: 288, // min-w-72 ≈ 288px + padding
    modalHeight: 100, // mniejszy dla details modal
  });

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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="bg-bg-alt border border-gray-200 rounded-md shadow-lg w-72 z-50"
      style={{
        position: "fixed",
        ...positionStyles,
      }}>
      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-text text-lg mb-2">{event.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-1 text-text-light hover:bg-bg-hover rounded transition-colors"
              title="Edit">
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-1 text-text-light hover:bg-bg-hover rounded transition-colors"
              title="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {event.description && (
          <div className="mb-3">
            <p className="text-sm text-text-light">{event.description}</p>
          </div>
        )}

        <div className="space-y-2 text-sm text-text-light">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{getTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
