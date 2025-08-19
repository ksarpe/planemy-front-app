import type { PaymentInterface } from "./interfaces";

export interface PaymentsContextProps {
  payments: PaymentInterface[];
  addPayment: (paymentData: Omit<PaymentInterface, "id" | "userId">) => Promise<void>;
  markAsPaid: (paymentId: string) => Promise<void>;
  removePayment: (paymentId: string) => Promise<void>;
  togglePaymentStatus: (paymentId: string, isActive: boolean) => Promise<void>;
  updatePayment: (paymentId: string, updateData: Partial<PaymentInterface>) => Promise<void>;
}
