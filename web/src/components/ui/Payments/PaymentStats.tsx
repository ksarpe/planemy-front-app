import { PaymentInterface } from "@shared/data/Payments/interfaces";
import { getDaysUntilPayment } from "@shared/api/payments";
import { endOfWeek, startOfWeek, isWithinInterval, addWeeks, parseISO } from "date-fns";
import type { CategorizedPayments } from "@shared/data/Payments/Components/PaymentComponentInterfaces";

export { type CategorizedPayments } from "@shared/data/Payments/Components/PaymentComponentInterfaces";

export const categorizePayments = (payments: PaymentInterface[]): CategorizedPayments => {
  const totalMonthlyAmount = payments.filter((p) => p.cycle === "monthly").reduce((sum, p) => sum + p.amount, 0);

  const now = new Date();

  // Calculate week boundaries (Monday to Sunday)
  // Polish locale: Monday = start of week
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
  const nextWeekStart = addWeeks(thisWeekStart, 1); // Next Monday
  const nextWeekEnd = addWeeks(thisWeekEnd, 1); // Next Sunday

  // Categorize payments based on actual week boundaries
  const overduePayments = payments.filter((p) => getDaysUntilPayment(p.nextPaymentDate) < 0);

  const upcomingThisWeek = payments.filter((p) => {
    const paymentDate = parseISO(p.nextPaymentDate);
    return (
      isWithinInterval(paymentDate, { start: thisWeekStart, end: thisWeekEnd }) &&
      getDaysUntilPayment(p.nextPaymentDate) >= 0
    );
  });

  const upcomingNextWeek = payments.filter((p) => {
    const paymentDate = parseISO(p.nextPaymentDate);
    return isWithinInterval(paymentDate, { start: nextWeekStart, end: nextWeekEnd });
  });

  const remainingPayments = payments.filter((p) => {
    const paymentDate = parseISO(p.nextPaymentDate);
    const isNotOverdue = getDaysUntilPayment(p.nextPaymentDate) >= 0;
    const isNotThisWeek = !isWithinInterval(paymentDate, { start: thisWeekStart, end: thisWeekEnd });
    const isNotNextWeek = !isWithinInterval(paymentDate, { start: nextWeekStart, end: nextWeekEnd });

    return isNotOverdue && isNotThisWeek && isNotNextWeek;
  });

  return {
    overduePayments,
    upcomingThisWeek,
    upcomingNextWeek,
    remainingPayments,
    totalMonthlyAmount,
  };
};
