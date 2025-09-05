import type { UserSettings } from "@/data/User/interfaces";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./config";

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const settingsCollection = collection(db, "user_settings");
    const settingsQuery = query(settingsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(settingsQuery);
    if (snapshot.empty) {
      return null;
    }

    const settingsDoc = snapshot.docs[0];
    return {
      id: settingsDoc.id,
      ...settingsDoc.data(),
    } as UserSettings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw error;
  }
};

export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  try {
    const settingsCollection = collection(db, "user_settings");
    const settingsQuery = query(settingsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(settingsQuery);

    if (snapshot.empty) {
      console.warn("No user settings found for user:", userId);
      return;
    }

    const settingsDoc = snapshot.docs[0];
    await updateDoc(settingsDoc.ref, settings);
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};
