import { useState, useRef, useEffect } from "react";
import { EventInterface } from "../../../data/types";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import { Edit2, Clock, User, X, Check } from "lucide-react";

interface EventBlockProps {
  event: EventInterface;
  style?: React.CSSProperties;
  className?: string;
  isPreview?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function EventBlock({ event, style, className = "", isPreview = false, onClick }: EventBlockProps) {
  const { updateEvent } = useCalendarContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editData, setEditData] = useState({
    title: event.title,
    start: new Date(event.start).toISOString().slice(0, 16),
    end: new Date(event.end).toISOString().slice(0, 16),
    category: event.category
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
      start: editData.start,
      end: editData.end,
      category: editData.category as EventInterface["category"]
    };
    
    await updateEvent(updatedEvent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: event.title,
      start: new Date(event.start).toISOString().slice(0, 16),
      end: new Date(event.end).toISOString().slice(0, 16),
      category: event.category
    });
    setIsEditing(false);
  };

  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else if (!isEditing) {
      setShowDetails(!showDetails);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Important": "bg-red-500 border-red-600",
      "Meeting": "bg-blue-500 border-blue-600", 
      "Holiday": "bg-green-500 border-green-600",
      "Other": "bg-purple-500 border-purple-600",
      "Test": "bg-yellow-500 border-yellow-600"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500 border-gray-600";
  };

  const getTimeString = () => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    if (event.allDay) {
      return "All day";
    }
    
    return `${start.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}`;
  };

  if (isPreview) {
    return (
      <div 
        className={`${getCategoryColor(event.category)} text-white text-xs p-1 rounded-md shadow-sm border-l-4 ${className}`}
        style={style}
      >
        <div className="font-medium truncate">{event.title}</div>
        {!event.allDay && (
          <div className="text-white/80 text-xs">{getTimeString()}</div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={editRef}>
      {/* Main event block */}
      <div
        className={`${getCategoryColor(event.category)} text-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${className}`}
        style={style}
        onClick={handleEventClick}
      >
        <div className="p-2">
          <div className="font-medium text-sm truncate">{event.title}</div>
          {!event.allDay && (
            <div className="text-white/80 text-xs mt-1">
              <Clock className="inline h-3 w-3 mr-1" />
              {getTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Details/Edit popup */}
      {(showDetails || isEditing) && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-80 z-50">
          {isEditing ? (
            /* Edit mode */
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Edit Event</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                    title="Save"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    value={editData.start}
                    onChange={(e) => setEditData({ ...editData, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End
                  </label>
                  <input
                    type="datetime-local"
                    value={editData.end}
                    onChange={(e) => setEditData({ ...editData, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value as EventInterface["category"] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Important">Important</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Other">Other</option>
                  <option value="Test">Test</option>
                </select>
              </div>
            </div>
          ) : (
            /* Details mode */
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{event.title}</h3>
                  <div className={`inline-block px-2 py-1 rounded text-xs text-white mt-1 ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setShowDetails(false);
                    }}
                    className="p-1 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(false);
                    }}
                    className="p-1 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
