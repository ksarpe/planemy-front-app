import { db } from "./config";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type { Announcement, UserNotificationStatus } from "@/data/Utils/interfaces";

const ANNOUNCEMENTS_COLLECTION = "announcements";
const USER_NOTIFICATION_STATUS_COLLECTION = "user_notification_status";

/**
 * Get all active announcements for users
 */
export const getActiveAnnouncementsApi = async (): Promise<Announcement[]> => {
  try {
    const announcementsCollection = collection(db, ANNOUNCEMENTS_COLLECTION);
    const now = new Date().toISOString();
    const q = query(
      announcementsCollection,
      where("isActive", "==", true),
      where("startDate", "<=", now),
      orderBy("startDate", "desc"),
      orderBy("priority", "asc"),
    );

    const snapshot = await getDocs(q);
    const announcements = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Announcement),
    );

    // Filter out expired announcements
    return announcements;
  } catch (error) {
    console.error("Error getting active announcements:", error);
    return [];
  }
};

/**
 * Get announcement by ID
 */
export const getAnnouncementByIdApi = async (announcementId: string): Promise<Announcement | null> => {
  try {
    const announcementDoc = await getDoc(doc(db, ANNOUNCEMENTS_COLLECTION, announcementId));

    if (announcementDoc.exists()) {
      return {
        id: announcementDoc.id,
        ...announcementDoc.data(),
      } as Announcement;
    }

    return null;
  } catch (error) {
    console.error("Error getting announcement:", error);
    return null;
  }
};

/**
 * Get user's notification status for announcements
 */
export const getUserNotificationStatusApi = async (
  userId: string,
  announcementIds: string[],
): Promise<UserNotificationStatus[]> => {
  try {
    if (announcementIds.length === 0) return [];

    const statusCollection = collection(db, USER_NOTIFICATION_STATUS_COLLECTION);
    const q = query(statusCollection, where("userId", "==", userId), where("announcementId", "in", announcementIds));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as UserNotificationStatus),
    );
  } catch (error) {
    console.error("Error getting user notification status:", error);
    return [];
  }
};

/**
 * Mark announcement as seen (creates initial status record)
 */
export const markAnnouncementAsSeenApi = async (userId: string, announcementId: string): Promise<void> => {
  try {
    // Use deterministic document ID to prevent duplicates
    const statusDocId = `${userId}_${announcementId}`;
    const statusDocRef = doc(db, USER_NOTIFICATION_STATUS_COLLECTION, statusDocId);

    // Check if document already exists
    const existingDoc = await getDoc(statusDocRef);

    if (!existingDoc.exists()) {
      // Create new status record with deterministic ID
      const newStatus: Omit<UserNotificationStatus, "id"> = {
        announcementId,
        userId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(statusDocRef, newStatus);
      console.log("Announcement marked as seen:", announcementId);
    } else {
      console.log("Announcement status already exists:", announcementId);
    }
  } catch (error) {
    console.error("Error marking announcement as seen:", error);
    throw error;
  }
};

/**
 * Mark announcement as read
 */
export const markAnnouncementAsReadApi = async (userId: string, announcementId: string): Promise<void> => {
  try {
    // Use deterministic document ID
    const statusDocId = `${userId}_${announcementId}`;
    const statusDocRef = doc(db, USER_NOTIFICATION_STATUS_COLLECTION, statusDocId);
    // Update or create the status record
    await setDoc(
      statusDocRef,
      {
        announcementId,
        userId,
        isRead: true,
        createdAt: new Date().toISOString(),
        readAt: new Date().toISOString(),
      },
      { merge: true },
    );

    console.log("Announcement marked as read:", announcementId);
  } catch (error) {
    console.error("Error marking announcement as read:", error);
    throw error;
  }
};

// ADMIN FUNCTIONS (for external database management)

/**
 * Create new announcement (Admin only - to be used externally)
 */
export const createAnnouncementApi = async (
  announcement: Omit<Announcement, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const now = new Date().toISOString();
    const newAnnouncement = {
      ...announcement,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), newAnnouncement);
    console.log("Announcement created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

/**
 * Update announcement (Admin only)
 */
export const updateAnnouncementApi = async (
  announcementId: string,
  updates: Partial<Omit<Announcement, "id" | "createdAt">>,
): Promise<void> => {
  try {
    const announcementRef = doc(db, ANNOUNCEMENTS_COLLECTION, announcementId);
    await updateDoc(announcementRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    console.log("Announcement updated:", announcementId);
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

/**
 * Delete announcement (Admin only)
 */
export const deleteAnnouncementApi = async (announcementId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, ANNOUNCEMENTS_COLLECTION, announcementId));

    // Also delete all related user notification statuses
    const statusCollection = collection(db, USER_NOTIFICATION_STATUS_COLLECTION);
    const statusQuery = query(statusCollection, where("announcementId", "==", announcementId));
    const statusSnapshot = await getDocs(statusQuery);

    const deletePromises = statusSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log("Announcement and related statuses deleted:", announcementId);
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};
