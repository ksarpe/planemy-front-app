import {
  shareObjectWithUser,
  acceptObjectInvitation,
  rejectObjectInvitation,
  deletePermission,
  revokeObjectAccess,
  getObjectSharedUsers,
  listenToUserPendingNotifications,
} from "@/firebase/permissions/permissions";
import type { SharePermission } from "@/data/Utils/types";
import type { ShareNotification } from "@/data/Utils/interfaces";
/**
 * Share event with user
 */
export const shareEventWithUser = async (
  eventId: string,
  targetUserEmail: string,
  permission: SharePermission,
  sharedByUserId: string,
): Promise<void> => {
  return shareObjectWithUser(eventId, "event", targetUserEmail, permission, sharedByUserId);
};

/**
 * Accept event invitation
 */
export const acceptEventInvitation = async (permissionId: string): Promise<void> => {
  return acceptObjectInvitation(permissionId);
};

/**
 * Reject event invitation
 */
export const rejectEventInvitation = async (permissionId: string): Promise<void> => {
  return rejectObjectInvitation(permissionId);
};

/**
 * Delete event permission/notification
 */
export const deleteEventNotification = async (permissionId: string): Promise<void> => {
  return deletePermission(permissionId);
};

/**
 * Revoke access to event
 */
export const revokeEventAccess = async (eventId: string, userId: string): Promise<void> => {
  return revokeObjectAccess(eventId, "event", userId);
};

/**
 * Get users with access to an event
 */
export const getEventSharedUsers = async (
  eventId: string,
): Promise<
  Array<{
    id: string;
    email: string;
    displayName?: string;
    permission: SharePermission;
    status: "pending" | "accepted";
  }>
> => {
  const users = await getObjectSharedUsers(eventId, "event");
  // Filter out revoked users for compatibility
  return users
    .filter((user) => user.status !== "revoked" && user.status !== "rejected")
    .map((user) => ({
      ...user,
      status: user.status as "pending" | "accepted",
    }));
};

/**
 * Real-time listener for user's pending event notifications
 */
export const listenToUserPendingEventNotifications = (
  userId: string,
  callback: (notifications: ShareNotification[]) => void,
) => {
  return listenToUserPendingNotifications(userId, (genericNotifications) => {
    const eventNotifications = genericNotifications.filter((notification) => notification.object_type === "event");
    callback(eventNotifications);
  });
};
