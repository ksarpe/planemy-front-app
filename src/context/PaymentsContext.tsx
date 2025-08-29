import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { PaymentInterface } from "@/data/Payments/interfaces";
import type { PaymentsContextProps } from "@/data/Payments/context";
import { useUserPayments } from "../api/payments";

const PaymentsContext = createContext<PaymentsContextProps | undefined>(undefined);
export { PaymentsContext };

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  const initialPayments = useUserPayments();
  const [payments, setPayments] = useState<PaymentInterface[]>([]);

  useEffect(() => {
    if (initialPayments) {
      setPayments(initialPayments);
    }
  }, [initialPayments]);

  return (
    <PaymentsContext.Provider
      value={{
        payments,
      }}>
      {children}
    </PaymentsContext.Provider>
  );
};
