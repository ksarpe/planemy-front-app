import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { PaymentInterface } from "@/data/types";
import type { PaymentsContextProps } from "@/data/typesProps";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToastContext } from "@/hooks/useToastContext";
import {
  useUserPayments,
  addPayment as addPaymentToFirebase,
  removePayment as removePaymentFromFirebase,
  markPaymentAsPaid as markPaymentAsPaidFirebase,
  togglePaymentStatus as togglePaymentStatusFirebase,
  updatePayment as updatePaymentFirebase,
} from "../api/payments";

const PaymentsContext = createContext<PaymentsContextProps | undefined>(undefined);
export { PaymentsContext };

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const initialPayments = useUserPayments();
  const [payments, setPayments] = useState<PaymentInterface[]>([]);

  useEffect(() => {
    if (initialPayments) {
      setPayments(initialPayments);
    }
  }, [initialPayments]);

  const addPayment = async (paymentData: Omit<PaymentInterface, "id" | "userId">) => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby dodać płatność");
      return;
    }

    try {
      await addPaymentToFirebase(paymentData, user.uid);
      showToast("success", "Płatność została dodana pomyślnie!");
    } catch (error) {
      console.error("Error adding payment:", error);
      showToast("error", "Błąd podczas dodawania płatności");
    }
  };

  const markAsPaid = async (paymentId: string) => {
    try {
      const payment = payments.find((p) => p.id === paymentId);
      if (!payment) return;

      await markPaymentAsPaidFirebase(paymentId, payment);
      showToast("success", "Płatność została oznaczona jako opłacona!");
    } catch (error) {
      console.error("Error marking payment as paid:", error);
      showToast("error", "Błąd podczas oznaczania płatności jako opłacona");
    }
  };

  const removePayment = async (paymentId: string) => {
    try {
      await removePaymentFromFirebase(paymentId);
      showToast("success", "Płatność została usunięta!");
    } catch (error) {
      console.error("Error removing payment:", error);
      showToast("error", "Błąd podczas usuwania płatności");
    }
  };

  const togglePaymentStatus = async (paymentId: string, isActive: boolean) => {
    try {
      await togglePaymentStatusFirebase(paymentId, isActive);
      showToast("success", `Płatność została ${isActive ? "aktywowana" : "dezaktywowana"}!`);
    } catch (error) {
      console.error("Error toggling payment status:", error);
      showToast("error", "Błąd podczas zmiany statusu płatności");
    }
  };

  const updatePayment = async (paymentId: string, updateData: Partial<PaymentInterface>) => {
    try {
      await updatePaymentFirebase(paymentId, updateData);
      showToast("success", "Płatność została zaktualizowana!");
    } catch (error) {
      console.error("Error updating payment:", error);
      showToast("error", "Błąd podczas aktualizacji płatności");
    }
  };

  return (
    <PaymentsContext.Provider
      value={{
        payments,
        addPayment,
        markAsPaid,
        removePayment,
        togglePaymentStatus,
        updatePayment,
      }}>
      {children}
    </PaymentsContext.Provider>
  );
};
