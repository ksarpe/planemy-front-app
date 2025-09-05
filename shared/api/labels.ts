import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "./config";
import { LabelInterface } from "../data/Utils/interfaces";
import { v4 as uuidv4 } from "uuid";

const LABELS_COLLECTION = "labels";
const LABEL_CONNECTIONS_COLLECTION = "labelConnections";

// Create a new label
export const createLabel = async (name: string, color: string, userId: string, description?: string): Promise<void> => {
  try {
    const labelsCollection = collection(db, LABELS_COLLECTION);
    const newLabel = {
      id: uuidv4(),
      name,
      color,
      description: description || "",
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as LabelInterface;

    await addDoc(labelsCollection, newLabel);
  } catch (error) {
    console.error("Error creating label:", error);
    throw error;
  }
};

// Update label
export const updateLabel = async (labelId: string, updates: Partial<LabelInterface>): Promise<void> => {
  try {
    const labelDocRef = doc(db, LABELS_COLLECTION, labelId);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(labelDocRef, updateData);
  } catch (error) {
    console.error("Error updating label:", error);
    throw error;
  }
};

// Delete label
export const deleteLabel = async (labelId: string): Promise<void> => {
  try {
    const labelsCollection = collection(db, LABELS_COLLECTION);
    const q = query(labelsCollection, where("id", "==", labelId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No label found with id: ${labelId}`);
      return;
    }
    
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting label:", error);
    throw error;
  }
};

// Create label connection for tasks or other objects
export const createLabelConnectionFirebase = async (
  userId: string,
  objectId: string,
  objectType: string,
  labelId: string,
): Promise<void> => {
  try {
    const connectionsCollection = collection(db, LABEL_CONNECTIONS_COLLECTION);
    const newConnection = {
      id: uuidv4(),
      userId,
      objectId,
      objectType,
      labelId,
      createdAt: new Date().toISOString(),
    };

    await addDoc(connectionsCollection, newConnection);
  } catch (error) {
    console.error("Error creating label connection:", error);
    throw error;
  }
};

// Remove label connection
export const removeLabelConnectionFirebase = async (
  userId: string,
  objectId: string,
  objectType: string,
  labelId: string,
): Promise<void> => {
  try {
    const connectionsCollection = collection(db, LABEL_CONNECTIONS_COLLECTION);
    const q = query(
      connectionsCollection,
      where("userId", "==", userId),
      where("objectId", "==", objectId),
      where("objectType", "==", objectType),
      where("labelId", "==", labelId),
    );

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error removing label connection:", error);
    throw error;
  }
};

// Remove all label connections for an object
export const removeAllLabelConnectionsForObject = async (
  userId: string,
  objectId: string,
  objectType: string,
): Promise<void> => {
  try {
    const connectionsCollection = collection(db, LABEL_CONNECTIONS_COLLECTION);
    const q = query(
      connectionsCollection,
      where("userId", "==", userId),
      where("objectId", "==", objectId),
      where("objectType", "==", objectType),
    );

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error removing all label connections for object:", error);
    throw error;
  }
};

// Get user's labels (one-time fetch)
export const getUserLabels = async (userId: string): Promise<LabelInterface[]> => {
  try {
    const labelsCollection = collection(db, LABELS_COLLECTION);
    const userLabelsQuery = query(labelsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(userLabelsQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LabelInterface[];
  } catch (error) {
    console.error("Error fetching user labels:", error);
    throw error;
  }
};

// Subscribe to user's labels (real-time)
export const subscribeToUserLabels = (userId: string, callback: (labels: LabelInterface[]) => void): (() => void) => {
  try {
    const labelsCollection = collection(db, LABELS_COLLECTION);
    const userLabelsQuery = query(labelsCollection, where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      userLabelsQuery,
      (snapshot) => {
        const labels: LabelInterface[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LabelInterface[];

        callback(labels);
      },
      (error) => {
        console.error("Error in labels subscription:", error);
      },
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up labels subscription:", error);
    return () => {}; // Return empty function if setup fails
  }
};

// Get label by ID
export const getLabelById = async (labelId: string): Promise<LabelInterface | null> => {
  try {
    const labelsCollection = collection(db, LABELS_COLLECTION);
    const labelQuery = query(labelsCollection, where("__name__", "==", labelId));
    const snapshot = await getDocs(labelQuery);

    if (snapshot.empty) {
      return null;
    }

    const labelDoc = snapshot.docs[0];
    return {
      id: labelDoc.id,
      ...labelDoc.data(),
    } as LabelInterface;
  } catch (error) {
    console.error("Error fetching label by ID:", error);
    throw error;
  }
};

// Search labels by name
export const searchLabels = async (userId: string, searchTerm: string): Promise<LabelInterface[]> => {
  try {
    const labels = await getUserLabels(userId);

    // Client-side filtering since Firestore doesn't support case-insensitive search
    return labels.filter(
      (label) =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (label.description && label.description.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  } catch (error) {
    console.error("Error searching labels:", error);
    throw error;
  }
};

// Bulk delete labels
export const bulkDeleteLabels = async (labelIds: string[]): Promise<void> => {
  try {
    const deletePromises = labelIds.map((labelId) => deleteLabel(labelId));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error bulk deleting labels:", error);
    throw error;
  }
};

// Remove all label connections for all tasks in a task list
export const removeAllLabelConnectionsForTasksInList = async (userId: string, taskListId: string): Promise<void> => {
  try {
    const connectionsCollection = collection(db, LABEL_CONNECTIONS_COLLECTION);

    // First, get all tasks from the task list
    const tasksCollection = collection(db, "tasks");
    const tasksQuery = query(tasksCollection, where("taskListId", "==", taskListId));
    const tasksSnapshot = await getDocs(tasksQuery);

    if (tasksSnapshot.empty) {
      console.log(`No tasks found in task list ${taskListId}, no label connections to remove`);
      return;
    }

    // Extract task IDs
    const taskIds = tasksSnapshot.docs.map((doc) => doc.data().id || doc.id);

    // Remove label connections for all tasks in batches (Firestore 'in' query limit is 30)
    const batchSize = 30;
    const deletePromises = [];

    for (let i = 0; i < taskIds.length; i += batchSize) {
      const batch = taskIds.slice(i, i + batchSize);

      const connectionsQuery = query(
        connectionsCollection,
        where("userId", "==", userId),
        where("objectId", "in", batch),
        where("objectType", "==", "task"),
      );

      const connectionsSnapshot = await getDocs(connectionsQuery);
      const batchDeletePromises = connectionsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      deletePromises.push(...batchDeletePromises);
    }

    await Promise.all(deletePromises);
    console.log(
      `Removed ${deletePromises.length} label connections for ${taskIds.length} tasks in task list ${taskListId}`,
    );
  } catch (error) {
    console.error("Error removing label connections for tasks in list:", error);
    throw error;
  }
};
