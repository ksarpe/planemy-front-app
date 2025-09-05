import { useState } from "react";
import { AlertCircle, Info, AlertTriangle, Wrench, Clock, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { useMarkAnnouncementAsRead } from "@shared/hooks/announcements/useAnnouncements";
import type { AnnouncementCardProps } from "@shared/data/Utils/Components/UtilComponentInterfaces";

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const markAsRead = useMarkAnnouncementAsRead();

  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    console.log("Toggling announcement expanded state:", newExpanded);
    // Mark as read when expanding and it's not already read
    if (newExpanded && !announcement.isRead && announcement.id) {
      markAsRead.mutate(announcement.id);
      console.log("Marking announcement as read:", announcement.id);
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "maintenance":
        return <Wrench className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "border-red-200 bg-red-50  ";
      case "warning":
        return "border-yellow-200 bg-yellow-50  ";
      case "maintenance":
        return "border-blue-200 bg-blue-50  ";
      default:
        return "border-gray-200 bg-gray-50  ";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "urgent":
        return "Pilne";
      case "warning":
        return "Ostrzeżenie";
      case "maintenance":
        return "Konserwacja";
      default:
        return "Informacja";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getAnnouncementColor(
        announcement.type,
      )} ${announcement.isNew ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
      {/* Header */}
      <div className="flex items-start gap-3 cursor-pointer" onClick={handleToggleExpanded}>
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">{getAnnouncementIcon(announcement.type)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {/* Type and New Badge */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-600  uppercase">{getTypeLabel(announcement.type)}</span>
                {announcement.isNew && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">Nowe</span>
                )}
                {!announcement.isRead && !announcement.isNew && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900  mb-2">{announcement.title}</h3>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-500 ">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(announcement.startDate)}</span>
                </div>
                {announcement.isRead && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>Przeczytane</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expand Button */}
            <button
              onClick={handleToggleExpanded}
              className="flex-shrink-0 p-1 hover:bg-white/50 rounded transition-colors">
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 ">
          <div className="prose prose-sm max-w-none ">
            {announcement.content.split("\n").map((paragraph, index) => (
              <p key={index} className="text-gray-700  mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          {/* End Date if exists */}
          {announcement.endDate && (
            <div className="mt-4 pt-2 border-t border-gray-200 ">
              <p className="text-xs text-gray-500 ">Ważne do: {formatDate(announcement.endDate)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
