import { collection, doc, addDoc, query, where, getDocs, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/api/config";
import type { SharePermission, ShareableObjectType } from "@/data/Utils/types";
import type { Permission } from "@/data/Utils/interfaces";

const PERMISSIONS_COLLECTION = "permissions";

/**
 * Generic function to share any object with user
 */
export const shareObjectWithUserApi = async (
  objectId: string,
  objectType: ShareableObjectType,
  targetUserEmail: string,
  permission: SharePermission,
  sharedByUserId: string,
): Promise<void> => {
  try {
    const users = await searchUsersByEmail(targetUserEmail);

    if (users.length === 0) {
      console.error("User not found with email:", targetUserEmail);
      throw new Error("User not found with this email");
    }

    const targetUser = users[0];
    console.log("Target user found:", targetUser);

    // Verify object exists based on type
    //TODO: remove, jsut stick with ShareableObjectType
    // let collection_name: string;
    // switch (objectType) {
    //   case "task_list":
    //     collection_name = "taskLists";
    //     break;
    //   case "event":
    //     collection_name = "events";
    //     break;
    //   case "shopping_list":
    //     collection_name = "shoppingLists";
    //     break;
    //   default:
    //     throw new Error("Invalid object type");
    // }

    // const objectDoc = await getDoc(doc(db, collection_name, objectId));
    // if (!objectDoc.exists()) {
    //   throw new Error(`${objectType} not found in ${collection_name} with ID: ${objectId}`);
    // }

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
 * Get pending shares for user
 */
export const getPendingSharesApi = async (objectType: ShareableObjectType, userId: string): Promise<Permission[]> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(
      permissionsCollection,
      where("object_type", "==", objectType),
      where("user_id", "==", userId),
      where("status", "==", "pending"),
      //orderBy("granted_at", "desc"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Permission),
    );
  } catch (error) {
    console.error("Error getting pending shares:", error);
    return [];
  }
};

/**
 * Accept object invitation
 */
export const acceptObjectInvitationApi = async (permissionId: string): Promise<void> => {
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
// export const getUserPendingNotifications = async (userId: string): Promise<ShareNotification[]> => {
//   try {
//     const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
//     const q = query(
//       permissionsCollection,
//       where("user_id", "==", userId),
//       where("status", "==", "pending"),
//       orderBy("granted_at", "desc"),
//     );

//     const snapshot = await getDocs(q);
//     const notifications: ShareNotification[] = [];

//     for (const permissionDoc of snapshot.docs) {
//       const permissionData = permissionDoc.data() as Permission;

//       // Get object name
//       const objectName = await getObjectName(permissionData.object_type, permissionData.object_id);

//       const notification: ShareNotification = {
//         id: permissionDoc.id,
//         object_id: permissionData.object_id,
//         object_type: permissionData.object_type,
//         object_name: objectName,
//         shared_by: permissionData.granted_by,
//         shared_with: permissionData.user_id,
//         permission: permissionData.role,
//         shared_at: permissionData.granted_at,
//         status: permissionData.status,
//       };

//       notifications.push(notification);
//     }

//     return notifications;
//   } catch (error) {
//     console.error("Error getting pending notifications:", error);
//     return [];
//   }
// };

/**
 * Real-time listener for user's pending notifications (all object types)
 */
// export const listenToUserPendingNotifications = (
//   userId: string,
//   callback: (notifications: ShareNotification[]) => void,
// ) => {
//   const q = query(
//     collection(db, PERMISSIONS_COLLECTION),
//     where("user_id", "==", userId),
//     where("status", "==", "pending"),
//     orderBy("granted_at", "desc"),
//   );

//   return onSnapshot(
//     q,
//     async (snapshot) => {
//       const notifications: ShareNotification[] = [];

//       for (const permissionDoc of snapshot.docs) {
//         const permissionData = permissionDoc.data() as Permission;
//         console.log("listenToUserPendingNotifications - permission data:", permissionData);

//         // Get object name
//         const objectName = await getObjectName(permissionData.object_type, permissionData.object_id);

//         const notification: ShareNotification = {
//           id: permissionDoc.id,
//           object_id: permissionData.object_id,
//           object_type: permissionData.object_type,
//           object_name: objectName,
//           shared_by: permissionData.granted_by,
//           shared_with: permissionData.user_id,
//           permission: permissionData.role,
//           shared_at: permissionData.granted_at,
//           status: permissionData.status,
//         };

//         notifications.push(notification);
//       }

//       callback(notifications);
//     },
//     (error) => {
//       console.error("listenToUserPendingNotifications - error:", error);
//     },
//   );
// };

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
 * Delete all permissions for a specific object
 */
export const deleteAllPermissionsForObject = async (
  objectId: string,
  objectType: ShareableObjectType,
): Promise<void> => {
  try {
    const permissionsCollection = collection(db, PERMISSIONS_COLLECTION);
    const q = query(permissionsCollection, where("object_id", "==", objectId), where("object_type", "==", objectType));

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log(`Deleted ${snapshot.docs.length} permissions for ${objectType}:${objectId}`);
  } catch (error) {
    console.error("Error deleting permissions for object:", error);
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
    status: "pending" | "accepted" | "rejected";
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
          status: permission?.data().status as "pending" | "accepted" | "rejected",
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
      status: "pending" | "accepted" | "rejected";
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
