import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPayment as addPaymentToFirebase,
  removePayment as removePaymentFromFirebase,
  markPaymentAsPaid as markPaymentAsPaidFirebase,
  togglePaymentStatus as togglePaymentStatusFirebase,
  updatePayment as updatePaymentFirebase,
} from "../../api/payments";
import { useAuthContext } from "../context/useAuthContext";
import { useToastContext } from "../context/useToastContext";
import type { PaymentInterface } from "@/data/Payments/interfaces";

export const usePayments = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  const addPaymentMutation = useMutation({
    mutationFn: async (paymentData: Omit<PaymentInterface, "id" | "userId">) => {
      if (!user) {
        throw new Error("Musisz być zalogowany, aby dodać płatność");
      }

      return await addPaymentToFirebase(paymentData, user.uid);
    },
    onSuccess: () => {
      // Invalidate payments queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      showToast("success", "Płatność została dodana pomyślnie!");
    },
    onError: (error) => {
      console.error("Error adding payment:", error);
      showToast("error", "Błąd podczas dodawania płatności");
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async ({ paymentId, payment }: { paymentId: string; payment: PaymentInterface }) => {
      return await markPaymentAsPaidFirebase(paymentId, payment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      showToast("success", "Płatność została oznaczona jako opłacona!");
    },
    onError: (error) => {
      console.error("Error marking payment as paid:", error);
      showToast("error", "Błąd podczas oznaczania płatności jako opłacona");
    },
  });

  const removePaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      return await removePaymentFromFirebase(paymentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      showToast("success", "Płatność została usunięta!");
    },
    onError: (error) => {
      console.error("Error removing payment:", error);
      showToast("error", "Błąd podczas usuwania płatności");
    },
  });

  const togglePaymentStatusMutation = useMutation({
    mutationFn: async ({ paymentId, isActive }: { paymentId: string; isActive: boolean }) => {
      return await togglePaymentStatusFirebase(paymentId, isActive);
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      showToast("success", `Płatność została ${isActive ? "aktywowana" : "dezaktywowana"}!`);
    },
    onError: (error) => {
      console.error("Error toggling payment status:", error);
      showToast("error", "Błąd podczas zmiany statusu płatności");
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ paymentId, updateData }: { paymentId: string; updateData: Partial<PaymentInterface> }) => {
      return await updatePaymentFirebase(paymentId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      showToast("success", "Płatność została zaktualizowana!");
    },
    onError: (error) => {
      console.error("Error updating payment:", error);
      showToast("error", "Błąd podczas aktualizacji płatności");
    },
  });

  return {
    // Add payment
    addPayment: addPaymentMutation.mutateAsync,
    isAddingPayment: addPaymentMutation.isPending,
    addPaymentError: addPaymentMutation.error,

    // Mark as paid
    markAsPaid: (paymentId: string, payment: PaymentInterface) => 
      markAsPaidMutation.mutateAsync({ paymentId, payment }),
    isMarkingAsPaid: markAsPaidMutation.isPending,
    markAsPaidError: markAsPaidMutation.error,

    // Remove payment
    removePayment: removePaymentMutation.mutateAsync,
    isRemovingPayment: removePaymentMutation.isPending,
    removePaymentError: removePaymentMutation.error,

    // Toggle payment status
    togglePaymentStatus: (paymentId: string, isActive: boolean) => 
      togglePaymentStatusMutation.mutateAsync({ paymentId, isActive }),
    isTogglingStatus: togglePaymentStatusMutation.isPending,
    toggleStatusError: togglePaymentStatusMutation.error,

    // Update payment
    updatePayment: (paymentId: string, updateData: Partial<PaymentInterface>) => 
      updatePaymentMutation.mutateAsync({ paymentId, updateData }),
    isUpdatingPayment: updatePaymentMutation.isPending,
    updatePaymentError: updatePaymentMutation.error,

    // Reset functions for clearing error states
    resetAddPayment: addPaymentMutation.reset,
    resetMarkAsPaid: markAsPaidMutation.reset,
    resetRemovePayment: removePaymentMutation.reset,
    resetToggleStatus: togglePaymentStatusMutation.reset,
    resetUpdatePayment: updatePaymentMutation.reset,
  };
};