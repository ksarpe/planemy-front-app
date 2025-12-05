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
  onMarkPaid: (payment: PaymentInterface) => void;
  onMarkUnpaid: (payment: PaymentInterface) => void;
  onDelete: (paymentId: string) => void;
}

export function PaymentSection({
  title,
  icon: Icon,
  count,
  total,
  payments,
  textColor,
  onMarkPaid,
  onMarkUnpaid,
}: PaymentSectionProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-bg-muted-light">
      {/* Section header with full width background */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-muted/50">
        <div className="flex items-center gap-2.5">
          <Icon className={textColor} size={18} />
          <h3 className={`text-base font-semibold ${textColor}`}>{title}</h3>
          <span className="text-xs font-medium text-text-muted">({count})</span>
        </div>
        <p className={`text-base font-bold ${textColor}`}>${total.toFixed(2)}</p>
      </div>

      {/* Payment items */}
      <div className="flex flex-col bg-bg-primary">
        {payments.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} onMarkPaid={onMarkPaid} onMarkUnpaid={onMarkUnpaid} />
        ))}
      </div>
    </div>
  );
}
