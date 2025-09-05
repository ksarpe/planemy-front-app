// Payments feature component interfaces

import type { PaymentInterface } from "../interfaces";

export interface CategorizedPayments {
  overduePayments: PaymentInterface[];
  upcomingThisWeek: PaymentInterface[];
  upcomingNextWeek: PaymentInterface[];
  remainingPayments: PaymentInterface[];
  totalMonthlyAmount: number;
}

export interface PaymentItemProps {
  payment: PaymentInterface;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface PaymentDetailsPanelProps {
  payment: PaymentInterface;
}

export interface PaymentSectionProps {
  title: string;
  payments: PaymentInterface[];
  emptyMessage?: string;
  expandedPaymentId?: string | null;
  textColor: string;
  onToggleExpand?: (paymentId: string) => void;
}

export interface PaymentSummaryProps {
  categorizedPayments: CategorizedPayments;
}

export interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: Omit<PaymentInterface, "id" | "userId">) => Promise<void>;
}