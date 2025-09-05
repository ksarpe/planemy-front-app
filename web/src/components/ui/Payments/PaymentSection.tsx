import PaymentItem from "./PaymentItem";
import type { PaymentSectionProps } from "@shared/data/Payments/Components/PaymentComponentInterfaces";

export const PaymentSection = ({
  title,
  payments,
  emptyMessage,
  expandedPaymentId,
  onToggleExpand,
  textColor,
}: PaymentSectionProps) => {
  if (payments.length === 0 && !emptyMessage) return null;

  return (
    <div className={`bg-bg rounded-lg p-4 shadow-md border border-bg-alt`}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className={`text-lg ${textColor} p-1 rounded-md shadow-sm`}>{title}</h3>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-text-light italic">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          {payments.map((payment) => (
            <PaymentItem
              key={payment.id}
              payment={payment}
              isExpanded={expandedPaymentId === payment.id}
              onToggle={() => onToggleExpand?.(payment.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
