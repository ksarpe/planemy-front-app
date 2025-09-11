// src/shared/context/ToastContext.tsx

import { createContext, PropsWithChildren } from "react";
import { ToastService } from "../data/Utils"; //TODO: adjust path

export const ToastContext = createContext<ToastService | undefined>(undefined);

export const ToastProvider = ({ children, service }: PropsWithChildren<{ service: ToastService }>) => {
  return <ToastContext.Provider value={service}>{children}</ToastContext.Provider>;
};
