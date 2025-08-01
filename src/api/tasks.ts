import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./config";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  query,
  where,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuthContext";

import type { TaskInterface, TaskListInterface, SharedTaskList } from "@/data/Tasks/interfaces";
import type { ShareNotification } from "@/data/Utils/interfaces";
import type { SharePermission } from "@/data/Utils/types";
import type { UserProfile } from "@/data/User/interfaces";

// Hook to get user's task lists (own + shared via permissions)
export const useUserTaskLists = (): TaskListInterface[] => {
  const [taskLists, setTaskLists] = useState<TaskListInterface[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTaskLists([]);
      return;
    }

    const taskListsCollection = collection(db, "taskLists");

    // First, get all accepted permissions for this user from the generic permissions system
    const permissionsQuery = query(
      collection(db, "permissions"),
      where("user_id", "==", user.uid),
      where("object_type", "==", "task_list"),
      where("status", "==", "accepted"),
    );

    const unsubscribePermissions = onSnapshot(permissionsQuery, async (permissionsSnapshot) => {
      const permissions = permissionsSnapshot.docs.map((doc) => doc.data());
      const listIds = permissions.map((p) => p.object_id); // Changed from list_id to object_id

      // Also get lists where user is owner
      const ownListsQuery = query(taskListsCollection, where("userId", "==", user.uid));

      const unsubscribeOwn = onSnapshot(ownListsQuery, async (ownListsSnapshot) => {
        const ownLists = ownListsSnapshot.docs.map((doc) => ({
          id: doc.data().id || doc.id,
          ...doc.data(),
        })) as TaskListInterface[];

        // Get shared lists by IDs from permissions
        let sharedLists: TaskListInterface[] = [];
        if (listIds.length > 0) {
          const sharedListsPromises = listIds.map(async (listId) => {
            const listDoc = await getDoc(doc(taskListsCollection, listId));
            if (listDoc.exists()) {
              return {
                id: listDoc.id,
                ...listDoc.data(),
                shared: true,
              } as TaskListInterface;
            }
            return null;
          });

          const resolvedSharedLists = await Promise.all(sharedListsPromises);
          sharedLists = resolvedSharedLists.filter((list) => list !== null) as TaskListInterface[];
        }

        // Combine own and shared lists, remove duplicates
        const allLists = [...ownLists, ...sharedLists];
        const uniqueLists = allLists.filter((list, index, self) => index === self.findIndex((l) => l.id === list.id));

        setTaskLists(uniqueLists);
      });

      return unsubscribeOwn;
    });

    return unsubscribePermissions;
  }, [user]);

  return taskLists;
};

// Create a new task list
export const createTaskList = async (name: string, userId: string): Promise<void> => {
  try {
    const taskListsCollection = collection(db, "taskLists");
    const newTaskList: TaskListInterface = {
      id: uuidv4(),
      name,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addDoc(taskListsCollection, newTaskList);
  } catch (error) {
    console.error("Error creating task list:", error);
    throw error;
  }
};

// Update task list
export const updateTaskList = async (listId: string, updates: Partial<TaskListInterface>): Promise<void> => {
  try {
    const taskListsCollection = collection(db, "taskLists");
    const taskListQuery = query(taskListsCollection, where("id", "==", listId));
    const snapshot = await getDocs(taskListQuery);

    if (!snapshot.empty) {
      const taskListDoc = snapshot.docs[0];
      await updateDoc(taskListDoc.ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
    
  } catch (error) {
    console.error("Error updating task list:", error);
    throw error;
  }
};

// Delete task list
export const deleteTaskList = async (listId: string): Promise<void> => {
  try {
    const taskListsCollection = collection(db, "taskLists");
    const taskListQuery = query(taskListsCollection, where("id", "==", listId));
    const snapshot = await getDocs(taskListQuery);

    if (!snapshot.empty) {
      const taskListDoc = snapshot.docs[0];
      await deleteDoc(taskListDoc.ref);
    }
  } catch (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
};

// Add task to list - now creates task in separate collection
export const addTaskToList = async (
  listId: string,
  title: string,
  userId: string,
  description?: string | null,
  dueDate?: string | null,
): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const newTask: TaskInterface = {
      id: uuidv4(),
      title,
      description: description || "",
      dueDate: dueDate || "",
      isCompleted: false,
      userId,
      taskListId: listId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addDoc(tasksCollection, newTask);
  } catch (error) {
    console.error("Error adding task to list:", error);
    throw error;
  }
};

// Update task - now updates task in tasks collection
export const updateTaskInList = async (taskId: string, updates: Partial<TaskInterface>): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const taskQuery = query(tasksCollection, where("id", "==", taskId));
    const snapshot = await getDocs(taskQuery);

    if (!snapshot.empty) {
      const taskDoc = snapshot.docs[0];
      await updateDoc(taskDoc.ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Remove task from list - now deletes task from tasks collection
export const removeTaskFromList = async (taskId: string): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const taskQuery = query(tasksCollection, where("id", "==", taskId));
    console.log(taskId)
    const snapshot = await getDocs(taskQuery);

    if (!snapshot.empty) {
      const taskDoc = snapshot.docs[0];
      await deleteDoc(taskDoc.ref);
    }
  } catch (error) {
    console.error("Error removing task from list:", error);
    throw error;
  }
};

// Toggle task completion - now updates task in tasks collection
export const toggleTaskCompletion = async (taskId: string): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const taskQuery = query(tasksCollection, where("id", "==", taskId));
    const snapshot = await getDocs(taskQuery);

    if (!snapshot.empty) {
      const currentTask = snapshot.docs[0].data() as TaskInterface;
      await updateDoc(snapshot.docs[0].ref, {
        isCompleted: !currentTask.isCompleted,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};

// Clear completed tasks from a list
export const clearCompletedTasks = async (listId: string): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const completedTasksQuery = query(
      tasksCollection,
      where("taskListId", "==", listId),
      where("isCompleted", "==", true),
    );

    const snapshot = await getDocs(completedTasksQuery);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing completed tasks:", error);
    throw error;
  }
};

// Uncheck all tasks in a list
export const uncheckAllTasks = async (listId: string): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const completedTasksQuery = query(
      tasksCollection,
      where("taskListId", "==", listId),
      where("isCompleted", "==", true),
    );

    const snapshot = await getDocs(completedTasksQuery);
    const updatePromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        isCompleted: false,
        updatedAt: new Date().toISOString(),
      }),
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error unchecking all tasks:", error);
    throw error;
  }
};

// SHARING SYSTEM FUNCTIONS

// Function to create user profile (called when user registers)
// export const createUserProfile = async (userId: string, email: string, displayName?: string): Promise<void> => {
//     try {
//         const userProfile: UserProfile = {
//             id: userId,
//             email,
//             displayName,
//             createdAt: new Date().toISOString(),
//         };

//         await setDoc(doc(db, "users", userId), userProfile);
//     } catch (error) {
//         console.error("Error creating user profile:", error);
//         throw error;
//     }
// };

// Search users by email
export const searchUsersByEmail = async (email: string): Promise<UserProfile[]> => {
  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(userQuery);

    return snapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// Share task list with another user - now uses notifications collection
export const shareTaskListWithUser = async (
  listId: string,
  targetUserEmail: string,
  permission: SharePermission,
  sharedByUserId: string,
): Promise<void> => {
  try {
    const { shareTaskListWithUser: newShareFunction } = await import("./permissions/taskPermissions");
    await newShareFunction(listId, targetUserEmail, permission, sharedByUserId);
  } catch (error) {
    console.error("Error sharing task list:", error);
    throw error;
  }
};

// Accept shared task list - now uses notifications collection
export const acceptSharedTaskList = async (shareId: string): Promise<void> => {
  try {
    const { acceptTaskListInvitation } = await import("./permissions/taskPermissions");
    await acceptTaskListInvitation(shareId);
  } catch (error) {
    console.error("Error accepting shared task list:", error);
    throw error;
  }
};

// Reject shared task list - now uses notifications collection
export const rejectSharedTaskList = async (shareId: string): Promise<void> => {
  try {
    const { rejectTaskListInvitation } = await import("./permissions/taskPermissions");
    await rejectTaskListInvitation(shareId);
  } catch (error) {
    console.error("Error rejecting shared task list:", error);
    throw error;
  }
};

// Revoke access to shared task list
export const revokeTaskListAccess = async (listId: string, userId: string): Promise<void> => {
  try {
    const { revokeTaskListAccess: revokeAccess } = await import("./permissions/taskPermissions");
    await revokeAccess(listId, userId);
  } catch (error) {
    console.error("Error revoking task list access:", error);
    throw error;
  }
};

// Get users with access to task list
export const getTaskListSharedUsers = async (listId: string) => {
  try {
    const { getTaskListSharedUsers: getSharedUsers } = await import("./permissions/taskPermissions");
    return await getSharedUsers(listId);
  } catch (error) {
    console.error("Error getting shared users:", error);
    return [];
  }
};

// Get pending share invitations for user - now uses notifications collection
export const useUserPendingShares = (): SharedTaskList[] => {
  const [pendingShares, setPendingShares] = useState<SharedTaskList[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setPendingShares([]);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      try {
        const { listenToUserPendingNotifications } = await import("./permissions/taskPermissions");

        unsubscribe = listenToUserPendingNotifications(user.uid, (notifications: ShareNotification[]) => {
          // Convert TaskListNotification to SharedTaskList format for compatibility
          const sharedTaskLists = notifications.map((notification: ShareNotification) => ({
            id: notification.id,
            listId: notification.object_id,
            sharedBy: notification.shared_by,
            permission: notification.permission,
            sharedAt: notification.shared_at,
            acceptedAt: "",
          })) as SharedTaskList[];

          setPendingShares(sharedTaskLists);
        });
      } catch (error) {
        console.error("Error setting up pending notifications listener:", error);
      }
    };

    setupListener();

    return () => {
      console.log("Cleaning up pending notifications listener");
      unsubscribe?.();
    };
  }, [user]);

  return pendingShares;
};
