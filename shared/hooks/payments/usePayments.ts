import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@shared/lib/queryClient";
import { addPayment, updatePayment, deletePayment, getPayments } from "@shared/api/payments";

import type { Payment } from "@shared/data/Payments/interfaces";

export function usePayments() {
  return useQuery<Payment[], unknown, Payment[], string[]>({
    queryKey: ["payments"],
    queryFn: getPayments,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (payment: Partial<Payment>) => addPayment(payment),
    // onMutate: async (newPayment) => {
    //   await queryClient.cancelQueries({ queryKey: ["payments"] });
    //   const previousPayments = queryClient.getQueryData<Payment[]>(["payments"]);
    //   queryClient.setQueryData<Payment[]>(["payments"], (old) => {
    //     const tempId = `temp-${Date.now()}`;
    //     return old ? [...old, { ...newPayment, id: tempId, createdAt: new Date().toISOString() } as Payment] : [
    //       { ...newPayment, id: tempId, createdAt: new Date().toISOString() } as Payment,
    //     ];
    //   });
    //   toast.loading("Dodawanie płatności...", { id: "createPayment" });
    //   return { previousPayments };
    // },
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
