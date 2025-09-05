import { use } from "react";
import { ToastContext } from "@/context/ToastContext";

export const useToastContext = () => {
  const context = use(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
