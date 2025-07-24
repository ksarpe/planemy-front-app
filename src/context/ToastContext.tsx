import { createContext, useContext, useState, ReactNode } from "react";
import Toast from "@/components/ui/Utils/Toast";
import type { ToastContextProps } from "@/data/typesProps";

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ type: string; message: string } | null>(
    null
  );

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
        <Toast
          type={toast.type as "success" | "error" | "warning"}
          message={toast.message}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
