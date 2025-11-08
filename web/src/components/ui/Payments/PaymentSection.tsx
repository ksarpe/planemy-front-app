import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import type { LucideIcon } from "lucide-react";
import { PaymentRow } from "./PaymentRow";

interface PaymentSectionProps {
  title: string;
  icon: LucideIcon;
  count: number;
  total: number;
  payments: PaymentInterface[];
  bgColor: string;
  borderColor: string;
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
  bgColor,
  borderColor,
  textColor,
  onMarkPaid,
  onMarkUnpaid,
}: PaymentSectionProps) {
  return (
    <div className="border-x border-bg-muted-light rounded-2xl shadow-md shadow-shadow">
      <div className={`px-6 py-3 ${bgColor} border-b ${borderColor} rounded-2xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={textColor} size={16} />
            <h3 className={`text-sm font-semibold ${textColor}`}>
              {title} ({count})
            </h3>
          </div>
          <p className={`text-sm font-bold ${textColor}`}>${total.toFixed(2)}</p>
        </div>
      </div>
      <div className="divide-y divide-bg-muted-light">
        {payments.map((payment) => (
          <PaymentRow
            key={payment.id}
            payment={payment}
            onMarkPaid={onMarkPaid}
            onMarkUnpaid={onMarkUnpaid}
          />
        ))}
      </div>
    </div>
  );
}
