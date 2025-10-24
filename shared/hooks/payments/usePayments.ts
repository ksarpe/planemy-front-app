import { addPayment, deletePayment, getPayments, updatePayment } from "@shared/api/payments";
import { queryClient } from "@shared/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { Payment, PaymentResponse } from "@shared/data/Payments/interfaces";

export function usePayments() {
  return useQuery<PaymentResponse, unknown, PaymentResponse, string[]>({
    queryKey: ["payments"],
    queryFn: getPayments,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (payment: Partial<Payment>) => addPayment(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useUpdatePayment() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) => updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeletePayment() {
  return useMutation({
    mutationFn: (paymentId: string) => deletePayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
