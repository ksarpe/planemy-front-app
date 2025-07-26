import { 
  collection, 
  doc, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  orderBy,
  getDoc,
  arrayUnion,
  arrayRemove 
} from "firebase/firestore";
import { db } from "./config";
import { TaskListNotification, SharePermission } from "../data/types";

const PERMISSIONS_COLLECTION = "task_permissions";

/**
 * Search users by email
 */
const searchUsersByEmail = async (email: string): Promise<Array<{id: string, email: string, displayName?: string}>> => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.data().id,
      email: doc.data().email,
      displayName: doc.data().displayName
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

/**
 * Share task list with user - creates notification and adds user to list
 */
export const shareTaskListWithUser = async (
  listId: string,
  targetUserEmail: string,
  permission: SharePermission,
  sharedByUserId: string
): Promise<void> => {
  
  try {
    // Find target user by email
    console.log("Searching for user with email:", targetUserEmail);
    const users = await searchUsersByEmail(targetUserEmail);
    console.log("Found users:", users);
    
    if (users.length === 0) {
      console.error("User not found with email:", targetUserEmail);
      throw new Error("User not found with this email");
    }
    
    const targetUser = users[0];
    console.log("Target user found:", targetUser);
    
    // Get task list name for notification
    const taskListDoc = await getDoc(doc(db, "taskLists", listId));
    if (!taskListDoc.exists()) {
      throw new Error("Task list not found");
    }
    
    const taskListData = taskListDoc.data();
    const listName = taskListData.name || "Lista zadań";
    
    // Check if user already has access
    const currentSharedWith = taskListData.sharedWith || [];
    if (currentSharedWith.includes(targetUser.id)) {
      throw new Error("User already has access to this list");
    }
    
    // Check if notification already exists
    const notificationsCollection = collection(db, PERMISSIONS_COLLECTION);
    const existingQuery = query(
      notificationsCollection,
      where("listId", "==", listId),
      where("sharedWith", "==", targetUser.id),
      where("status", "==", "pending")
    );
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      throw new Error("Invitation already sent to this user");
    }
    
    // Create notification
    const notification: Omit<TaskListNotification, 'id'> = {
      listId,
      listName,
      sharedBy: sharedByUserId,
      sharedWith: targetUser.id,
      permission,
      sharedAt: new Date().toISOString(),
      status: "pending"
    };
    
    await addDoc(notificationsCollection, notification);
    
  } catch (error) {
    console.error("Error sharing task list:", error);
    throw error;
  }
};

/**
 * Accept task list invitation
 */
export const acceptTaskListInvitation = async (notificationId: string): Promise<void> => {
  console.log("acceptTaskListInvitation called with:", notificationId);
  
  try {
    // Get notification details
    const notificationDoc = await getDoc(doc(db, PERMISSIONS_COLLECTION, notificationId));
    if (!notificationDoc.exists()) {
      throw new Error("Notification not found");
    }
    
    const notification = notificationDoc.data() as TaskListNotification;
    
    // Add user to task list sharedWith
    const taskListRef = doc(db, "taskLists", notification.listId);
    await updateDoc(taskListRef, {
      sharedWith: arrayUnion(notification.sharedWith)
    });
    console.log("User added to task list sharedWith");
    
    // Update notification status
    await updateDoc(notificationDoc.ref, {
      status: "accepted"
    });
    
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

/**
 * Reject task list invitation
 */
export const rejectTaskListInvitation = async (notificationId: string): Promise<void> => {
  try {
    const notificationDoc = doc(db, PERMISSIONS_COLLECTION, notificationId);
    await updateDoc(notificationDoc, {
      status: "rejected"
    });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    throw error;
  }
};

/**
 * Get pending notifications for user
 */
export const getUserPendingNotifications = async (userId: string): Promise<TaskListNotification[]> => {
  try {
    const notificationsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      notificationsCollection,
      where("sharedWith", "==", userId),
      where("status", "==", "pending"),
      orderBy("sharedAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TaskListNotification[];
    
  } catch (error) {
    console.error("Error getting pending notifications:", error);
    return [];
  }
};

/**
 * Real-time listener for user's pending notifications
 */
export const listenToUserPendingNotifications = (
  userId: string,
  callback: (notifications: TaskListNotification[]) => void
) => {    
  const q = query(
    collection(db, PERMISSIONS_COLLECTION),
    where("sharedWith", "==", userId),
    where("status", "==", "pending")
  );
  
  return onSnapshot(q, (snapshot) => {
    console.log("listenToUserPendingNotifications - snapshot received, docs count:", snapshot.docs.length);
    const notifications = snapshot.docs.map(doc => {
      const data = {
        id: doc.id,
        ...doc.data()
      } as TaskListNotification;
      console.log("listenToUserPendingNotifications - doc data:", data);
      return data;
    }).sort((a, b) => new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime()); // Sort in memory
    
    callback(notifications);
  }, (error) => {
    console.error("listenToUserPendingNotifications - error:", error);
  });
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PERMISSIONS_COLLECTION, notificationId));
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * Revoke access to task list - removes user from sharedWith and deletes any pending notifications
 */
export const revokeTaskListAccess = async (
  listId: string, 
  userId: string
): Promise<void> => {
  try {
    console.log("Revoking access for user:", userId, "from list:", listId);
    
    // Remove user from task list sharedWith array
    const taskListRef = doc(db, "taskLists", listId);
    await updateDoc(taskListRef, {
      sharedWith: arrayRemove(userId)
    });
    console.log("User removed from task list sharedWith");
    
    // Find and delete any pending notifications for this user and list
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const pendingQuery = query(
      permissionsCollection,
      where("listId", "==", listId),
      where("sharedWith", "==", userId),
      where("status", "==", "pending")
    );
    
    const pendingSnapshot = await getDocs(pendingQuery);
    
    // Delete all pending notifications
    const deletePromises = pendingSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log("Deleted", pendingSnapshot.docs.length, "pending notifications");
    
    // Also find and update any accepted notifications to "revoked" status
    const acceptedQuery = query(
      permissionsCollection,
      where("listId", "==", listId),
      where("sharedWith", "==", userId),
      where("status", "==", "accepted")
    );
    
    const acceptedSnapshot = await getDocs(acceptedQuery);
    
    // Update accepted notifications to revoked status for audit trail
    const updatePromises = acceptedSnapshot.docs.map(doc => 
      updateDoc(doc.ref, { status: "revoked" })
    );
    await Promise.all(updatePromises);
    
    console.log("Updated", acceptedSnapshot.docs.length, "accepted notifications to revoked status");
    
  } catch (error) {
    console.error("Error revoking task list access:", error);
    throw error;
  }
};

/**
 * Get users with access to a task list when clicking "Share" in edit taskList view
 * GIVE: listId
 * RETURNS: an array of users with their permissions and status
 */
export const getTaskListSharedUsers = async (listId: string): Promise<Array<{
  id: string,
  email: string, 
  displayName?: string,
  permission: SharePermission,
  status: 'pending' | 'accepted'
}>> => {
  try {    
    // Get all permissions for this list
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const permissionsQuery = query(
      permissionsCollection,
      where("listId", "==", listId),
      where("status", "in", ["pending", "accepted"])
    );
    
    console.log("Executing permissions query...");
    const permissionsSnapshot = await getDocs(permissionsQuery);
    console.log("Permissions found:", permissionsSnapshot.docs.length);
    
    permissionsSnapshot.docs.forEach(doc => {
      console.log("Permission doc:", doc.id, doc.data());
    });
    
    // Get unique user IDs
    const userIds = [...new Set(permissionsSnapshot.docs.map(doc => doc.data().sharedWith))];
    console.log("Unique user IDs:", userIds);
    
    if (userIds.length === 0) {
      console.log("No user IDs found, returning empty array");
      return [];
    }
    
    // Get user details
    const usersCollection = collection(db, "users");
    const usersPromises = userIds.map(async (userId) => {
      console.log("Fetching user data for:", userId);
      const userDoc = await getDoc(doc(usersCollection, userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data found:", userData);
        // Find the permission for this user
        const permission = permissionsSnapshot.docs.find(doc => doc.data().sharedWith === userId);
        const result = {
          id: userId,
          email: userData.email,
          displayName: userData.displayName,
          permission: permission?.data().permission as SharePermission,
          status: permission?.data().status as 'pending' | 'accepted'
        };
        console.log("User result:", result);
        return result;
      } else {
        console.log("User document not found for:", userId);
      }
      return null;
    });
    
    const users = await Promise.all(usersPromises);
    const filteredUsers = users.filter(user => user !== null);
    console.log("Final result:", filteredUsers);
    
    return filteredUsers as Array<{
      id: string,
      email: string, 
      displayName?: string,
      permission: SharePermission,
      status: 'pending' | 'accepted'
    }>;
    
  } catch (error) {
    console.error("Error getting task list shared users:", error);
    return [];
  }
};
