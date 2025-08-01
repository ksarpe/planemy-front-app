import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "./config";
import { LabelConnection, LabelInterface } from "@/data/Utils/interfaces";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { v4 as uuidv4 } from "uuid";

// Hook to get user's labels
export const useUserLabels = (): LabelInterface[] => {
  const [labels, setLabels] = useState<LabelInterface[]>([]);
  const { user } = useAuthContext();

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

export function useLabelConnections() {
  const { user } = useAuthContext();
  const labels = useUserLabels();
  const [connections, setConnections] = useState<Map<string, Map<string, LabelInterface[]>>>(new Map());

  useEffect(() => {
    if (!user || labels.length === 0) {
      setConnections(new Map());
      return;
    }

    const q = query(collection(db, "labelConnections"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const labelMap = new Map(labels.map((l) => [l.id, l]));
      const newMap = new Map<string, Map<string, LabelInterface[]>>();

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as LabelConnection;
        const label = labelMap.get(data.labelId);
        if (!label) return;

        const typeMap = newMap.get(data.objectType) || new Map();
        const existing = typeMap.get(data.objectId) || [];
        typeMap.set(data.objectId, [...existing, label]);
        newMap.set(data.objectType, typeMap);
      });

      setConnections(newMap);
    });

    return () => unsubscribe();
  }, [user, labels]);

  return connections;
}

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

// Create label connection for tasks or other objects
export const createLabelConnectionFirebase = async (
  userId: string,
  objectId: string,
  objectType: string,
  labelId: string,
): Promise<void> => {
  try {
    const connectionsCollection = collection(db, "labelConnections");
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
    const connectionsCollection = collection(db, "labelConnections");
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
    const connectionsCollection = collection(db, "labelConnections");
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
