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
  orderBy 
} from "firebase/firestore";
import { db } from "./config";
import { TaskListPermission, SharePermission } from "../data/types";

const PERMISSIONS_COLLECTION = "task_list_permissions";

// Simple user interface for search results
interface UserSearchResult {
  id: string;
  email: string;
  displayName?: string;
}

/**
 * Search users by email
 */
const searchUsersByEmail = async (email: string): Promise<UserSearchResult[]> => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      displayName: doc.data().displayName
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

/**
 * Share task list with user - creates permission entry
 */
export const shareTaskListWithUser = async (
  listId: string,
  targetUserEmail: string,
  role: SharePermission,
  grantedByUserId: string
): Promise<void> => {
  console.log("shareTaskListWithUser called with:", { listId, targetUserEmail, role, grantedByUserId });
  
  try {
    // First, find the target user by email (assuming we have this function)
    console.log("Searching for user with email:", targetUserEmail);
    const users = await searchUsersByEmail(targetUserEmail);
    console.log("Found users:", users);
    
    if (users.length === 0) {
      console.error("User not found with email:", targetUserEmail);
      throw new Error("User not found with this email");
    }
    
    const targetUser = users[0];
    console.log("Target user found:", targetUser);
    
    // Check if permission already exists
    console.log("Checking existing permissions for listId:", listId, "userId:", targetUser.id);
    const existingPermission = await getTaskListPermission(listId, targetUser.id);
    console.log("Existing permission:", existingPermission);
    
    if (existingPermission) {
      console.error("User already has access to this list");
      throw new Error("User already has access to this list");
    }
    
    // Create permission entry
    const permission: Omit<TaskListPermission, 'id'> = {
      list_id: listId,
      user_id: targetUser.id,
      role,
      granted_by: grantedByUserId,
      granted_at: new Date().toISOString(),
      status: "pending"
    };
    
    console.log("Creating permission entry:", permission);
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const docRef = await addDoc(permissionsCollection, permission);
    console.log("Permission created with ID:", docRef.id);
    
  } catch (error) {
    console.error("Error sharing task list:", error);
    throw error;
  }
};

/**
 * Get all permissions for a specific task list
 */
export const getTaskListPermissions = async (listId: string): Promise<TaskListPermission[]> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      permissionsCollection, 
      where("list_id", "==", listId),
      where("status", "==", "accepted")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TaskListPermission[];
    
  } catch (error) {
    console.error("Error getting task list permissions:", error);
    throw error;
  }
};

/**
 * Get specific permission for user and list
 */
export const getTaskListPermission = async (
  listId: string, 
  userId: string
): Promise<TaskListPermission | null> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      permissionsCollection,
      where("list_id", "==", listId),
      where("user_id", "==", userId)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as TaskListPermission;
    
  } catch (error) {
    console.error("Error getting task list permission:", error);
    return null;
  }
};

/**
 * Get all task lists that user has access to (owned + shared)
 */
export const getUserTaskListIds = async (userId: string): Promise<string[]> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      permissionsCollection,
      where("user_id", "==", userId),
      where("status", "==", "accepted")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().list_id as string);
    
  } catch (error) {
    console.error("Error getting user task list IDs:", error);
    return [];
  }
};

/**
 * Get pending invitations for user
 */
export const getUserPendingInvitations = async (userId: string): Promise<TaskListPermission[]> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      permissionsCollection,
      where("user_id", "==", userId),
      where("status", "==", "pending"),
      orderBy("granted_at", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TaskListPermission[];
    
  } catch (error) {
    console.error("Error getting pending invitations:", error);
    return [];
  }
};

/**
 * Accept task list invitation
 */
export const acceptTaskListInvitation = async (permissionId: string): Promise<void> => {
  try {
    const permissionDoc = doc(db, PERMISSIONS_COLLECTION, permissionId);
    await updateDoc(permissionDoc, {
      status: "accepted",
      accepted_at: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

/**
 * Reject task list invitation
 */
export const rejectTaskListInvitation = async (permissionId: string): Promise<void> => {
  try {
    const permissionDoc = doc(db, PERMISSIONS_COLLECTION, permissionId);
    await updateDoc(permissionDoc, {
      status: "rejected"
    });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    throw error;
  }
};

/**
 * Update user's permission level for a task list
 */
export const updateTaskListPermission = async (
  permissionId: string,
  newRole: SharePermission
): Promise<void> => {
  try {
    const permissionDoc = doc(db, PERMISSIONS_COLLECTION, permissionId);
    await updateDoc(permissionDoc, {
      role: newRole
    });
  } catch (error) {
    console.error("Error updating permission:", error);
    throw error;
  }
};

/**
 * Remove user's access to task list
 */
export const removeTaskListPermission = async (permissionId: string): Promise<void> => {
  try {
    const permissionDoc = doc(db, PERMISSIONS_COLLECTION, permissionId);
    await deleteDoc(permissionDoc);
  } catch (error) {
    console.error("Error removing permission:", error);
    throw error;
  }
};

/**
 * Real-time listener for user's pending invitations
 */
export const listenToUserPendingInvitations = (
  userId: string,
  callback: (invitations: TaskListPermission[]) => void
) => {
  console.log("listenToUserPendingInvitations - setting up listener for userId:", userId);
  
  const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
  const q = query(
    permissionsCollection,
    where("user_id", "==", userId),
    where("status", "==", "pending"),
    orderBy("granted_at", "desc")
  );
  
  console.log("listenToUserPendingInvitations - query created, attaching listener");
  
  return onSnapshot(q, (snapshot) => {
    console.log("listenToUserPendingInvitations - snapshot received, docs count:", snapshot.docs.length);
    const invitations = snapshot.docs.map(doc => {
      const data = {
        id: doc.id,
        ...doc.data()
      } as TaskListPermission;
      console.log("listenToUserPendingInvitations - doc data:", data);
      return data;
    });
    console.log("listenToUserPendingInvitations - calling callback with invitations:", invitations);
    callback(invitations);
  }, (error) => {
    console.error("listenToUserPendingInvitations - error:", error);
  });
};

/**
 * Real-time listener for all user's permissions (all statuses)
 */
export const listenToUserPermissions = (
  userId: string,
  callback: (permissions: TaskListPermission[]) => void
) => {
  const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
  const q = query(
    permissionsCollection,
    where("user_id", "==", userId),
    orderBy("granted_at", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const permissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TaskListPermission[];
    callback(permissions);
  });
};
