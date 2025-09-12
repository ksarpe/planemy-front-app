import type { PaymentInterface } from "./interfaces";

export interface PaymentsContextProps {
  payments: PaymentInterface[];
  isLoading: boolean;
}
