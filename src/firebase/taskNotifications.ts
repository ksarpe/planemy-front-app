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
  arrayUnion 
} from "firebase/firestore";
import { db } from "./config";
import { TaskListNotification, SharePermission } from "../data/types";

const NOTIFICATIONS_COLLECTION = "task_list_notifications";

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
    const currentUserIds = taskListData.userIds || [];
    if (currentUserIds.includes(targetUser.id)) {
      throw new Error("User already has access to this list");
    }
    
    // Check if notification already exists
    const notificationsCollection = collection(db, NOTIFICATIONS_COLLECTION);
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
    const notificationDoc = await getDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId));
    if (!notificationDoc.exists()) {
      throw new Error("Notification not found");
    }
    
    const notification = notificationDoc.data() as TaskListNotification;
    
    // Add user to task list userIds
    const taskListRef = doc(db, "taskLists", notification.listId);
    await updateDoc(taskListRef, {
      userIds: arrayUnion(notification.sharedWith)
    });
    console.log("User added to task list userIds");
    
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
    const notificationDoc = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
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
    const notificationsCollection = collection(db, NOTIFICATIONS_COLLECTION);
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
    collection(db, NOTIFICATIONS_COLLECTION),
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
    await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId));
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
