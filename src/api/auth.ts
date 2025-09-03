import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./config";
import type { LoginRequest, RegisterRequest, AuthResponse } from "@/data/Auth/interfaces";
import { UserProfile } from "@/data/User/interfaces";
import { doc, getDoc } from "firebase/firestore";

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    // Use Firebase authentication for testing purposes
    const userCredential = await signInWithEmailAndPassword(auth, credentials.username, credentials.password);
    const user = userCredential.user;

    return {
      message: "Login successful",
      token: await user.getIdToken(), // Get Firebase JWT token
      user: {
        id: user.uid,
        username: user.email || credentials.username,
      },
    };
  } catch (error) {
    // Handle Firebase auth errors
    console.error("Firebase login error:", error);
    throw new Error(error instanceof Error ? error.message : "Login failed");
  }
};

export const registerUser = async (credentials: RegisterRequest): Promise<AuthResponse> => {
  try {
    // Hardcoded for now - will replace with actual backend call
    const response = await fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch {
    // For development, simulate the API call
    console.log(`Simulated register call:`, {
      method: "POST",
      url: "http://localhost:8080/api/v1/auth/register",
      body: {
        username: credentials.username,
        password: "**", // Hide password in logs
      },
    });

    // Simulate success for development
    return {
      message: "Registration successful",
      token: "mock-jwt-token",
      user: {
        id: "mock-user-id",
        username: credentials.username,
      },
    };
  }
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    console.log(userId)
    const userDoc = await getDoc(doc(db, "user_profile", userId));

    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();
    return {
      id: userDoc.id,
      username: userData.username,
      email: userData.email,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      plan: "free",
    } as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch user profile");
  }
};
