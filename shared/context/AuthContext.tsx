import { createContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth } from "../api/config";
import type { AuthContextType } from "../data/Auth";
import i18n from "../i18n";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && user) {
        await updateProfile(user, { displayName });
      }
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to convert Firebase auth error codes to user-friendly messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/user-not-found":
      return i18n.t("auth.errors.userNotFound");
    case "auth/wrong-password":
      return i18n.t("auth.errors.wrongPassword");
    case "auth/email-already-in-use":
      return i18n.t("auth.errors.emailAlreadyInUse");
    case "auth/weak-password":
      return i18n.t("auth.errors.weakPassword");
    case "auth/invalid-email":
      return i18n.t("auth.errors.invalidEmail");
    case "auth/user-disabled":
      return i18n.t("auth.errors.userDisabled");
    case "auth/too-many-requests":
      return i18n.t("auth.errors.tooManyRequests");
    case "auth/network-request-failed":
      return i18n.t("auth.errors.networkRequestFailed");
    default:
      return i18n.t("auth.errors.unknownError");
  }
};
