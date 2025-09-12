import { createContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { PaymentsContextProps } from "@shared/data/Payments/context";

const PaymentsContext = createContext<PaymentsContextProps | undefined>(undefined);
export { PaymentsContext };

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  return <PaymentsContext.Provider value={{}}>{children}</PaymentsContext.Provider>;
};
