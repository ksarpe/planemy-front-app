import { AddPaymentModal } from "@/components/ui/Payments";
// import { PaymentSection, PaymentSummary, categorizePayments } from "@/components/ui/Payments";
import { useCreatePayment, usePayments } from "@shared/hooks/payments";
// import { useT } from "@shared/hooks/utils/useT";
// import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/shadcn/button";

export default function Payments() {
  const { data: paymentsResponse } = usePayments();
  const createPaymentMutation = useCreatePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const payments = paymentsResponse?.items || [];

  const handleAddPayment = async (paymentData: Omit<PaymentInterface, "id">) => {
    await createPaymentMutation.mutateAsync(paymentData);
  };

  // COMMENTED OUT - Categorization logic (requires category field in database)
  // const handleToggleExpand = (paymentId: string) => {
  //   setExpandedPaymentId(expandedPaymentId === paymentId ? null : paymentId);
  // };
  // const now = new Date();
  // const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  // const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  // const nextWeekStart = addWeeks(thisWeekStart, 1);
  // const nextWeekEnd = addWeeks(thisWeekEnd, 1);
  // const thisWeekTitle = `(${format(thisWeekStart, "dd.MM")} - ${format(thisWeekEnd, "dd.MM")})`;
  // const nextWeekTitle = `(${format(nextWeekStart, "dd.MM")} - ${format(nextWeekEnd, "dd.MM")})`;
  // const categorizedPayments = categorizePayments(payments);
  // const { overduePayments, upcomingThisWeek, upcomingNextWeek, remainingPayments, totalMonthlyAmount } = categorizedPayments;

  return (
    <div className="flex h-full overflow-auto scrollbar-hide p-2 md:p-4">
      <div className="w-full flex flex-col gap-4 md:gap-6 p-4 md:p-6">
        {/* Header */}
        {payments.length != 0 && (
          <div className="flex justify-end items-center">
            <Button onClick={() => setIsModalOpen(true)} variant="primary">
              <Plus size={18} />
              <span className="text-sm md:text-base">Add Bill</span>
            </Button>
          </div>
        )}

        {/* Bills List */}
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <DollarSign size={40} className="mx-auto text-text-muted mb-4" />
              <h3 className="text-base md:text-lg font-medium text-text mb-2">No bills yet</h3>
              <p className="text-sm md:text-base text-text-muted mb-4">Add your first bill to get started</p>
              <Button onClick={() => setIsModalOpen(true)} variant="primary">
                Add first bill
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-bg-alt p-4 rounded-2xl border border-bg-hover">
                  <h3 className="font-semibold text-text mb-2">{payment.title}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">${payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-text-muted mb-2">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                  {payment.paid_at ? (
                    <span className="inline-block px-2 py-1 text-xs bg-success text-white rounded">Paid</span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs bg-warning text-white rounded">Unpaid</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Payment Modal */}
        <AddPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddPayment} />
      </div>
    </div>
  );
}
