import { APIError } from "@shared/data/Auth";
import { type Payment, type PaymentResponse } from "@shared/data/Payments/interfaces";
import { buildApiUrl } from "../config/api";

export const getPayments = async (): Promise<PaymentResponse> => {
  const response = await fetch(buildApiUrl("bills"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting payments failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const addPayment = async (paymentData: Omit<Payment, "id">): Promise<Partial<Payment>> => {
  const response = await fetch(buildApiUrl("bills"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding payment failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const updatePayment = async (paymentId: string, paymentData: Partial<Payment>): Promise<Partial<Payment>> => {
  if (!paymentId) {
    throw new Error("Payment ID is required for update");
  }
  const response = await fetch(buildApiUrl(`bills/${paymentId}`), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating payment failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const deletePayment = async (paymentId: string): Promise<void> => {
  if (!paymentId) {
    throw new Error("Payment ID is required for deletion");
  }

  const response = await fetch(buildApiUrl(`bills/${paymentId}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting payment failed`, response.status, errorBody);
  }
};

// Re-export helper functions from utils (for backward compatibility with existing components)
export { calculateNextPaymentDate, getDaysUntilPayment, isPaymentPaidForCurrentPeriod } from "@shared/utils/helpers";
