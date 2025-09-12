import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import type { PaymentsContextProps } from "@shared/data/Payments/context";
import { usePayments } from "@shared/hooks/payments";

const PaymentsContext = createContext<PaymentsContextProps | undefined>(undefined);
export { PaymentsContext };

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = usePayments();
  const [payments, setPayments] = useState<PaymentInterface[]>([]);

  useEffect(() => {
    if (data) {
      setPayments(data);
    }
  }, [data]);

  return (
    <PaymentsContext.Provider
      value={{
        payments,
        isLoading,
      }}>
      {children}
    </PaymentsContext.Provider>
  );
};
