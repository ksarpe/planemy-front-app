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
  isActive: boolean;
  isPaid: boolean;
  autoRenew: boolean;
  reminderDays: number;
  userId: string;
}

export type EventColor =
  | "bg-red-500"
  | "bg-blue-400"
  | "bg-yellow-500"
  | "bg-green-500"
  | "bg-purple-500"
  | "bg-pink-500"
  | "bg-indigo-500"
  | "bg-orange-500";
export type EventCategory =
  | "Important"
  | "Meeting"
  | "Holiday"
  | "Health"
  | "Personal"
  | "Work"
  | "Travel"
  | "Fitness"
  | "Social"
  | "Finance"
  | "Other";
export type RecurrencePattern = "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | "custom";

// Recurrence rules interface
export interface RecurrenceRule {
  pattern: RecurrencePattern;
  interval: number; // every X days/weeks/months
  endDate?: string;
  count?: number; // number of occurrences
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  monthlyType?: "date" | "day"; // repeat on date (15th) or day (3rd Monday)
  exceptions?: string[]; // dates to skip
}

// Enhanced event interface
export interface EventInterface {
  id: string; // Changed to string for Firebase compatibility
  title: string;
  description?: string;
  category: EventCategory;
  start: string;
  end: string;
  allDay: boolean;

  // Styling and display
  color: string;

  // Recurrence
  isRecurring: boolean;
  recurrence?: RecurrenceRule;
  originalEventId?: string; // for recurring event instances

  // Location and attendees
  location?: string;
  attendees?: string[];

  // Privacy and permissions
  isPrivate: boolean;
  visibility: "public" | "private" | "shared";

  // Metadata
  userId: string;
  createdAt: string;
  updatedAt: string;
}
export interface CalendarClickContent {
  type: "event" | "date" | "date-range";
  data: EventInterface | Date | null;
}
