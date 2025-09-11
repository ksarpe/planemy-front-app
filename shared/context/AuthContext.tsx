import { createContext } from "react";
import { useUserInfoQuery } from "@shared/hooks/auth/useAuth";
import type { AuthContextType } from "@shared/data/Auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, refetch } = useUserInfoQuery();

  const value = {
    user: data || null,
    loading: isLoading,
    refetchUser: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
