import type { AuthContextType } from "@shared/data/Auth";
import { useValidate } from "@shared/hooks/auth/useAuth";
import { createContext } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, refetch } = useValidate();

  const value = {
    user: data || null,
    loading: isLoading,
    refetchUser: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
