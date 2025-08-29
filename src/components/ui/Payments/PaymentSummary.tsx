import { CategorizedPayments } from "./PaymentStats";

interface PaymentSummaryProps {
  categorizedPayments: CategorizedPayments;
}

export const PaymentSummary = ({ categorizedPayments }: PaymentSummaryProps) => {
  const { overduePayments, upcomingThisWeek, upcomingNextWeek, activePayments } = categorizedPayments;
  const totalPayments = overduePayments.length + upcomingThisWeek.length + upcomingNextWeek.length;

  if (totalPayments === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {overduePayments.length > 0 && (
        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
          {overduePayments.length} przeterminowane
        </span>
      )}
      {upcomingThisWeek.length > 0 && (
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
          {upcomingThisWeek.length} ten tydzień
        </span>
      )}
      {upcomingNextWeek.length > 0 && (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
          {upcomingNextWeek.length} następny tydzień
        </span>
      )}
      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
        {activePayments.length} aktywnych z {activePayments.length}{" "}
        łącznie
      </span>
    </div>
  );
};
