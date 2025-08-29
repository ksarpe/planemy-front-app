import { usePaymentsContext } from "@/hooks/context/usePaymentsContext";
import { usePayments } from "@/hooks/payments";
import { useState } from "react";
import { AddPaymentModal, PaymentSection, PaymentSummary, categorizePayments } from "@/components/ui/Payments";
import { Plus, TrendingUp, DollarSign, AlertTriangle, Clock, Calendar } from "lucide-react";
import { startOfWeek, endOfWeek, addWeeks, format } from "date-fns";
import { useT } from "@/hooks/useT";

export default function Payments() {
  const { payments } = usePaymentsContext();
  const { addPayment } = usePayments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useT();
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);

  const handleToggleExpand = (paymentId: string) => {
    setExpandedPaymentId(expandedPaymentId === paymentId ? null : paymentId);
  };

  // Calculate week boundaries for dynamic titles
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
  const nextWeekStart = addWeeks(thisWeekStart, 1);
  const nextWeekEnd = addWeeks(thisWeekEnd, 1);

  // Dynamic titles with actual dates
  const thisWeekTitle = `(${format(thisWeekStart, "dd.MM")} - ${format(thisWeekEnd, "dd.MM")})`;
  const nextWeekTitle = `(${format(nextWeekStart, "dd.MM")} - ${format(nextWeekEnd, "dd.MM")})`;

  // Use the extracted categorization logic
  const categorizedPayments = categorizePayments(payments);
  const { overduePayments, upcomingThisWeek, upcomingNextWeek, remainingPayments, totalMonthlyAmount } =
    categorizedPayments;

  return (
    <div className="flex h-full p-2 md:p-4">
      <div className="w-full overflow-auto flex flex-col gap-4 md:gap-6 p-4 md:p-6">
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Monthly */}
              <div className="bg-bg rounded-md p-3 md:p-4 shadow-md border border-bg-alt">
                <div className="flex items-center gap-2 text-success mb-1">
                  <TrendingUp size={18} />
                  <span className="text-xs md:text-sm font-medium">{t("payments.monthlyExpenses")}</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-text">{totalMonthlyAmount.toFixed(2)} PLN</div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-text px-3 md:px-4 py-2 rounded-md hover:opacity-90 transition-opacity w-full md:w-auto justify-center shadow-md">
                <Plus size={18} />
                <span className="text-sm md:text-base">{t("payments.addPayment")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <PaymentSummary categorizedPayments={categorizedPayments} />

        {/* Categorized Payments List */}
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <DollarSign size={40} className="mx-auto text-text-light mb-4 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-text mb-2">{t("payments.noPayments")}</h3>
              <p className="text-sm md:text-base text-text-light mb-4">{t("payments.addFirstPayment")}</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-text px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-sm md:text-base shadow-md">
                {t("payments.addPayment")}
              </button>
            </div>
          ) : (
            <>
              {/* Urgent - Overdue Payments */}
              <PaymentSection
                title={t("dashboard.urgent")}
                payments={overduePayments}
                icon={AlertTriangle}
                iconColor="text-negative"
                bgColor="bg-bg"
                emptyMessage={t("payments.noOverduePayments")}
                expandedPaymentId={expandedPaymentId}
                onToggleExpand={handleToggleExpand}
              />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* This Week */}
                <PaymentSection
                  title={t("payments.thisWeek") + thisWeekTitle}
                  payments={upcomingThisWeek}
                  icon={Clock}
                  iconColor="text-primary"
                  bgColor="bg-bg"
                  emptyMessage={t("payments.noPaymentsThisWeek")}
                  expandedPaymentId={expandedPaymentId}
                  onToggleExpand={handleToggleExpand}
                />

                {/* Next Week */}
                <PaymentSection
                  title={t("payments.nextWeek") + nextWeekTitle}
                  payments={upcomingNextWeek}
                  icon={Calendar}
                  iconColor="text-primary"
                  bgColor="bg-bg"
                  emptyMessage={t("payments.noPaymentsNextWeek")}
                  expandedPaymentId={expandedPaymentId}
                  onToggleExpand={handleToggleExpand}
                />

                {/* Remaining - Later */}
                <PaymentSection
                  title={t("payments.inTheFuture")}
                  payments={remainingPayments}
                  icon={Calendar}
                  iconColor="text-text-light"
                  bgColor="bg-bg"
                  emptyMessage={t("payments.noPaymentsInFuture")}
                  expandedPaymentId={expandedPaymentId}
                  onToggleExpand={handleToggleExpand}
                />
              </div>
            </>
          )}
        </div>

        {/* Add Payment Modal */}
        <AddPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addPayment} />
      </div>
    </div>
  );
}
