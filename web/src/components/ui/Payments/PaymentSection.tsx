import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import type { LucideIcon } from "lucide-react";
import { PaymentRow } from "./PaymentRow";

interface PaymentSectionProps {
  title: string;
  icon: LucideIcon;
  count: number;
  total: number;
  payments: PaymentInterface[];
  textColor: string;
  emptyMessage?: string;
  onMarkPaid: (payment: PaymentInterface) => void;
  onDelete: (paymentId: string) => void;
}

export function PaymentSection({
  title,
  icon: Icon,
  count,
  total,
  payments,
  textColor,
  emptyMessage = "No payments",
  onMarkPaid,
}: PaymentSectionProps) {
  return (
    <div className="flex flex-col h-full overflow-auto shadow-md rounded-xl border border-bg-muted-light">
      {/* Section header with full width background */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-muted/50 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <Icon className={textColor} size={18} />
          <h3 className={`text-base font-semibold ${textColor}`}>{title}</h3>
          {payments.length > 0 && <span className="text-xs font-medium text-text-muted">({count})</span>}
        </div>
        {payments.length > 0 && <p className={`text-base font-bold ${textColor}`}>${total.toFixed(2)}</p>}
      </div>

      {/* Payment items or empty state */}
      <div className="flex flex-col bg-bg-primary flex-1 overflow-y-auto">
        {payments.length > 0 ? (
          payments.map((payment) => <PaymentRow key={payment.id} payment={payment} onMarkPaid={onMarkPaid} />)
        ) : (
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <p className="text-sm text-text-muted">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
