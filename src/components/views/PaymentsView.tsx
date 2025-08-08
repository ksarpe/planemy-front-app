import { usePaymentsContext } from "@/hooks/context/usePaymentsContext";
import { PaymentInterface } from "@/data/types";
import { useState } from "react";
import PaymentItem from "@/components/ui/Payments/PaymentItem";
import { AddPaymentModal } from "@/components/ui/Payments/AddPaymentModal";
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { getDaysUntilPayment } from "@/api/payments";

export default function Payments() {
  const { payments, addPayment } = usePaymentsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate statistics
  const activePayments = payments.filter((p) => p.isActive);
  const totalMonthlyAmount = activePayments.filter((p) => p.cycle === "monthly").reduce((sum, p) => sum + p.amount, 0);

  const upcomingPayments = activePayments
    .filter((p) => {
      const daysUntil = getDaysUntilPayment(p.nextPaymentDate);
      return daysUntil <= 7 && daysUntil >= 0;
    })
    .sort((a, b) => getDaysUntilPayment(a.nextPaymentDate) - getDaysUntilPayment(b.nextPaymentDate));

  const overduePayments = activePayments.filter((p) => getDaysUntilPayment(p.nextPaymentDate) < 0);

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full rounded-md shadow-md overflow-auto flex flex-col gap-6 bg-bg-alt  p-6">
        {/* Header with Stats */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Płatności i Subskrypcje</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Total Monthly */}
              <div className="bg-white  rounded-md p-4 shadow-sm">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <TrendingUp size={18} />
                  <span className="text-sm font-medium">Miesięczne wydatki</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 ">{totalMonthlyAmount.toFixed(2)} PLN</div>
              </div>

              {/* Upcoming Payments */}
              <div className="bg-white  rounded-md p-4 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Calendar size={18} />
                  <span className="text-sm font-medium">Nadchodzące (7 dni)</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 ">{upcomingPayments.length}</div>
              </div>

              {/* Overdue Payments */}
              <div className="bg-white  rounded-md p-4 shadow-sm">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <TrendingDown size={18} />
                  <span className="text-sm font-medium">Przeterminowane</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 ">{overduePayments.length}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
            <Plus size={18} />
            Dodaj płatność
          </button>
        </div>

        {/* Overdue Payments Alert */}
        {overduePayments.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-medium mb-2">
              ⚠️ Masz {overduePayments.length} przeterminowane płatności
            </h3>
            <div className="space-y-1">
              {overduePayments.map((payment) => (
                <div key={payment.id} className="text-red-700 text-sm">
                  {payment.name} - {Math.abs(getDaysUntilPayment(payment.nextPaymentDate))} dni temu
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-yellow-800 font-medium mb-2">📅 Nadchodzące płatności (następne 7 dni)</h3>
            <div className="space-y-1">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="text-yellow-700 text-sm flex justify-between">
                  <span>{payment.name}</span>
                  <span>Za {getDaysUntilPayment(payment.nextPaymentDate)} dni</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Wszystkie płatności</h2>
            <span className="text-sm text-gray-500">
              {activePayments.length} aktywnych z {payments.length} łącznie
            </span>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Brak płatności</h3>
              <p className="text-gray-400 mb-4">Dodaj swoją pierwszą płatność lub subskrypcję</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                Dodaj płatność
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {payments.map((payment: PaymentInterface) => (
                <PaymentItem key={payment.id} payment={payment} />
              ))}
            </ul>
          )}
        </div>

        {/* Add Payment Modal */}
        <AddPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addPayment} />
      </div>
    </div>
  );
}
