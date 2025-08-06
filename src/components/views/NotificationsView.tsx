import { Bell, Check, X, Clock, UserCheck, Share2, CheckCircle2 } from "lucide-react";
import { usePendingShares, useAcceptShare, useRejectShare } from "@/hooks/permissions/usePermissions";
import type { ShareableObjectType } from "@/data/Utils/types";
import type { Permission } from "@/data/Utils/interfaces";

export default function NotificationsView() {
  // Get pending shares for all types
  const { data: taskListShares = [] } = usePendingShares("task_list");
  const { data: shoppingListShares = [] } = usePendingShares("shopping_list");

  const { mutate: acceptShare } = useAcceptShare();
  const { mutate: rejectShare } = useRejectShare();

  // Combine all shares
  const allShares = [
    ...taskListShares.map((share) => ({ ...share, object_type: "task_list" as ShareableObjectType })),
    ...shoppingListShares.map((share) => ({ ...share, object_type: "shopping_list" as ShareableObjectType })),
  ];
  console.log("All shares:", allShares);

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

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full bg-bg-alt dark:bg-bg-dark rounded-md shadow-md overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bell size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Powiadomienia</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Zarządzaj zaproszeniami do udostępnionych list</p>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {allShares.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Brak nowych powiadomień</h3>
              </div>
            ) : (
              allShares.map((share: Permission) => (
                <div
                  key={share.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Share2 size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getObjectTypeIcon(share.object_type)}</span>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Nowe udostępnienie
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {getObjectTypeText(share.object_type)} została udostępniona
                            </h3>

                            {/* Details */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
