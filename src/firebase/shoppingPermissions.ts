import { 
  shareObjectWithUser,
  acceptObjectInvitation,
  rejectObjectInvitation,
  deletePermission,
  revokeObjectAccess,
  getObjectSharedUsers,
  listenToUserPendingNotifications
} from "./permissions";
import { SharePermission, ShareNotification } from "../data/types";

/**
 * Share shopping list with user
 */
export const shareShoppingListWithUser = async (
  listId: string,
  targetUserEmail: string,
  permission: SharePermission,
  sharedByUserId: string
): Promise<void> => {
  return shareObjectWithUser(listId, "shopping_list", targetUserEmail, permission, sharedByUserId);
};

/**
 * Accept shopping list invitation
 */
export const acceptShoppingListInvitation = async (permissionId: string): Promise<void> => {
  return acceptObjectInvitation(permissionId);
};

/**
 * Reject shopping list invitation
 */
export const rejectShoppingListInvitation = async (permissionId: string): Promise<void> => {
  return rejectObjectInvitation(permissionId);
};

/**
 * Delete shopping list permission/notification
 */
export const deleteShoppingListNotification = async (permissionId: string): Promise<void> => {
  return deletePermission(permissionId);
};

/**
 * Revoke access to shopping list
 */
export const revokeShoppingListAccess = async (
  listId: string,
  userId: string
): Promise<void> => {
  return revokeObjectAccess(listId, "shopping_list", userId);
};

/**
 * Get users with access to a shopping list
 */
export const getShoppingListSharedUsers = async (listId: string): Promise<Array<{
  id: string,
  email: string, 
  displayName?: string,
  permission: SharePermission,
  status: 'pending' | 'accepted'
}>> => {
  const users = await getObjectSharedUsers(listId, "shopping_list");
  // Filter out revoked users for compatibility
  return users.filter(user => user.status !== 'revoked' && user.status !== 'rejected')
    .map(user => ({
      ...user,
      status: user.status as 'pending' | 'accepted'
    }));
};

/**
 * Real-time listener for user's pending shopping list notifications
 */
export const listenToUserPendingShoppingNotifications = (
  userId: string,
  callback: (notifications: ShareNotification[]) => void
) => {
  return listenToUserPendingNotifications(userId, (genericNotifications) => {
    const shoppingNotifications = genericNotifications.filter(
      notification => notification.object_type === "shopping_list"
    );
    callback(shoppingNotifications);
  });
};
