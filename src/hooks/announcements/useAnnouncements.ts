import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActiveAnnouncementsApi,
  getAnnouncementByIdApi,
  getUserNotificationStatusApi,
  markAnnouncementAsSeenApi,
  markAnnouncementAsReadApi,
} from "@/api/announcements";
import { useAuthContext } from "@/hooks/context/useAuthContext";

/**
 * Get all active announcements
 */
export const useActiveAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements", "active"],
    queryFn: getActiveAnnouncementsApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

/**
 * Get single announcement by ID
 */
export const useAnnouncement = (announcementId: string) => {
  return useQuery({
    queryKey: ["announcement", announcementId],
    queryFn: () => getAnnouncementByIdApi(announcementId),
    enabled: !!announcementId,
  });
};

/**
 * Get user's notification statuses for announcements
 */
export const useUserNotificationStatuses = (announcementIds: string[]) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["notificationStatuses", user?.uid, ...announcementIds.sort()],
    queryFn: () => getUserNotificationStatusApi(user!.uid, announcementIds),
    enabled: !!user && announcementIds.length > 0,
  });
};

/**
 * Combined hook for announcements with user statuses
 */
export const useAnnouncementsWithStatus = () => {
  // const { user } = useAuthContext();

  // Get active announcements
  const { data: announcements = [], isLoading: announcementsLoading } = useActiveAnnouncements();
  // Get user statuses for those announcements
  const announcementIds = announcements.map((a) => a.id!);
  const { data: statuses = [], isLoading: statusesLoading } = useUserNotificationStatuses(announcementIds);

  // Combine data
  const announcementsWithStatus = announcements.map((announcement) => {
    const status = statuses.find((s) => s.announcementId === announcement.id);
    return {
      ...announcement,
      userStatus: status,
      isNew: !status, // New if no status record exists
      isRead: status?.isRead || false,
    };
  });

  // Separate unread announcements
  const unreadAnnouncements = announcementsWithStatus.filter((a) => !a.isRead);
  const unreadCount = unreadAnnouncements.length;

  return {
    announcements: announcementsWithStatus,
    unreadAnnouncements,
    unreadCount,
    isLoading: announcementsLoading || statusesLoading,
  };
};

/**
 * Mark announcement as seen (when user sees it in list)
 */
export const useMarkAnnouncementAsSeen = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (announcementId: string) => markAnnouncementAsSeenApi(user!.uid, announcementId),
    onSuccess: (_, announcementId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["notificationStatuses", user!.uid],
      });
      console.log("Announcement marked as seen:", announcementId);
    },
    onError: (error) => {
      console.error("Error marking announcement as seen:", error);
    },
  });
};

/**
 * Mark announcement as read (when user expands/reads it)
 */
export const useMarkAnnouncementAsRead = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (announcementId: string) => markAnnouncementAsReadApi(user!.uid, announcementId),
    onSuccess: (_, announcementId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["notificationStatuses", user!.uid],
      });
      console.log("Announcement marked as read:", announcementId);
    },
    onError: (error) => {
      console.error("Error marking announcement as read:", error);
    },
  });
};
