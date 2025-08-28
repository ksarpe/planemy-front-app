import type { PaymentInterface } from "@/data/Payments/interfaces";

// Payments component interfaces (moved from components/ui/Payments/)

export interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: Omit<PaymentInterface, "id" | "userId">) => Promise<void>;
}