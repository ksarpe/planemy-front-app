import { RecurrenceRule } from "@shared/data/Common/interfaces";
import { getDate, getDay } from "date-fns";

export const getDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Payment helper functions (for future categorization features)
export const getDaysUntilPayment = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isPaymentPaidForCurrentPeriod = (paidAt: string | null): boolean => {
  if (!paidAt) return false;
  const paid = new Date(paidAt);
  const now = new Date();
  // Simple check: if paid in the current month
  return paid.getMonth() === now.getMonth() && paid.getFullYear() === now.getFullYear();
};

export const calculateNextPaymentDate = (
  cycle: "weekly" | "monthly" | "quarterly" | "yearly",
  currentDate: Date,
): string => {
  const nextDate = new Date(currentDate);

  switch (cycle) {
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "quarterly":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate.toISOString().split("T")[0];
};

export function parseRecurrenceOption(optionValue: string, referenceDate: Date): RecurrenceRule | null {
  switch (optionValue) {
    case "none":
      // Brak powtarzania - nie zwracaj RecurrenceRule
      return null;

    case "daily":
      // Co dzień
      return {
        frequency: "daily",
        interval: 1,
      };

    case "weekday":
      // Dni robocze (poniedziałek-piątek)
      return {
        frequency: "weekly",
        interval: 1,
        byweekday: [1, 2, 3, 4, 5], // Mon-Fri
      };

    case "weekly":
      // Co tydzień w ten sam dzień tygodnia
      return {
        frequency: "weekly",
        interval: 1,
        byweekday: [getDay(referenceDate)], // Dzień z reference date
      };

    case "monthly":
      // Co miesiąc tego samego dnia (np. 5. dnia miesiąca)
      return {
        frequency: "monthly",
        interval: 1,
        bymonthday: getDate(referenceDate), // Dzień miesiąca z reference date
      };

    case "monthly-day":
      // Co miesiąc w ten sam dzień tygodnia i tydzień miesiąca
      // (np. każdy 2. wtorek miesiąca)
      // UWAGA: Backend obecnie nie wspiera byweekday dla monthly!
      // Ta opcja wymaga rozszerzenia API lub alternatywnego rozwiązania
      console.warn("monthly-day nie jest jeszcze w pełni wspierana przez backend");
      return {
        frequency: "monthly",
        interval: 1,
        bymonthday: getDate(referenceDate), // Fallback do dnia miesiąca
      };

    case "yearly":
      // Co rok w tę samą datę
      return {
        frequency: "yearly",
        interval: 1,
        // Backend automatycznie użyje daty z due_date/starts_at
      };

    default:
      console.error(`Unknown recurrence option: ${optionValue}`);
      return null;
  }
}
