import { TaskListNotification, SharePermission } from "../data/types";
import { 
  shareObjectWithUser,
  acceptObjectInvitation,
  rejectObjectInvitation,
  deletePermission,
  revokeObjectAccess,
  getObjectSharedUsers,
  listenToUserPendingNotifications as listenToGenericNotifications
} from "./permissions";

/**
 * Share task list with user - UPDATED to use generic permissions system
 */
export const shareTaskListWithUser = async (
  listId: string,
  targetUserEmail: string,
  permission: SharePermission,
  sharedByUserId: string
): Promise<void> => {
  return shareObjectWithUser(listId, "task_list", targetUserEmail, permission, sharedByUserId);
};

/**
 * Accept task list invitation - UPDATED to use generic permissions system
 */
export const acceptTaskListInvitation = async (notificationId: string): Promise<void> => {
  return acceptObjectInvitation(notificationId);
};

/**
 * Reject task list invitation - UPDATED to use generic permissions system
 */
export const rejectTaskListInvitation = async (notificationId: string): Promise<void> => {
  return rejectObjectInvitation(notificationId);
};

/**
 * Get pending notifications for user - DEPRECATED: Use generic permissions system instead
 * This function is kept for backwards compatibility but should not be used
 */
export const getUserPendingNotifications = async (): Promise<TaskListNotification[]> => {
  console.warn("getUserPendingNotifications is deprecated. Use generic permissions system instead.");
  return [];
};

/**
 * Real-time listener for user's pending notifications - UPDATED to use generic permissions system
 */
export const listenToUserPendingNotifications = (
  userId: string,
  callback: (notifications: TaskListNotification[]) => void
) => {
  // Use the generic listener but convert to TaskListNotification format for compatibility
  return listenToGenericNotifications(userId, (genericNotifications) => {
    const taskPermissions: TaskListNotification[] = genericNotifications
      .filter(notification => notification.object_type === "task_list")
      .map(notification => ({
        id: notification.id,
        listId: notification.object_id,
        listName: notification.object_name,
        sharedBy: notification.shared_by,
        sharedWith: notification.shared_with,
        permission: notification.permission,
        sharedAt: notification.shared_at,
        status: notification.status === "revoked" ? "rejected" : notification.status // Convert revoked to rejected for compatibility
      }));
    
    callback(taskPermissions);
  });
};

/**
 * Delete notification - UPDATED to use generic permissions system
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  return deletePermission(notificationId);
};

/**
 * Revoke access to task list - UPDATED to use generic permissions system
 */
export const revokeTaskListAccess = async (
  listId: string, 
  userId: string
): Promise<void> => {
  return revokeObjectAccess(listId, "task_list", userId);
};

/**
 * Get users with access to a task list - UPDATED to use generic permissions system
 */
export const getTaskListSharedUsers = async (listId: string): Promise<Array<{
  id: string,
  email: string, 
  displayName?: string,
  permission: SharePermission,
  status: 'pending' | 'accepted'
}>> => {
  const users = await getObjectSharedUsers(listId, "task_list");
  // Filter out revoked users for compatibility
  return users.filter(user => user.status !== 'revoked' && user.status !== 'rejected')
    .map(user => ({
      ...user,
      status: user.status as 'pending' | 'accepted'
    }));
};
