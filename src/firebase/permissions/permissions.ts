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
} from "firebase/firestore";
import { db } from "../config";
import { Permission, ShareNotification, SharePermission, ShareableObjectType } from "../../data/types";

const PERMISSIONS_COLLECTION = "permissions";

/**
 * Search users by email
 */
const searchUsersByEmail = async (
  email: string,
): Promise<Array<{ id: string; email: string; displayName?: string }>> => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.data().id,
      email: doc.data().email,
      displayName: doc.data().displayName,
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

/**
 * Get object name by type and ID
 */
const getObjectName = async (objectType: ShareableObjectType, objectId: string): Promise<string> => {
  try {
    let collection_name: string;
    let default_name: string;

    switch (objectType) {
      case "task_list":
        collection_name = "taskLists";
        default_name = "Lista zadań";
        break;
      case "event":
        collection_name = "events";
        default_name = "Wydarzenie";
        break;
      case "shopping_list":
        collection_name = "shoppingLists";
        default_name = "Lista zakupów";
        break;
      default:
        return "Obiekt";
    }

    const objectDoc = await getDoc(doc(db, collection_name, objectId));
    if (objectDoc.exists()) {
      const data = objectDoc.data();
      return data.name || data.title || default_name;
    }

    return default_name;
  } catch (error) {
    console.error(`Error fetching ${objectType} name:`, error);
    return "Obiekt";
  }
};

/**
 * Generic function to share any object with user
 */
export const shareObjectWithUser = async (
  objectId: string,
  objectType: ShareableObjectType,
  targetUserEmail: string,
  permission: SharePermission,
  sharedByUserId: string,
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

    // Verify object exists based on type
    let collection_name: string;
    switch (objectType) {
      case "task_list":
        collection_name = "taskLists";
        break;
      case "event":
        collection_name = "events";
        break;
      case "shopping_list":
        collection_name = "shoppingLists";
        break;
      default:
        throw new Error("Invalid object type");
    }

    const objectDoc = await getDoc(doc(db, collection_name, objectId));
    if (!objectDoc.exists()) {
      throw new Error(`${objectType} not found`);
    }

    // Check if permission already exists for this user and object
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const existingQuery = query(
      permissionsCollection,
      where("object_id", "==", objectId),
      where("object_type", "==", objectType),
      where("user_id", "==", targetUser.id),
      where("status", "in", ["pending", "accepted"]),
    );
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      throw new Error("User already has access or pending invitation to this object");
    }

    // Create permission entry
    const permissionEntry: Omit<Permission, "id"> = {
      object_id: objectId,
      object_type: objectType,
      user_id: targetUser.id,
      role: permission,
      granted_by: sharedByUserId,
      granted_at: new Date().toISOString(),
      status: "pending",
    };

    await addDoc(permissionsCollection, permissionEntry);
    console.log("Permission created successfully");
  } catch (error) {
    console.error("Error sharing object:", error);
    throw error;
  }
};

/**
 * Accept object invitation
 */
export const acceptObjectInvitation = async (permissionId: string): Promise<void> => {
  console.log("acceptObjectInvitation called with:", permissionId);

  try {
    // Get permission details to verify it exists
    const permissionDoc = await getDoc(doc(db, PERMISSIONS_COLLECTION, permissionId));
    if (!permissionDoc.exists()) {
      throw new Error("Permission not found");
    }

    // Update permission status to accepted and add accepted_at timestamp
    await updateDoc(permissionDoc.ref, {
      status: "accepted",
      accepted_at: new Date().toISOString(),
    });

    console.log("Permission accepted successfully");
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

/**
 * Reject object invitation
 */
export const rejectObjectInvitation = async (permissionId: string): Promise<void> => {
  try {
    const permissionDoc = doc(db, PERMISSIONS_COLLECTION, permissionId);
    await updateDoc(permissionDoc, {
      status: "rejected",
    });
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    throw error;
  }
};

/**
 * Get pending notifications for user (all object types)
 */
export const getUserPendingNotifications = async (userId: string): Promise<ShareNotification[]> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      permissionsCollection,
      where("user_id", "==", userId),
      where("status", "==", "pending"),
      orderBy("granted_at", "desc"),
    );

    const snapshot = await getDocs(q);
    const notifications: ShareNotification[] = [];

    for (const permissionDoc of snapshot.docs) {
      const permissionData = permissionDoc.data() as Permission;

      // Get object name
      const objectName = await getObjectName(permissionData.object_type, permissionData.object_id);

      const notification: ShareNotification = {
        id: permissionDoc.id,
        object_id: permissionData.object_id,
        object_type: permissionData.object_type,
        object_name: objectName,
        shared_by: permissionData.granted_by,
        shared_with: permissionData.user_id,
        permission: permissionData.role,
        shared_at: permissionData.granted_at,
        status: permissionData.status,
      };

      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error("Error getting pending notifications:", error);
    return [];
  }
};

/**
 * Real-time listener for user's pending notifications (all object types)
 */
export const listenToUserPendingNotifications = (
  userId: string,
  callback: (notifications: ShareNotification[]) => void,
) => {
  const q = query(
    collection(db, PERMISSIONS_COLLECTION),
    where("user_id", "==", userId),
    where("status", "==", "pending"),
    orderBy("granted_at", "desc"),
  );

  return onSnapshot(
    q,
    async (snapshot) => {
      console.log("listenToUserPendingNotifications - snapshot received, docs count:", snapshot.docs.length);

      const notifications: ShareNotification[] = [];

      for (const permissionDoc of snapshot.docs) {
        const permissionData = permissionDoc.data() as Permission;
        console.log("listenToUserPendingNotifications - permission data:", permissionData);

        // Get object name
        const objectName = await getObjectName(permissionData.object_type, permissionData.object_id);

        const notification: ShareNotification = {
          id: permissionDoc.id,
          object_id: permissionData.object_id,
          object_type: permissionData.object_type,
          object_name: objectName,
          shared_by: permissionData.granted_by,
          shared_with: permissionData.user_id,
          permission: permissionData.role,
          shared_at: permissionData.granted_at,
          status: permissionData.status,
        };

        notifications.push(notification);
      }

      callback(notifications);
    },
    (error) => {
      console.error("listenToUserPendingNotifications - error:", error);
    },
  );
};

/**
 * Delete permission/notification
 */
export const deletePermission = async (permissionId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PERMISSIONS_COLLECTION, permissionId));
  } catch (error) {
    console.error("Error deleting permission:", error);
    throw error;
  }
};

/**
 * Revoke access to object - removes user permissions
 */
export const revokeObjectAccess = async (
  objectId: string,
  objectType: ShareableObjectType,
  userId: string,
): Promise<void> => {
  try {
    console.log("Revoking access for user:", userId, "from", objectType, ":", objectId);

    // Find all permissions for this user and object
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const permissionsQuery = query(
      permissionsCollection,
      where("object_id", "==", objectId),
      where("object_type", "==", objectType),
      where("user_id", "==", userId),
      where("status", "in", ["pending", "accepted"]),
    );

    const permissionsSnapshot = await getDocs(permissionsQuery);

    // Update all permissions to "revoked" status for audit trail
    const updatePromises = permissionsSnapshot.docs.map((doc) => updateDoc(doc.ref, { status: "revoked" }));
    await Promise.all(updatePromises);

    console.log("Updated", permissionsSnapshot.docs.length, "permissions to revoked status");
  } catch (error) {
    console.error("Error revoking object access:", error);
    throw error;
  }
};

/**
 * Get users with access to an object
 */
export const getObjectSharedUsers = async (
  objectId: string,
  objectType: ShareableObjectType,
): Promise<
  Array<{
    id: string;
    email: string;
    displayName?: string;
    permission: SharePermission;
    status: "pending" | "accepted" | "rejected" | "revoked";
  }>
> => {
  try {
    // Get all permissions for this object
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const permissionsQuery = query(
      permissionsCollection,
      where("object_id", "==", objectId),
      where("object_type", "==", objectType),
      where("status", "in", ["pending", "accepted"]),
    );

    console.log("Executing permissions query...");
    const permissionsSnapshot = await getDocs(permissionsQuery);
    console.log("Permissions found:", permissionsSnapshot.docs.length);

    permissionsSnapshot.docs.forEach((doc) => {
      console.log("Permission doc:", doc.id, doc.data());
    });

    // Get unique user IDs
    const userIds = [...new Set(permissionsSnapshot.docs.map((doc) => doc.data().user_id))];
    console.log("Unique user IDs:", userIds);

    if (userIds.length === 0) {
      console.log("No user IDs found, returning empty array");
      return [];
    }

    // Get user details
    const usersCollection = collection(db, "users");
    const usersPromises = userIds.map(async (userId) => {
      console.log("Fetching user data for:", userId);

      // Query for user document where the 'id' field equals userId
      const userQuery = query(usersCollection, where("id", "==", userId));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        console.log("User data found:", userData);

        // Find the permission for this user
        const permission = permissionsSnapshot.docs.find((doc) => doc.data().user_id === userId);
        const result = {
          id: userId,
          email: userData.email,
          displayName: userData.displayName,
          permission: permission?.data().role as SharePermission,
          status: permission?.data().status as "pending" | "accepted" | "rejected" | "revoked",
        };
        console.log("User result:", result);
        return result;
      } else {
        console.log("User document not found for:", userId);
      }
      return null;
    });

    const users = await Promise.all(usersPromises);
    const filteredUsers = users.filter((user) => user !== null);
    console.log("Final result:", filteredUsers);

    return filteredUsers as Array<{
      id: string;
      email: string;
      displayName?: string;
      permission: SharePermission;
      status: "pending" | "accepted" | "rejected" | "revoked";
    }>;
  } catch (error) {
    console.error("Error getting object shared users:", error);
    return [];
  }
};

/**
 * Get shared objects for user by type
 */
export const getUserSharedObjects = async (userId: string, objectType: ShareableObjectType): Promise<string[]> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      permissionsCollection,
      where("user_id", "==", userId),
      where("object_type", "==", objectType),
      where("status", "==", "accepted"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().object_id);
  } catch (error) {
    console.error("Error getting user shared objects:", error);
    return [];
  }
};

/**
 * Check if user has access to object
 */
export const hasUserAccessToObject = async (
  userId: string,
  objectId: string,
  objectType: ShareableObjectType,
): Promise<{ hasAccess: boolean; permission?: SharePermission }> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      permissionsCollection,
      where("user_id", "==", userId),
      where("object_id", "==", objectId),
      where("object_type", "==", objectType),
      where("status", "==", "accepted"),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { hasAccess: false };
    }

    const permissionData = snapshot.docs[0].data();
    return {
      hasAccess: true,
      permission: permissionData.role as SharePermission,
    };
  } catch (error) {
    console.error("Error checking user access:", error);
    return { hasAccess: false };
  }
};
