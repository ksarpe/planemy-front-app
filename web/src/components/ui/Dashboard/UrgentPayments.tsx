import { type PaymentInterface } from "@shared/data/Payments/interfaces";
import { AlertCircle } from "lucide-react";

interface UrgentPaymentsProps {
  upcomingPayments: PaymentInterface[];
}

export default function UrgentPayments({ upcomingPayments }: UrgentPaymentsProps) {
  if (upcomingPayments.length === 0) return null;

  return (
    <div className="p-5 rounded-xl bg-bg-primary border border-border shadow-md shadow-shadow">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-negative" />
        <h3 className="font-semibold text-text">Urgent Payments</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {upcomingPayments.map((payment) => (
          <div
            key={payment.id}
            className={`p-3 rounded-lg border transition-colors cursor-pointer ${
              new Date(payment.due_date) < new Date()
                ? "bg-negative/5 border-negative/20 hover:border-negative/40"
                : "bg-bg-secondary border-border hover:border-warning/30"
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{payment.title}</p>
              </div>
              <p
                className={`text-sm font-bold ml-3 ${
                  new Date(payment.due_date) < new Date() ? "text-negative" : "text-text"
                }`}>
                {payment.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
