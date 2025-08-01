import { use } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuthContext = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useLabelContext must be used within a LabelProvider");
  }
  return context;
};
