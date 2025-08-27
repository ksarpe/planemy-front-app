import { Edit2, Clock, X } from "lucide-react";
import { EventInterface } from "@/data/Calendar/events";
import { useElementPosition } from "@/hooks/useElementPosition";

interface EventDetailsModalProps {
  event: EventInterface;
  onClose: () => void;
  onEdit: (elementPosition: { x: number; y: number }) => void;
  elementPosition: { x: number; y: number };
}

export default function EventDetailsModal({ event, onClose, onEdit, elementPosition }: EventDetailsModalProps) {
  // Mouse positioning hook - pozycjonuje blisko kursora
  const { positionStyles } = useElementPosition({
    isOpen: true,
    elementPosition,
    modalWidth: 300, // min-w-72 ≈ 288px + padding
    modalHeight: 150, // mniejszy dla details modal
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

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Przekaż pozycję kursora z kliknięcia przycisku Edit
    onEdit({ x: e.clientX, y: e.clientY });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="bg-bg-alt border border-gray-200 rounded-md shadow-lg min-w-72 z-50 max-w-80"
      style={{
        position: "fixed",
        ...positionStyles,
      }}>
      <div className="p-4" onClick={handleModalClick}>
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
