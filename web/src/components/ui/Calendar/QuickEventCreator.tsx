import { useState, useEffect } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { useCreateEvent } from "@shared/hooks/events";
import { format } from "date-fns";
import type { QuickEventCreatorProps } from "@shared/data/Calendar/Components/CalendarComponentInterfaces";

export default function QuickEventCreator({
  selectedDate,
  onClose,
  onPreviewChange,
  className = "",
}: QuickEventCreatorProps) {
  const { mutateAsync: createEvent, isPending: isCreating } = useCreateEvent();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(
    selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [allDay, setAllDay] = useState(false);

  // Przekazuj dane preview do rodzica za każdym razem gdy się zmieniają
  useEffect(() => {
    if (!onPreviewChange) return;

    try {
      const eventDate = new Date(date);
      let start: Date;
      let end: Date;

      if (allDay) {
        start = new Date(eventDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(eventDate);
        end.setHours(23, 59, 59, 999);
      } else {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        start = new Date(eventDate);
        start.setHours(startHour, startMinute, 0, 0);

        end = new Date(eventDate);
        end.setHours(endHour, endMinute, 0, 0);
      }

      const previewEvent = {
        title: title.trim() || "New Event",
        start: start.toISOString(),
        end: end.toISOString(),
        allDay,
        category: "Personal" as const,
        color: "#3b82f6",
      };

      onPreviewChange(previewEvent);
    } catch {
      // Jeśli date jest invalid, wyczyść preview
      onPreviewChange({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, date, startTime, endTime, allDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const eventDate = new Date(date);

      let start: Date;
      let end: Date;

      if (allDay) {
        start = new Date(eventDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(eventDate);
        end.setHours(23, 59, 59, 999);
      } else {
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        start = new Date(eventDate);
        start.setHours(startHour, startMinute, 0, 0);

        end = new Date(eventDate);
        end.setHours(endHour, endMinute, 0, 0);
      }

      const newEvent = {
        title: title.trim(),
        start: start.toISOString(),
        end: end.toISOString(),
        allDay,
        category: "Personal" as const,
        displayType: "block" as const,
        color: "#3b82f6",
        isRecurring: false,
        isPrivate: false,
        visibility: "private" as const,
      };

      await createEvent(newEvent);
      onClose?.();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className={`p-4 ${className} min-w-[320px] min-h-[200px]`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Create Event</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoFocus
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center">
          <input
            id="allDay"
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="allDay" className="ml-2 block text-sm text-gray-700">
            All day event
          </label>
        </div>

        {/* Time Fields (only if not all day) */}
        {!allDay && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || isCreating}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isCreating ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
