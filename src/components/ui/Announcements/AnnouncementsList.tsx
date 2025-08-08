import { useEffect, useRef, useMemo } from "react";
import { Megaphone, CheckCircle2 } from "lucide-react";
import AnnouncementCard from "./AnnouncementCard";
import { useAnnouncementsWithStatus, useMarkAnnouncementAsSeen } from "@/hooks/announcements/useAnnouncements";

export default function AnnouncementsList() {
  const { announcements, unreadCount, isLoading } = useAnnouncementsWithStatus();
  const markAsSeen = useMarkAnnouncementAsSeen();
  const processedIds = useRef(new Set<string>());

  // Get new announcements that haven't been processed yet
  const newUnprocessedAnnouncements = useMemo(() => {
    return announcements.filter((a) => a.isNew && a.id && !processedIds.current.has(a.id));
  }, [announcements]);

  // Mark new announcements as seen when component loads
  useEffect(() => {
    newUnprocessedAnnouncements.forEach((announcement) => {
      if (announcement.id) {
        processedIds.current.add(announcement.id);
        markAsSeen.mutate(announcement.id);
      }
    });
  }, [newUnprocessedAnnouncements, markAsSeen]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border border-gray-200  rounded-lg p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-300  rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300  rounded w-1/4"></div>
                <div className="h-6 bg-gray-300  rounded w-3/4"></div>
                <div className="h-3 bg-gray-300  rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count */}
      {announcements.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600 ">Ogłoszenia ({announcements.length})</span>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800   rounded-full">
              {unreadCount} nieprzeczytane
            </span>
          )}
        </div>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100  rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-500  mb-2">Brak aktywnych ogłoszeń</h3>
          <p className="text-sm text-gray-400 ">Wszystkie ogłoszenia są aktualne</p>
        </div>
      ) : (
        announcements.map((announcement) => <AnnouncementCard key={announcement.id} announcement={announcement} />)
      )}
    </div>
  );
}
