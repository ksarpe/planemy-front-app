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
