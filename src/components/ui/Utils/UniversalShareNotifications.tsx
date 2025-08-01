import { useAuthContext } from "@/hooks/useAuthContext";
import { useToastContext } from "@/hooks/useToastContext";
import { Check, X, Clock, UserCheck, Share2, Calendar, ShoppingBag, List } from "lucide-react";
import { useEffect, useState } from "react";
import { ShareableObjectType } from "@/data/Utils/types";
import { ShareNotification } from "@/data/Utils/interfaces";
import {
  listenToUserPendingNotifications,
  acceptObjectInvitation,
  rejectObjectInvitation,
} from "@/api/permissions/permissions";

// Icon mapping for different object types
const getObjectIcon = (objectType: ShareableObjectType) => {
  switch (objectType) {
    case "task_list":
      return List;
    case "event":
      return Calendar;
    case "shopping_list":
      return ShoppingBag;
    default:
      return Share2;
  }
};

// Display text for different object types
const getObjectTypeText = (objectType: ShareableObjectType) => {
  switch (objectType) {
    case "task_list":
      return "Lista zadań";
    case "event":
      return "Wydarzenie";
    case "shopping_list":
      return "Lista zakupów";
    default:
      return "Obiekt";
  }
};

export default function UniversalShareNotifications() {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const [notifications, setNotifications] = useState<ShareNotification[]>([]);
  const [loading, setLoading] = useState(false);

  // Listen for pending notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    console.log("Setting up universal notifications listener for user:", user.uid);
    const unsubscribe = listenToUserPendingNotifications(user.uid, (newNotifications) => {
      console.log("UniversalShareNotifications - notifications received:", newNotifications);
      setNotifications(newNotifications);
    });

    return () => {
      console.log("Cleaning up universal notifications listener");
      unsubscribe();
    };
  }, [user]);

  const handleAccept = async (notificationId: string) => {
    if (!notificationId) return;

    try {
      setLoading(true);
      await acceptObjectInvitation(notificationId);
      showToast("success", "Udostępnienie zostało zaakceptowane!");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      showToast("error", "Błąd podczas akceptowania zaproszenia");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (notificationId: string) => {
    if (!notificationId) return;

    try {
      setLoading(true);
      await rejectObjectInvitation(notificationId);
      showToast("success", "Udostępnienie zostało odrzucone!");
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      showToast("error", "Błąd podczas odrzucania zaproszenia");
    } finally {
      setLoading(false);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const ObjectIcon = getObjectIcon(notification.object_type);
        const objectTypeText = getObjectTypeText(notification.object_type);

        return (
          <div
            key={notification.id}
            className="bg-white border border-blue-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right duration-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ObjectIcon size={16} className="text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Nowe udostępnienie</span>
                </div>

                <p className="text-sm font-medium text-gray-900 mb-1">
                  {objectTypeText}: "{notification.object_name}"
                </p>

                <p className="text-xs text-gray-500 mb-2">
                  Uprawnienie:{" "}
                  {notification.permission === "view"
                    ? "podgląd"
                    : notification.permission === "edit"
                    ? "edycja"
                    : "administrator"}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Clock size={12} />
                  <span>{new Date(notification.shared_at).toLocaleDateString("pl-PL")}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(notification.id!)}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors disabled:opacity-50">
                    <Check size={12} />
                    Akceptuj
                  </button>

                  <button
                    onClick={() => handleReject(notification.id!)}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors disabled:opacity-50">
                    <X size={12} />
                    Odrzuć
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
