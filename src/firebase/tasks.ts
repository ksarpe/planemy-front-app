import { useEffect, useState } from "react";
import { db } from "./config";
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, query, where, updateDoc, arrayUnion, serverTimestamp, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { TaskInterface, TaskListInterface, LabelInterface, UserProfile, SharedTaskList, SharePermission } from "../data/types";

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
        
        // Query for own lists
        const ownTaskListsQuery = query(taskListsCollection, where("userId", "==", user.uid));
        
        // Query for shared lists
        const sharedTaskListsQuery = query(taskListsCollection, where("sharedWith", "array-contains", {
            userId: user.uid,
            permission: "view" // This will be expanded later
        }));

        let ownLists: TaskListInterface[] = [];
        let sharedLists: TaskListInterface[] = [];

        // Listen to own lists
        const unsubscribeOwn = onSnapshot(ownTaskListsQuery, (snapshot) => {
            ownLists = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                isShared: false,
            })) as TaskListInterface[];
            
            // Combine and update
            setTaskLists([...ownLists, ...sharedLists]);
        });

        // Listen to shared lists
        const unsubscribeShared = onSnapshot(sharedTaskListsQuery, (snapshot) => {
            sharedLists = snapshot.docs.map((doc) => {
                const data = doc.data();
                // Find user's permission level
                const userShare = data.sharedWith?.find((share: SharedTaskList) => share.sharedWith === user.uid);
                
                return {
                    id: doc.id,
                    ...data,
                    isShared: true,
                    originalOwner: data.userId,
                    permission: userShare?.permission || "view",
                } as TaskListInterface;
            });
            
            // Combine and update
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
            sharedWith: [],
            userId,
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
export const createUserProfile = async (userId: string, email: string, displayName?: string): Promise<void> => {
    try {
        const userProfile: UserProfile = {
            id: userId,
            email,
            displayName,
            createdAt: new Date().toISOString(),
        };
        
        await setDoc(doc(db, "users", userId), userProfile);
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

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

// Share task list with another user
export const shareTaskListWithUser = async (
    listId: string, 
    targetUserEmail: string, 
    permission: SharePermission,
    sharedByUserId: string
): Promise<void> => {
    try {
        // First, find the target user by email
        const users = await searchUsersByEmail(targetUserEmail);
        if (users.length === 0) {
            throw new Error("User not found with this email");
        }
        
        const targetUser = users[0];
        
        // Create shared entry
        const shareEntry: SharedTaskList = {
            listId,
            sharedBy: sharedByUserId,
            sharedWith: targetUser.id,
            permission,
            sharedAt: new Date().toISOString(),
        };
        console.log('Share entry:', shareEntry);
        // Update the task list to include the share
        const taskListDocRef = doc(db, "taskLists", listId);
        await updateDoc(taskListDocRef, {
            sharedWith: arrayUnion(shareEntry)
        });
        
        // Also create a notification/invitation document
        const invitationCollection = collection(db, "shareInvitations");
        await addDoc(invitationCollection, {
            ...shareEntry,
            status: "pending",
            createdAt: new Date().toISOString(),
        });
        
    } catch (error) {
        console.error("Error sharing task list:", error);
        throw error;
    }
};

// Accept shared task list
export const acceptSharedTaskList = async (shareId: string): Promise<void> => {
    try {
        // Update invitation status
        const invitationDocRef = doc(db, "shareInvitations", shareId);
        await updateDoc(invitationDocRef, {
            status: "accepted",
            acceptedAt: new Date().toISOString(),
        });
        
        // The task list should already be accessible through the updated query
    } catch (error) {
        console.error("Error accepting shared task list:", error);
        throw error;
    }
};

// Reject shared task list
export const rejectSharedTaskList = async (shareId: string): Promise<void> => {
    try {
        const invitationDocRef = doc(db, "shareInvitations", shareId);
        await updateDoc(invitationDocRef, {
            status: "rejected",
            rejectedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error rejecting shared task list:", error);
        throw error;
    }
};

// Remove user from shared task list
export const removeUserFromSharedList = async (listId: string, userId: string): Promise<void> => {
    try {
        const { getDoc } = await import("firebase/firestore");
        const taskListDocRef = doc(db, "taskLists", listId);
        const listSnapshot = await getDoc(taskListDocRef);
        
        if (listSnapshot.exists()) {
            const currentList = listSnapshot.data() as TaskListInterface;
            const updatedSharedWith = currentList.sharedWith.filter(
                share => share.sharedWith !== userId
            );
            
            await updateDoc(taskListDocRef, {
                sharedWith: updatedSharedWith
            });
        }
    } catch (error) {
        console.error("Error removing user from shared list:", error);
        throw error;
    }
};

// Update user permission for shared list
export const updateUserPermission = async (
    listId: string, 
    userId: string, 
    newPermission: SharePermission
): Promise<void> => {
    try {
        const { getDoc } = await import("firebase/firestore");
        const taskListDocRef = doc(db, "taskLists", listId);
        const listSnapshot = await getDoc(taskListDocRef);
        
        if (listSnapshot.exists()) {
            const currentList = listSnapshot.data() as TaskListInterface;
            const updatedSharedWith = currentList.sharedWith.map(share => 
                share.sharedWith === userId 
                    ? { ...share, permission: newPermission }
                    : share
            );
            
            await updateDoc(taskListDocRef, {
                sharedWith: updatedSharedWith
            });
        }
    } catch (error) {
        console.error("Error updating user permission:", error);
        throw error;
    }
};

// Get pending share invitations for user
export const useUserPendingShares = (): SharedTaskList[] => {
    const [pendingShares, setPendingShares] = useState<SharedTaskList[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setPendingShares([]);
            return;
        }

        const invitationsCollection = collection(db, "shareInvitations");
        const pendingQuery = query(
            invitationsCollection, 
            where("sharedWith", "==", user.uid),
            where("status", "==", "pending")
        );

        const unsubscribe = onSnapshot(pendingQuery, (snapshot) => {
            const invitations = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    listId: data.listId,
                    sharedBy: data.sharedBy,
                    sharedWith: data.sharedWith,
                    permission: data.permission,
                    sharedAt: data.sharedAt,
                    acceptedAt: data.acceptedAt,
                } as SharedTaskList;
            });

            setPendingShares(invitations);
        });

        return () => {
            unsubscribe();
        };
    }, [user]);

    return pendingShares;
};

// Create default "Shared" task list for user if it doesn't exist
export const createDefaultSharedList = async (userId: string): Promise<string> => {
    try {
        const taskListsCollection = collection(db, "taskLists");
        const newTaskList = {
            name: "Współdzielone",
            tasks: [],
            labels: [],
            sharedWith: [],
            userId,
        };
        
        const docRef = await addDoc(taskListsCollection, newTaskList);
        return docRef.id;
    } catch (error) {
        console.error("Error creating default shared list:", error);
        throw error;
    }
};

// Legacy functions for backwards compatibility
export interface Task {
  completed: boolean;
  description: string;
  dueDate: string;
  id: string;
  title: string;
  priority?: 'low' | 'medium' | 'high';
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useUserTasks = (): Task[] => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setTasks([]);
            return;
        }

        const sortTasks = (tasks: Task[]) => {
            return tasks.sort(
                (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
            );
        };

        const tasksCollection = collection(db, "tasks");
        const userTasksQuery = query(tasksCollection, where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(userTasksQuery, (snapshot) => {
            const taskList: Task[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];

            setTasks(sortTasks(taskList));
        });

        return () => {
            unsubscribe();
        };
    }, [user]);

    return tasks;
};

// Legacy task functions
export const addTask = async (
  title: string, 
  userId: string, 
  description?: string, 
  dueDate?: string, 
  priority?: 'low' | 'medium' | 'high'
): Promise<void> => {
    try {
        const tasksCollection = collection(db, "tasks");
        const newTask = {
            title,
            description: description || "",
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            completed: false,
            priority: priority || 'medium',
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        
        await addDoc(tasksCollection, newTask);
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};

export const updateTask = async (taskId: string, title?: string, description?: string): Promise<void> => {
    try {
        const tasksCollection = collection(db, "tasks");
        const taskDocRef = doc(tasksCollection, taskId);
        await setDoc(taskDocRef, {
            title,
            description,
        }, { merge: true });
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

export const removeTask = async (taskId: string): Promise<void> => {
    try {
        const tasksCollection = collection(db, "tasks");
        const taskDocRef = doc(tasksCollection, taskId);
        await deleteDoc(taskDocRef);
    } catch (error) {
        console.error("Error removing task:", error);
        throw error;
    }
};

export const markTaskAsDoneOrUndone = async (taskId: string): Promise<void> => {
    try {
        const tasksCollection = collection(db, "tasks");
        const taskDocRef = doc(tasksCollection, taskId);
        const { getDoc } = await import("firebase/firestore");
        const taskSnapshot = await getDoc(taskDocRef);
        if (taskSnapshot.exists()) {
            const currentTask = taskSnapshot.data() as Task;
            await setDoc(taskDocRef, {
                ...currentTask,
                completed: !currentTask.completed,
            });
        } else {
            throw new Error("Task not found");
        }
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};