// Calendar & Event related domain models (migrated from '@/data/types')

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

export interface RecurrenceRule {
  pattern: RecurrencePattern;
  interval: number; // every X days/weeks/months
  endDate?: string;
  count?: number; // number of occurrences
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  monthlyType?: "date" | "day"; // repeat on date (15th) or day (3rd Monday)
  exceptions?: string[]; // dates to skip
}

export interface EventInterface {
  id: string; // Firebase compatible string ID
  title: string;
  description?: string;
  category: EventCategory;
  start: string;
  end: string;
  allDay: boolean;
  color: string; // tailwind class or hex
  isRecurring: boolean;
  recurrence?: RecurrenceRule;
  originalEventId?: string;
  location?: string;
  attendees?: string[];
  isPrivate: boolean;
  visibility: "public" | "private" | "shared";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarClickContent {
  type: "event" | "date" | "date-range";
  data: EventInterface | Date | null;
}
