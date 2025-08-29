import { Bell, Check, X, Clock, UserCheck, Share2, CheckCircle2 } from "lucide-react";
import { usePendingShares, useAcceptShare, useRejectShare } from "@/hooks/permissions/usePermissions";
import { useAnnouncementsWithStatus } from "@/hooks/announcements/useAnnouncements";
import { AnnouncementsList } from "@/components/ui/Announcements";
import Spinner from "../ui/Utils/Spinner";
import type { ShareableObjectType } from "@/data/Utils/types";
import type { Permission } from "@/data/Utils/interfaces";

export default function NotificationsView() {
  // Get pending shares for all types
  const { data: taskListShares = [], isLoading: isTaskListSharesLoading } = usePendingShares("task_list");
  const { data: shoppingListShares = [], isLoading: isShoppingListSharesLoading } = usePendingShares("shopping_list");

  const { mutate: acceptShare } = useAcceptShare();
  const { mutate: rejectShare } = useRejectShare();

  // Get announcements with user status
  const { unreadCount: unreadAnnouncementsCount, isLoading: isAnnouncementsLoading } = useAnnouncementsWithStatus();

  // Check if any data is still loading
  const isLoading = isTaskListSharesLoading || isShoppingListSharesLoading || isAnnouncementsLoading;

  // Combine all shares
  const allShares = [
    ...taskListShares.map((share) => ({ ...share, object_type: "task_list" as ShareableObjectType })),
    ...shoppingListShares.map((share) => ({ ...share, object_type: "shopping_list" as ShareableObjectType })),
  ];

  const totalNotifications = allShares.length + unreadAnnouncementsCount;

  const getObjectTypeText = (type: ShareableObjectType) => {
    switch (type) {
      case "task_list":
        return "Lista zadań";
      case "shopping_list":
        return "Lista zakupów";
      default:
        return "Obiekt";
    }
  };

  const getObjectTypeIcon = (type: ShareableObjectType) => {
    switch (type) {
      case "task_list":
        return "📋";
      case "shopping_list":
        return "🛒";
      default:
        return "📄";
    }
  };

  const handleAccept = (shareId: string) => {
    acceptShare(shareId);
  };

  const handleReject = (shareId: string) => {
    rejectShare(shareId);
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-full p-4 gap-4">
        <div className="w-full bg-bg-alt  rounded-md shadow-md overflow-auto scrollbar-hide">
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner text="Ładowanie powiadomień i ogłoszeń..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full bg-bg-alt  rounded-md shadow-md overflow-auto scrollbar-hide">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bell size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 ">Powiadomienia</h1>
              <p className="text-sm text-gray-600 ">Zarządzaj zaproszeniami i oglądaj ogłoszenia</p>
            </div>
            {totalNotifications > 0 && (
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800  ">
                  {totalNotifications} nowe
                </span>
              </div>
            )}
          </div>

          {/* Announcements Section */}
          <div className="mb-8">
            <AnnouncementsList />
          </div>

          {/* Invitations Section */}
          {allShares.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900 ">Zaproszenia do list</h2>
                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800   rounded-full">
                  {allShares.length}
                </span>
              </div>

              {/* Shares List */}
              <div className="space-y-4">
                {allShares.map((share: Permission) => (
                  <div
                    key={share.id}
                    className="bg-white  border border-gray-200  rounded-lg shadow-md hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-blue-100  rounded-full flex items-center justify-center flex-shrink-0">
                          <Share2 size={20} className="text-blue-600 " />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Header */}
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{getObjectTypeIcon(share.object_type)}</span>
                                <span className="text-sm font-medium text-blue-600 ">Nowe udostępnienie</span>
                              </div>

                              {/* Title */}
                              <h3 className="text-lg font-semibold text-gray-900  mb-1">
                                {getObjectTypeText(share.object_type)} została udostępniona
                              </h3>

                              {/* Details */}
                              <div className="flex items-center gap-4 text-sm text-gray-600  mb-4">
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>
                                    {new Date(share.granted_at).toLocaleDateString("pl-PL", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <UserCheck size={14} />
                                  <span>Uprawnienia: {share.role === "view" ? "Odczyt" : "Edycja"}</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleAccept(share.id!)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                                  <Check size={16} />
                                  Akceptuj
                                </button>

                                <button
                                  onClick={() => handleReject(share.id!)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                  <X size={16} />
                                  Odrzuć
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - when no notifications at all */}
          {allShares.length === 0 && unreadAnnouncementsCount === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100  rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-500  mb-2">Wszystko jest aktualne!</h3>
              <p className="text-sm text-gray-400 ">Brak nowych powiadomień lub zaproszeń</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
