// src/providers/WebToastProvider.tsx

import { toast } from "sonner";
import { PropsWithChildren } from "react";
import { ToastContext } from "@shared/context/ToastContext";
import type { ToastService } from "@shared/data/Utils/";

const sonnerService: ToastService = {
  showSuccess: (message) => toast.success(message),
  showError: (message) => toast.error(message),
};

export const WebToastProvider = ({ children }: PropsWithChildren) => {
  return (
    <ToastContext.Provider value={sonnerService}>
      {children}
    </ToastContext.Provider>
  );
};