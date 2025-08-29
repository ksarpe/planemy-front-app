import PaymentItem from "./PaymentItem";
import type { PaymentSectionProps } from "@/data/Payments/Components/PaymentComponentInterfaces";

export const PaymentSection = ({
  title,
  payments,
  icon: Icon,
  emptyMessage,
  expandedPaymentId,
  onToggleExpand,
  isImportant = false,
}: PaymentSectionProps) => {
  if (payments.length === 0 && !emptyMessage) return null;

  return (
    <div className={`bg-bg rounded-lg p-4 shadow-md border border-bg-alt ${isImportant ? 'bg-negative/20' : ''} dark:bg-bg-dark dark:border-bg-alt-dark`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-primary" />
        <h3 className="font-medium text-text">{title}</h3>
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
