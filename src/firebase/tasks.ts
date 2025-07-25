import { useEffect, useState } from "react";
import { db } from "./config";
import { collection, onSnapshot, doc, deleteDoc, addDoc, query, where, updateDoc, arrayUnion, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { TaskInterface, TaskListInterface, LabelInterface, UserProfile, SharedTaskList, SharePermission, TaskListNotification } from "../data/types";

// Hook to get user's task lists (own + shared)
export const useUserTaskLists = (): TaskListInterface[] => {
    const [taskLists, setTaskLists] = useState<TaskListInterface[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setTaskLists([]);
            return;
        }

        const taskListsCollection = collection(db, "taskLists");
        
        // Query for lists where user is owner OR user is in userIds array
        const ownListsQuery = query(taskListsCollection, where("userId", "==", user.uid));
        const sharedListsQuery = query(taskListsCollection, where("userIds", "array-contains", user.uid));
        
        let ownLists: TaskListInterface[] = [];
        let sharedLists: TaskListInterface[] = [];
        
        // Listen to own lists
        const unsubscribeOwn = onSnapshot(ownListsQuery, (snapshot) => {
            ownLists = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as TaskListInterface[];
            
            setTaskLists([...ownLists, ...sharedLists]);
        });
        
        // Listen to shared lists
        const unsubscribeShared = onSnapshot(sharedListsQuery, (snapshot) => {
            sharedLists = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as TaskListInterface[];
            
            setTaskLists([...ownLists, ...sharedLists]);
        });

        return () => {
            unsubscribeOwn();
            unsubscribeShared();
        };
    }, [user]);

    return taskLists;
};

// Hook to get user's labels
export const useUserLabels = (): LabelInterface[] => {
    const [labels, setLabels] = useState<LabelInterface[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setLabels([]);
            return;
        }

        const labelsCollection = collection(db, "labels");
        const userLabelsQuery = query(labelsCollection, where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(userLabelsQuery, (snapshot) => {
            const labelList: LabelInterface[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as LabelInterface[];

            setLabels(labelList);
        });

        return () => {
            unsubscribe();
        };
    }, [user]);

    return labels;
};

// Create a new task list
export const createTaskList = async (name: string, userId: string): Promise<void> => {
    try {
        const taskListsCollection = collection(db, "taskLists");
        const newTaskList = {
            name,
            tasks: [],
            labels: [],
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
        const taskListDocRef = doc(db, "taskLists", listId);
        await updateDoc(taskListDocRef, updates);
    } catch (error) {
        console.error("Error updating task list:", error);
        throw error;
    }
};

// Delete task list
export const deleteTaskList = async (listId: string): Promise<void> => {
    try {
        const taskListDocRef = doc(db, "taskLists", listId);
        await deleteDoc(taskListDocRef);
    } catch (error) {
        console.error("Error deleting task list:", error);
        throw error;
    }
};

// Add task to list
export const addTaskToList = async (
    listId: string, 
    title: string, 
    userId: string,
    description?: string | null, 
    dueDate?: string | null,
    labels?: LabelInterface[]
): Promise<void> => {
    try {
        const taskListDocRef = doc(db, "taskLists", listId);
        const newTask: TaskInterface = {
            id: crypto.randomUUID(),
            title,
            description: description || "",
            dueDate: dueDate || "",
            isCompleted: false,
            labels: labels || [],
            userId,
        };
        
        await updateDoc(taskListDocRef, {
            tasks: arrayUnion(newTask)
        });
    } catch (error) {
        console.error("Error adding task to list:", error);
        throw error;
    }
};

// Update task in list
export const updateTaskInList = async (
    listId: string, 
    taskId: string, 
    updates: Partial<TaskInterface>
): Promise<void> => {
    try {
        // This requires getting the current list, updating the specific task, and saving back
        // Due to Firestore limitations with array updates, we need to replace the entire tasks array
        const { getDoc } = await import("firebase/firestore");
        const taskListDocRef = doc(db, "taskLists", listId);
        const listSnapshot = await getDoc(taskListDocRef);
        
        if (listSnapshot.exists()) {
            const currentList = listSnapshot.data() as TaskListInterface;
            const updatedTasks = currentList.tasks.map(task => 
                task.id === taskId ? { ...task, ...updates } : task
            );
            
            await updateDoc(taskListDocRef, {
                tasks: updatedTasks
            });
        }
    } catch (error) {
        console.error("Error updating task in list:", error);
        throw error;
    }
};

// Remove task from list
export const removeTaskFromList = async (listId: string, taskId: string): Promise<void> => {
    try {
        const { getDoc } = await import("firebase/firestore");
        const taskListDocRef = doc(db, "taskLists", listId);
        const listSnapshot = await getDoc(taskListDocRef);
        
        if (listSnapshot.exists()) {
            const currentList = listSnapshot.data() as TaskListInterface;
            const updatedTasks = currentList.tasks.filter(task => task.id !== taskId);
            
            await updateDoc(taskListDocRef, {
                tasks: updatedTasks
            });
        }
    } catch (error) {
        console.error("Error removing task from list:", error);
        throw error;
    }
};

// Toggle task completion
export const toggleTaskCompletion = async (listId: string, taskId: string): Promise<void> => {
    try {
        const { getDoc } = await import("firebase/firestore");
        const taskListDocRef = doc(db, "taskLists", listId);
        const listSnapshot = await getDoc(taskListDocRef);
        
        if (listSnapshot.exists()) {
            const currentList = listSnapshot.data() as TaskListInterface;
            const updatedTasks = currentList.tasks.map(task => 
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            );
            
            await updateDoc(taskListDocRef, {
                tasks: updatedTasks
            });
        }
    } catch (error) {
        console.error("Error toggling task completion:", error);
        throw error;
    }
};

// Create label
export const createLabel = async (name: string, color: string, userId: string, description?: string): Promise<void> => {
    try {
        const labelsCollection = collection(db, "labels");
        const newLabel = {
            name,
            color,
            description,
            userId,
        };
        
        await addDoc(labelsCollection, newLabel);
    } catch (error) {
        console.error("Error creating label:", error);
        throw error;
    }
};

// Update label
export const updateLabel = async (labelId: string, updates: Partial<LabelInterface>): Promise<void> => {
    try {
        const labelDocRef = doc(db, "labels", labelId);
        await updateDoc(labelDocRef, updates);
    } catch (error) {
        console.error("Error updating label:", error);
        throw error;
    }
};

// Delete label
export const deleteLabel = async (labelId: string): Promise<void> => {
    try {
        const labelDocRef = doc(db, "labels", labelId);
        await deleteDoc(labelDocRef);
    } catch (error) {
        console.error("Error deleting label:", error);
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
        
        return snapshot.docs.map(doc => doc.data() as UserProfile);
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
    sharedByUserId: string
): Promise<void> => {
    console.log("tasks.ts shareTaskListWithUser called:", { listId, targetUserEmail, permission, sharedByUserId });
    try {
        const { shareTaskListWithUser: newShareFunction } = await import("./taskNotifications");
        console.log("Calling taskNotifications.shareTaskListWithUser");
        await newShareFunction(listId, targetUserEmail, permission, sharedByUserId);
        console.log("taskNotifications.shareTaskListWithUser completed successfully");
    } catch (error) {
        console.error("Error sharing task list:", error);
        throw error;
    }
};

// Accept shared task list - now uses notifications collection
export const acceptSharedTaskList = async (shareId: string): Promise<void> => {
    try {
        const { acceptTaskListInvitation } = await import("./taskNotifications");
        await acceptTaskListInvitation(shareId);
    } catch (error) {
        console.error("Error accepting shared task list:", error);
        throw error;
    }
};

// Reject shared task list - now uses notifications collection
export const rejectSharedTaskList = async (shareId: string): Promise<void> => {
    try {
        const { rejectTaskListInvitation } = await import("./taskNotifications");
        await rejectTaskListInvitation(shareId);
    } catch (error) {
        console.error("Error rejecting shared task list:", error);
        throw error;
    }
};

// Remove user from shared task list - now uses permissions collection
export const removeUserFromSharedList = async (listId: string, userId: string): Promise<void> => {
    try {
        const { removeTaskListPermission, getTaskListPermission } = await import("./taskPermissions");
        const permission = await getTaskListPermission(listId, userId);
        if (permission && permission.id) {
            await removeTaskListPermission(permission.id);
        }
    } catch (error) {
        console.error("Error removing user from shared list:", error);
        throw error;
    }
};

// Update user permission for shared list - now uses permissions collection  
export const updateUserPermission = async (
    listId: string, 
    userId: string, 
    newPermission: SharePermission
): Promise<void> => {
    try {
        const { updateTaskListPermission, getTaskListPermission } = await import("./taskPermissions");
        const permission = await getTaskListPermission(listId, userId);
        if (permission && permission.id) {
            await updateTaskListPermission(permission.id, newPermission);
        }
    } catch (error) {
        console.error("Error updating user permission:", error);
        throw error;
    }
};

// Get pending share invitations for user
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
                const { listenToUserPendingNotifications } = await import("./taskNotifications");
                
                console.log("Setting up pending notifications listener for user:", user.uid);
                unsubscribe = listenToUserPendingNotifications(user.uid, (notifications: TaskListNotification[]) => {
                    console.log("useUserPendingShares - notifications received:", notifications);
                    // Convert TaskListNotification to SharedTaskList format for compatibility
                    const sharedTaskLists = notifications.map((notification: TaskListNotification) => ({
                        id: notification.id,
                        listId: notification.listId,
                        sharedBy: notification.sharedBy,
                        permission: notification.permission,
                        sharedAt: notification.sharedAt,
                        acceptedAt: undefined,
                    })) as SharedTaskList[];
                    
                    console.log("useUserPendingShares - converted to SharedTaskList:", sharedTaskLists);
                    setPendingShares(sharedTaskLists);
                });
                
                console.log("Pending notifications listener set up successfully");
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