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
import type { AuthContextType } from "@/data/Auth";

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
      return "Nie znaleziono użytkownika z tym adresem email.";
    case "auth/wrong-password":
      return "Nieprawidłowe hasło.";
    case "auth/email-already-in-use":
      return "Ten adres email jest już używany.";
    case "auth/weak-password":
      return "Hasło jest zbyt słabe.";
    case "auth/invalid-email":
      return "Nieprawidłowy adres email.";
    case "auth/user-disabled":
      return "To konto zostało wyłączone.";
    case "auth/too-many-requests":
      return "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.";
    case "auth/network-request-failed":
      return "Błąd połączenia z siecią.";
    default:
      return "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.";
  }
};
