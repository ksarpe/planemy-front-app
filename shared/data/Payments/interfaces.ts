// Payment related domain models (migrated from '@/data/types')

export interface PaymentInterface {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: "weekly" | "monthly" | "quarterly" | "yearly";
  category: "subscription" | "utility" | "insurance" | "loan" | "rent" | "other";
  description?: string;
  nextPaymentDate: string;
  lastPaymentDate?: string;
  isPaid: boolean;
  autoRenew: boolean;
  reminderDays: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Legacy Payment interface (moved from src/api/payments.ts, now consolidated with PaymentInterface above)
export type Payment = PaymentInterface;
