// Payment related domain models - matches backend database structure

export interface PaymentInterface {
  id: string;
  title: string;
  amount: number;
  due_date: string; // ISO 8601 format
  paid_at: string | null; // ISO 8601 format or null if unpaid
  // Future fields (commented out until backend supports them):
  // currency?: string;
  // cycle?: "weekly" | "monthly" | "quarterly" | "yearly";
  // category?: "subscription" | "utility" | "insurance" | "loan" | "rent" | "other";
  // description?: string;
  // autoRenew?: boolean;
  // reminderDays?: number;
}

export interface PaymentResponse {
  items: PaymentInterface[];
  limit: number;
  offset: number;
  total: number;
}

// Legacy Payment interface (moved from src/api/payments.ts, now consolidated with PaymentInterface above)
export type Payment = PaymentInterface;
