import { createContext, useState, ReactNode } from "react";
import Toast from "@/components/ui/Utils/Toast";
import type { ToastContextProps } from "@shared/data/Utils/toastContext";

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export { ToastContext };

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

  const showToast = (type: "success" | "error" | "warning", message: string) => {
    setToast({ type, message });
  };

  const handleClose = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast type={toast.type as "success" | "error" | "warning"} message={toast.message} onClose={handleClose} />
      )}
    </ToastContext.Provider>
  );
};
