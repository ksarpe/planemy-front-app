import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "./config";
import { LabelInterface } from "@/data/Utils/interfaces";

// Create a new label
export const createLabel = async (name: string, color: string, userId: string, description?: string): Promise<void> => {
  try {
    const labelsCollection = collection(db, "labels");
    const newLabel = {
      name,
      color,
      description: description || "",
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    const labelDocRef = doc(db, "labels", labelId);
    await deleteDoc(labelDocRef);
  } catch (error) {
    console.error("Error deleting label:", error);
    throw error;
  }
};

// Get user's labels (one-time fetch)
export const getUserLabels = async (userId: string): Promise<LabelInterface[]> => {
  try {
    const labelsCollection = collection(db, "labels");
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
    const labelsCollection = collection(db, "labels");
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
    const labelsCollection = collection(db, "labels");
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

// Get labels by color
export const getLabelsByColor = async (userId: string, color: string): Promise<LabelInterface[]> => {
  try {
    const labelsCollection = collection(db, "labels");
    const colorLabelsQuery = query(labelsCollection, where("userId", "==", userId), where("color", "==", color));
    const snapshot = await getDocs(colorLabelsQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LabelInterface[];
  } catch (error) {
    console.error("Error fetching labels by color:", error);
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

// Get label statistics
export const getLabelStats = async (userId: string) => {
  try {
    const labels = await getUserLabels(userId);

    const stats = {
      totalLabels: labels.length,
      uniqueColors: new Set(labels.map((label) => label.color)).size,
      averageNameLength:
        labels.length > 0 ? Math.round(labels.reduce((sum, label) => sum + label.name.length, 0) / labels.length) : 0,
      labelsWithDescription: labels.filter((label) => label.description && label.description.trim()).length,
      mostUsedColors: Object.entries(
        labels.reduce((acc, label) => {
          acc[label.color] = (acc[label.color] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([color, count]) => ({ color, count })),
    };

    return stats;
  } catch (error) {
    console.error("Error calculating label stats:", error);
    throw error;
  }
};
