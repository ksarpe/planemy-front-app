import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPayment as addPaymentToFirebase,
  removePayment as removePaymentFromFirebase,
  markPaymentAsPaid as markPaymentAsPaidFirebase,
  updatePayment as updatePaymentFirebase,
} from "@shared/api/payments";
import { useAuthContext } from "../context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";

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
    mutationFn: async (paymentId: string) => {
      return await markPaymentAsPaidFirebase(paymentId);
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
    markAsPaid: (paymentId: string) => markAsPaidMutation.mutateAsync(paymentId),
    isMarkingAsPaid: markAsPaidMutation.isPending,
    markAsPaidError: markAsPaidMutation.error,

    // Remove payment
    removePayment: removePaymentMutation.mutateAsync,
    isRemovingPayment: removePaymentMutation.isPending,
    removePaymentError: removePaymentMutation.error,

    // Update payment
    updatePayment: (paymentId: string, updateData: Partial<PaymentInterface>) =>
      updatePaymentMutation.mutateAsync({ paymentId, updateData }),
    isUpdatingPayment: updatePaymentMutation.isPending,
    updatePaymentError: updatePaymentMutation.error,

    // Reset functions for clearing error states
    resetAddPayment: addPaymentMutation.reset,
    resetMarkAsPaid: markAsPaidMutation.reset,
    resetRemovePayment: removePaymentMutation.reset,
    resetUpdatePayment: updatePaymentMutation.reset,
  };
};
