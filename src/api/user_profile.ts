import { db } from "./config";
import { collection, getDocs, query, updateDoc, where, setDoc, doc } from "firebase/firestore";

export interface UserProfileDoc {
  id: string;
  userId: string;
  nickname: string;
  email: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfileDoc | null> => {
  const col = collection(db, "user_profile");
  const q = query(col, where("userId", "==", userId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data() as Omit<UserProfileDoc, "id">;
  return { id: d.id, ...data };
};

export const upsertUserProfile = async (userId: string, data: Partial<UserProfileDoc>): Promise<void> => {
  const col = collection(db, "user_profile");
  const q = query(col, where("userId", "==", userId));
  const snap = await getDocs(q);
  if (snap.empty) {
    // create new
    const newRef = doc(col);
    const payload: Omit<UserProfileDoc, "id"> = {
      userId,
      nickname: "",
      email: "",
      ...data,
    } as Omit<UserProfileDoc, "id">;
    await setDoc(newRef, payload);
  } else {
    const d = snap.docs[0];
    await updateDoc(d.ref, data);
  }
};
