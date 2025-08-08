import { useState, useRef, useEffect } from "react";
import { X, Calendar, Clock, Tag, Check, Repeat } from "lucide-react";
import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import { EventInterface, RecurrencePattern } from "../../../data/types";
import { useAuthContext } from "../../../hooks/context/useAuthContext";

interface EnhancedCreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  defaultCategory?: EventInterface["category"];
}

export default function EnhancedCreateEventModal({
  isOpen,
  onClose,
  selectedDate,
  defaultCategory = "Other",
}: EnhancedCreateEventModalProps) {
  const { addEvent } = useCalendarContext();
  const { user } = useAuthContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    category: defaultCategory as EventInterface["category"],
    allDay: false,
    icon: "",
    iconColor: "#6b7280",
    isRecurring: false,
    recurrencePattern: "daily" as RecurrencePattern,
    recurrenceInterval: 1,
    recurrenceEndDate: "",
    recurrenceCount: 0,
    isPrivate: false,
    location: "",
    // Health tracking fields
    healthType: "other" as "period" | "ovulation" | "medication" | "symptom" | "mood" | "weight" | "other",
    healthNotes: "",
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

      setEventData((prev) => ({
        ...prev,
        title: "",
        description: "",
        start: startTime.toISOString().slice(0, 16),
        end: endTime.toISOString().slice(0, 16),
        category: defaultCategory,
        allDay: false,
        isRecurring: false,
      }));

      // Focus title input after a short delay
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, selectedDate, defaultCategory]);

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

    if (!eventData.title.trim() || !user?.uid) {
      titleInputRef.current?.focus();
      return;
    }

    const newEvent: Omit<EventInterface, "id" | "createdAt" | "updatedAt"> = {
      title: eventData.title.trim(),
      start: eventData.allDay ? new Date(eventData.start).toISOString().split("T")[0] : eventData.start,
      end: eventData.allDay ? new Date(eventData.end).toISOString().split("T")[0] : eventData.end,
      category: eventData.category,
      allDay: eventData.allDay,
      color: getCategoryColor(eventData.category),
      iconColor: eventData.iconColor,
      isRecurring: eventData.isRecurring,
      isPrivate: eventData.isPrivate,
      visibility: eventData.isPrivate ? "private" : "public",
      userId: user.uid,
      ...(eventData.description.trim() && { description: eventData.description.trim() }),
      ...(eventData.icon && { icon: eventData.icon }),
      ...(eventData.isRecurring && {
        recurrence: {
          pattern: eventData.recurrencePattern,
          interval: eventData.recurrenceInterval,
          daysOfWeek: [],
          ...(eventData.recurrenceEndDate && { endDate: eventData.recurrenceEndDate }),
          ...(eventData.recurrenceCount && { count: eventData.recurrenceCount }),
        },
      }),
      ...(eventData.location && { location: eventData.location }),
      ...(eventData.category === "Health" && {
        healthData: {
          type: eventData.healthType,
          ...(eventData.healthNotes && { notes: eventData.healthNotes }),
        },
      }),
    };

    await addEvent(newEvent);
    onClose();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Important: "bg-red-500",
      Meeting: "bg-blue-500",
      Holiday: "bg-green-500",
      Health: "bg-pink-500",
      Personal: "bg-purple-500",
      Work: "bg-indigo-500",
      Travel: "bg-orange-500",
      Fitness: "bg-emerald-500",
      Social: "bg-cyan-500",
      Finance: "bg-yellow-500",
      Other: "bg-gray-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
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

  const getQuickEventTemplate = (type: string) => {
    switch (type) {
      case "period":
        return {
          title: "Period",
          category: "Health" as const,
          displayType: "icon" as const,
          icon: "Circle",
          iconColor: "#ec4899",
          allDay: true,
          isRecurring: true,
          recurrencePattern: "monthly" as const,
          healthType: "period" as const,
          isPrivate: true,
        };
      case "workout":
        return {
          title: "Workout",
          category: "Fitness" as const,
          displayType: "standard" as const,
          icon: "Dumbbell",
          iconColor: "#10b981",
        };
      case "medication":
        return {
          title: "Medication",
          category: "Health" as const,
          displayType: "icon" as const,
          icon: "Pill",
          iconColor: "#3b82f6",
          isRecurring: true,
          recurrencePattern: "daily" as const,
        };
      default:
        return {};
    }
  };

  const applyTemplate = (template: Partial<typeof eventData>) => {
    setEventData((prev) => ({ ...prev, ...template }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white  rounded-md shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 ">
          <h2 className="text-xl font-semibold text-gray-900 ">Create Event</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100  rounded-md transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Templates */}
        <div className="p-4 border-b border-gray-200 ">
          <div className="text-sm font-medium text-gray-700  mb-2">Quick Templates</div>
          <div className="flex space-x-2">
            <button
              onClick={() => applyTemplate(getQuickEventTemplate("period"))}
              className="px-3 py-1 text-xs bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors">
              🩸 Period
            </button>
            <button
              onClick={() => applyTemplate(getQuickEventTemplate("workout"))}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
              💪 Workout
            </button>
            <button
              onClick={() => applyTemplate(getQuickEventTemplate("medication"))}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
              💊 Medication
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Event Title *</label>
            <input
              ref={titleInputRef}
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              placeholder="Enter event title..."
              className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900  placeholder-gray-500 "
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-2">Description</label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              placeholder="Optional description..."
              className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900  placeholder-gray-500 "
              rows={2}
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
            <label htmlFor="allDay" className="text-sm font-medium text-gray-700 ">
              All day
            </label>
          </div>

          {/* Date/Time inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Start {eventData.allDay ? "Date" : "Time"}
              </label>
              <input
                type={eventData.allDay ? "date" : "datetime-local"}
                value={eventData.start}
                onChange={(e) => setEventData({ ...eventData, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                End {eventData.allDay ? "Date" : "Time"}
              </label>
              <input
                type={eventData.allDay ? "date" : "datetime-local"}
                value={eventData.end}
                onChange={(e) => setEventData({ ...eventData, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                required
              />
            </div>
          </div>

          {/* Category and Display Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Category
              </label>
              <select
                value={eventData.category}
                onChange={(e) => setEventData({ ...eventData, category: e.target.value as EventInterface["category"] })}
                className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 ">
                <option value="Important">Important</option>
                <option value="Meeting">Meeting</option>
                <option value="Holiday">Holiday</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Travel">Travel</option>
                <option value="Fitness">Fitness</option>
                <option value="Social">Social</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-2">Display Type</label>
            </div>
          </div>

          {/* Icon and Color (for icon display type) */}

          {/* Recurring Event Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isRecurring"
                checked={eventData.isRecurring}
                onChange={(e) => setEventData({ ...eventData, isRecurring: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700  flex items-center">
                <Repeat className="h-4 w-4 mr-1" />
                Recurring event
              </label>
            </div>

            {eventData.isRecurring && (
              <div className="grid grid-cols-2 gap-4 pl-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Repeat every</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={eventData.recurrenceInterval}
                      onChange={(e) =>
                        setEventData({ ...eventData, recurrenceInterval: parseInt(e.target.value) || 1 })
                      }
                      className="w-20 px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                    />
                    <select
                      value={eventData.recurrencePattern}
                      onChange={(e) =>
                        setEventData({ ...eventData, recurrencePattern: e.target.value as RecurrencePattern })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 ">
                      <option value="daily">Day(s)</option>
                      <option value="weekly">Week(s)</option>
                      <option value="monthly">Month(s)</option>
                      <option value="yearly">Year(s)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">End date (optional)</label>
                  <input
                    type="date"
                    value={eventData.recurrenceEndDate}
                    onChange={(e) => setEventData({ ...eventData, recurrenceEndDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                  />
                </div>
              </div>
            )}
          </div>

          {/* Health Data (only for Health category) */}
          {eventData.category === "Health" && (
            <div className="space-y-4 p-4 bg-pink-50  rounded-md">
              <h4 className="font-medium text-gray-900 ">Health Tracking</h4>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-2">Type</label>
                  <select
                    value={eventData.healthType}
                    onChange={(e) =>
                      setEventData({ ...eventData, healthType: e.target.value as typeof eventData.healthType })
                    }
                    className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 ">
                    <option value="period">Period</option>
                    <option value="ovulation">Ovulation</option>
                    <option value="medication">Medication</option>
                    <option value="symptom">Symptom</option>
                    <option value="mood">Mood</option>
                    <option value="weight">Weight</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">Notes</label>
                <textarea
                  value={eventData.healthNotes}
                  onChange={(e) => setEventData({ ...eventData, healthNotes: e.target.value })}
                  placeholder="Optional health notes..."
                  className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900  placeholder-gray-500 "
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Privacy */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPrivate"
              checked={eventData.isPrivate}
              onChange={(e) => setEventData({ ...eventData, isPrivate: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700 ">
              Private event (only visible to you)
            </label>
          </div>

          {/* Event Preview */}
          <div className="space-y-2">
            <span className="text-sm text-gray-600 ">Preview:</span>
            <div
              className={`${getCategoryColor(
                eventData.category,
              )} text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center space-x-2`}>
              <span>{eventData.title || "Event Title"}</span>
              {eventData.isRecurring && <Repeat className="h-3 w-3" />}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700  bg-white  border border-gray-300  rounded-md hover:bg-gray-50  transition-colors">
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
