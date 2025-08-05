import { useState, useRef, useEffect } from "react";
import { X, Calendar, Clock, Tag, Check, Eye } from "lucide-react";
import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import { EventInterface } from "../../../data/types";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

export default function CreateEventModal({ isOpen, onClose, selectedDate }: CreateEventModalProps) {
  const { addEvent } = useCalendarContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [eventData, setEventData] = useState({
    title: "",
    start: "",
    end: "",
    category: "Other" as EventInterface["category"],
    allDay: false,
  });

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const defaultDate = selectedDate || now;

      // Set default start time to current hour or next hour
      const startTime = new Date(defaultDate);
      startTime.setMinutes(0, 0, 0);
      if (selectedDate) {
        startTime.setHours(9); // Default to 9 AM for selected dates
      }

      // Set default end time to 1 hour later
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      setEventData({
        title: "",
        start: startTime.toISOString().slice(0, 16),
        end: endTime.toISOString().slice(0, 16),
        category: "Other",
        allDay: false,
      });

      // Focus title input after a short delay to ensure modal is rendered
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, selectedDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventData.title.trim()) {
      titleInputRef.current?.focus();
      return;
    }

    const newEvent: Omit<EventInterface, "id"> = {
      title: eventData.title.trim(),
      start: eventData.allDay ? new Date(eventData.start).toISOString().split("T")[0] : eventData.start,
      end: eventData.allDay ? new Date(eventData.end).toISOString().split("T")[0] : eventData.end,
      category: eventData.category,
      allDay: eventData.allDay,
      color: getCategoryColor(eventData.category),
      isRecurring: false,
      isPrivate: false,
      visibility: "private",
      userId: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addEvent(newEvent);
    onClose();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Important: "bg-red-400",
      Meeting: "bg-blue-400",
      Holiday: "bg-green-400",
      Other: "bg-purple-400",
      Test: "bg-yellow-400",
    };
    return colors[category as keyof typeof colors] || "bg-gray-400";
  };

  const handleAllDayToggle = (checked: boolean) => {
    setEventData((prev) => {
      if (checked) {
        // Convert to all-day format
        const startDate = new Date(prev.start).toISOString().split("T")[0];
        const endDate = new Date(prev.end).toISOString().split("T")[0];
        return {
          ...prev,
          allDay: true,
          start: startDate,
          end: endDate,
        };
      } else {
        // Convert to timed format
        const startTime = new Date(prev.start + "T09:00");
        const endTime = new Date(prev.end + "T10:00");
        return {
          ...prev,
          allDay: false,
          start: startTime.toISOString().slice(0, 16),
          end: endTime.toISOString().slice(0, 16),
        };
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-md shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Event</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Title *</label>
            <input
              ref={titleInputRef}
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              placeholder="Enter event title..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="allDay"
              checked={eventData.allDay}
              onChange={(e) => handleAllDayToggle(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="allDay" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              All day
            </label>
          </div>

          {/* Date/Time inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start {eventData.allDay ? "Date" : "Time"}
              </label>
              <input
                type={eventData.allDay ? "date" : "datetime-local"}
                value={eventData.start}
                onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                End {eventData.allDay ? "Date" : "Time"}
              </label>
              <input
                type={eventData.allDay ? "date" : "datetime-local"}
                value={eventData.end}
                onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
              Category
            </label>
            <select
              value={eventData.category}
              onChange={(e) => setEventData({ ...eventData, category: e.target.value as EventInterface["category"] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="Important">Important</option>
              <option value="Meeting">Meeting</option>
              <option value="Holiday">Holiday</option>
              <option value="Other">Other</option>
              <option value="Test">Test</option>
            </select>
          </div>

          {/* Display Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Eye className="inline h-4 w-4 mr-1" />
              Display Type
            </label>
          </div>

          {/* Category preview */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Preview:</span>
            <div
              className={`${getCategoryColor(eventData.category)} text-white px-3 py-1 rounded-md text-sm font-medium`}>
              {eventData.title || "Event Title"}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium">
              <Check className="h-4 w-4" />
              <span>Create Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
