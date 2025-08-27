import { useState, useRef, useEffect } from "react";
import { X, Check, Clock } from "lucide-react";
import { EventInterface } from "@/data/Calendar/events";
import { useMousePosition } from "../../../../hooks/useMousePosition";

interface EventEditModalProps {
  event: EventInterface;
  onClose: () => void;
  onSave: (updatedEvent: EventInterface) => void;
  mousePosition: { x: number; y: number };
}

export default function EventEditModal({ event, onClose, onSave, mousePosition }: EventEditModalProps) {
  const [editData, setEditData] = useState({
    title: event.title,
    description: event.description || "",
    start: new Date(event.start).toISOString().slice(0, 16),
    end: new Date(event.end).toISOString().slice(0, 16),
    allDay: event.allDay,
    color: event.color,
  });

  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Sprawdź czy mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Mouse positioning hook - tylko dla desktop
  const { positionStyles } = useMousePosition({
    isOpen: true,
    mousePosition,
    modalWidth: 384, // max-w-96
    modalHeight: 600, // większy dla edit modal
  });

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editData.title.trim()) return;

    let start: Date;
    let end: Date;

    if (editData.allDay) {
      const eventDate = new Date(editData.start);
      start = new Date(eventDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(eventDate);
      end.setHours(23, 59, 59, 999);
    } else {
      start = new Date(editData.start);
      end = new Date(editData.end);
    }

    const updatedEvent: EventInterface = {
      ...event,
      title: editData.title.trim(),
      description: editData.description,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: editData.allDay,
      color: editData.color,
      updatedAt: new Date().toISOString(),
    };

    await onSave(updatedEvent);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Render form content (reused by both mobile and desktop)
  const renderFormContent = () => (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Event Title */}
      <div>
        <label className="block text-sm font-medium text-text mb-1">Event Title</label>
        <input
          ref={titleInputRef}
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text mb-1">Description (optional)</label>
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
          rows={2}
          placeholder="Add description..."
        />
      </div>

      {/* All Day Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="allDay"
          checked={editData.allDay}
          onChange={(e) => setEditData({ ...editData, allDay: e.target.checked })}
          className="rounded border-gray-300 focus:ring-primary"
        />
        <label htmlFor="allDay" className="text-sm text-text flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          All day event
        </label>
      </div>

      {/* Date/Time Fields */}
      {editData.allDay ? (
        <div>
          <label className="block text-sm font-medium text-text mb-1">Date</label>
          <input
            type="date"
            value={editData.start.split("T")[0]}
            onChange={(e) => {
              const newDate = e.target.value;
              setEditData({
                ...editData,
                start: `${newDate}T00:00`,
                end: `${newDate}T23:59`,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Start</label>
            <input
              type="datetime-local"
              value={editData.start}
              onChange={(e) => setEditData({ ...editData, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">End</label>
            <input
              type="datetime-local"
              value={editData.end}
              onChange={(e) => setEditData({ ...editData, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
            />
          </div>
        </div>
      )}
    </form>
  );

  // Mobile version - fullscreen modal
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-bg-alt rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 space-y-4" onClick={handleModalClick}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Edit Event</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="p-1 text-success hover:bg-success/10 rounded transition-colors"
                  title="Save">
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-text-light hover:bg-bg-hover rounded transition-colors"
                  title="Cancel">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile form content */}
            {renderFormContent()}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version - positioned near cursor
  return (
    <div
      className="bg-bg-alt border border-gray-200 rounded-md shadow-lg min-w-80 z-50 max-w-96"
      style={{
        position: "fixed",
        ...positionStyles,
      }}
      onClick={handleModalClick}
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Edit Event</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="p-1 text-success hover:bg-success/10 rounded transition-colors"
              title="Save">
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-text-light hover:bg-bg-hover rounded transition-colors"
              title="Cancel">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop form content */}
        {renderFormContent()}
      </div>
    </div>
  );
}
