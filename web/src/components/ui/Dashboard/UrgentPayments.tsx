import { type PaymentInterface } from "@shared/data/Payments/interfaces";
import { AlertCircle, Clock } from "lucide-react";

interface UrgentPaymentsProps {
  upcomingPayments: (PaymentInterface & { daysLeft: number; urgent: boolean })[];
}

export default function UrgentPayments({ upcomingPayments }: UrgentPaymentsProps) {
  if (upcomingPayments.length === 0) return null;

  return (
    <div className="p-5 rounded-xl bg-bg-primary border border-border shadow-md shadow-shadow">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-negative" />
        <h3 className="font-semibold text-text">Pilne Płatności</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {upcomingPayments.map((payment) => {
          const isOverdue = payment.daysLeft < 0;
          const daysText = isOverdue
            ? `Przedawnione ${Math.abs(payment.daysLeft)} ${Math.abs(payment.daysLeft) === 1 ? "dzień" : "dni"}`
            : payment.daysLeft === 0
            ? "Dzisiaj"
            : payment.daysLeft === 1
            ? "Jutro"
            : `Za ${payment.daysLeft} ${payment.daysLeft <= 4 ? "dni" : "dni"}`;

          return (
            <div
              key={payment.id}
              className={`p-4 rounded-lg border-bg-muted-light border transition-colors cursor-pointer`}>
              <div className="flex items-center justify-between gap-4">
                {/* Left: Title and Days */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate mb-1">{payment.title}</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span
                      className={`text-xs font-medium ${
                        isOverdue ? "text-red-500" : payment.urgent ? "text-red-500" : "text-text-muted"
                      }`}>
                      {daysText}
                    </span>
                  </div>
                </div>

                {/* Right: Amount with Currency */}
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      isOverdue ? "text-negative" : payment.urgent ? "text-warning" : "text-text"
                    }`}>
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-text-muted">USD</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
