import type { PaymentsContextProps } from "@shared/data/Payments/context";
import type { ReactNode } from "react";
import { createContext } from "react";

const PaymentsContext = createContext<PaymentsContextProps | undefined>(undefined);
export { PaymentsContext };

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  return <PaymentsContext.Provider value={{}}>{children}</PaymentsContext.Provider>;
};
