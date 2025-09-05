import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import type { UserProfile, OnboardingData } from "../data/User/interfaces";

/**
 * Firebase Onboarding API
 *
 * This module handles onboarding-related operations using Firebase Firestore.
 * It manages user onboarding status and profile completion.
 */

/**
 * Check if user has completed onboarding process
 * @param userId - Firebase user ID
 * @returns Promise with onboarding status
 */
export const checkOnboardingStatus = async (userId: string): Promise<{ isOnboarded: boolean }> => {
  try {
    console.log("Checking onboarding status for user:", userId);

    // Get user document from Firestore
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // User document doesn't exist, create basic structure
      console.log("User document doesn't exist, creating...");
      await setDoc(userDocRef, {
        id: userId,
        createdAt: new Date().toISOString(),
        isOnboarded: false,
      });
      return { isOnboarded: false };
    }

    const userData = userDoc.data() as UserProfile;
    const isOnboarded = userData.isOnboarded ?? false;

    console.log("User onboarding status:", isOnboarded);
    return { isOnboarded };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // In case of error, assume user is not onboarded to be safe
    return { isOnboarded: false };
  }
};

/**
 * Complete user onboarding process
 * @param userId - Firebase user ID
 * @param data - Onboarding data collected during the process
 * @returns Promise with updated user profile
 */
export const completeOnboarding = async (userId: string, data: OnboardingData): Promise<UserProfile> => {
  try {
    console.log("Completing onboarding for user:", userId, "with data:", data);

    const userDocRef = doc(db, "users", userId);

    // Update user document with onboarding data
    const updateData = {
      isOnboarded: true,
      nickname: data.nickname,
      onboardingCompletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userDocRef, updateData);

    // Also update user settings if preferences were provided
    if (data.language || data.theme) {
      const settingsDocRef = doc(db, "userSettings", userId);
      const settingsData = {
        userId: userId,
        language: data.language || "pl",
        theme: data.theme || "light",
        updatedAt: new Date().toISOString(),
      };

      // Use setDoc with merge to create or update
      await setDoc(settingsDocRef, settingsData, { merge: true });
    }

    // Get updated user document
    const updatedUserDoc = await getDoc(userDocRef);
    const updatedUserData = updatedUserDoc.data() as UserProfile;

    console.log("Onboarding completed successfully");
    return updatedUserData;
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
};

/**
 * Update user profile during onboarding
 * @param userId - Firebase user ID
 * @param updates - Partial user profile updates
 * @returns Promise with updated user profile
 */
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    console.log("Updating user profile:", userId, "with updates:", updates);

    const userDocRef = doc(db, "users", userId);

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userDocRef, updateData);

    // Get updated user document
    const updatedUserDoc = await getDoc(userDocRef);
    const updatedUserData = updatedUserDoc.data() as UserProfile;

    console.log("User profile updated successfully");
    return updatedUserData;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};
