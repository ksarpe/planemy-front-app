import { db, auth } from "./config";
import { collection, addDoc, query, where, getDocs, serverTimestamp, Timestamp } from "firebase/firestore";

export interface Feedback {
  id: string;
  message: string;
  userId: string;
  createdAt: Date;
  status?: "pending" | "read" | "accepted" | "resolved";
  priority?: "low" | "medium" | "high";
}

export interface CreateFeedbackData {
  message: string;
}

export const feedbackAPI = {
  // Create new feedback
  create: async (data: CreateFeedbackData): Promise<Feedback> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const feedbackData = {
      message: data.message,
      userId: user.uid,
      createdAt: serverTimestamp(),
      status: "pending" as const,
      priority: "medium" as const,
    };

    const docRef = await addDoc(collection(db, "feedback"), feedbackData);

    return {
      id: docRef.id,
      message: data.message,
      userId: user.uid,
      createdAt: new Date(),
      status: "pending",
      priority: "medium",
    };
  },

  // Get user's feedback submissions
  getUserFeedbacks: async (): Promise<Feedback[]> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const q = query(collection(db, "feedback"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        };
      }) as Feedback[];

      results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return results;
    } catch (error) {
      console.error("Error fetching user feedbacks:", error);
      throw error;
    }
  },

  // Get all public feedbacks (accepted + resolved) - roadmap/changelog
  getAllPublicFeedbacks: async (): Promise<Feedback[]> => {
    try {
      const q = query(collection(db, "feedback"));
      const querySnapshot = await getDocs(q);

      const allResults = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as Feedback;
      });

      const results = allResults.filter((feedback) => feedback.status === "accepted" || feedback.status === "resolved");

      // Sortuj: resolved na górze, potem accepted, każda grupa sortowana po dacie
      results.sort((a, b) => {
        // Najpierw sortuj po statusie (resolved > accepted)
        if (a.status !== b.status) {
          if (a.status === "resolved" && b.status === "accepted") return -1;
          if (a.status === "accepted" && b.status === "resolved") return 1;
        }
        // Potem po dacie (nowsze pierwsze)
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      return results;
    } catch (error) {
      console.error("Error fetching public feedbacks:", error);
      throw error;
    }
  },
};
