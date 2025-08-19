import { useState, useRef, useEffect } from "react";
import { EventInterface } from "@/data/Calendar/events";
import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import { Edit2, Clock, User, X, Check } from "lucide-react";

interface EnhancedEventBlockProps {
  event: EventInterface;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
}

export default function EnhancedEventBlock({
  event,
  style,
  className = "",
  onClick,
  showTime = true,
}: EnhancedEventBlockProps) {
  const { updateEvent } = useCalendarContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editData, setEditData] = useState({
    title: event.title,
    description: event.description || "",
    start: new Date(event.start).toISOString().slice(0, 16),
    end: new Date(event.end).toISOString().slice(0, 16),
    category: event.category,
    color: event.color,
  });

  const editRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

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

  const handleSave = async () => {
    const updatedEvent: EventInterface = {
      ...event,
      title: editData.title,
      description: editData.description,
      start: editData.start,
      end: editData.end,
      category: editData.category as EventInterface["category"],
      color: editData.color,
      updatedAt: new Date().toISOString(),
    };

    await updateEvent(updatedEvent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: event.title,
      description: event.description || "",
      start: new Date(event.start).toISOString().slice(0, 16),
      end: new Date(event.end).toISOString().slice(0, 16),
      category: event.category,
      color: event.color,
    });
    setIsEditing(false);
  };

  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Event clicked:", event.title);
    if (onClick) {
      onClick(e);
    } else if (!isEditing) {
      console.log("Setting showDetails to:", !showDetails);
      setShowDetails(!showDetails);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Important: "bg-red-500 border-red-600",
      Meeting: "bg-blue-500 border-blue-600",
      Holiday: "bg-green-500 border-green-600",
      Health: "bg-pink-500 border-pink-600",
      Personal: "bg-purple-500 border-purple-600",
      Work: "bg-indigo-500 border-indigo-600",
      Travel: "bg-orange-500 border-orange-600",
      Fitness: "bg-emerald-500 border-emerald-600",
      Social: "bg-cyan-500 border-cyan-600",
      Finance: "bg-yellow-500 border-yellow-600",
      Other: "bg-gray-500 border-gray-600",
    };
    return colors[category as keyof typeof colors] || event.color || "bg-gray-500 border-gray-600";
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

  // Standard display type (default)
  return (
    <div className="relative" ref={editRef}>
      {/* Main event block */}
      <div
        className={`${getCategoryColor(
          event.category,
        )} text-white rounded-md shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${className}`}
        style={style}
        onClick={handleEventClick}>
        <div className="p-2">
          <div className="font-medium text-sm truncate flex items-center space-x-1">
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

      {/* Details/Edit popup */}
      {(showDetails || isEditing) && (
        <div className="absolute top-full left-0 mt-2 bg-white  border border-gray-200  rounded-md shadow-lg min-w-80 z-50 max-w-96">
          {isEditing ? (
            /* Edit mode */
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 ">Edit Event</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-50  rounded" title="Save">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={handleCancel} className="p-1 text-gray-400 hover:bg-gray-50  rounded" title="Cancel">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">Title</label>
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-1">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">Start</label>
                  <input
                    type="datetime-local"
                    value={editData.start}
                    onChange={(e) => setEditData({ ...editData, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">End</label>
                  <input
                    type="datetime-local"
                    value={editData.end}
                    onChange={(e) => setEditData({ ...editData, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900 "
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700  mb-1">Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) =>
                      setEditData({ ...editData, category: e.target.value as EventInterface["category"] })
                    }
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
                  <label className="block text-sm font-medium text-gray-700  mb-1">Display</label>
                </div>
              </div>
            </div>
          ) : (
            /* Details mode */
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900  text-lg flex items-center space-x-2">
                    <span>{event.title}</span>
                  </h3>
                  <div
                    className={`inline-block px-2 py-1 rounded text-xs text-white mt-1 ${getCategoryColor(
                      event.category,
                    )}`}>
                    {event.category}
                  </div>
                  {event.isRecurring && <div className="text-xs text-blue-600  mt-1">🔄 Recurring event</div>}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setShowDetails(false);
                    }}
                    className="p-1 text-gray-400 hover:bg-gray-50  rounded"
                    title="Edit">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(false);
                    }}
                    className="p-1 text-gray-400 hover:bg-gray-50  rounded"
                    title="Close">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {event.description && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 ">{event.description}</p>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-600 ">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{getTimeString()}</span>
                </div>

                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>You</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
