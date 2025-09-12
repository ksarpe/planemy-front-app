import { use } from "react";
import { PaymentsContext } from "@shared/context/PaymentsContext";

export const usePaymentsContext = () => {
  const context = use(PaymentsContext);
  if (!context) {
    throw new Error("usePaymentsContext must be used within a PaymentsProvider");
  }
  return context;
};
