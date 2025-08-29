import { PaymentInterface } from "@/data/Payments/interfaces";
import PaymentItem from "./PaymentItem";

interface PaymentSectionProps {
  title: string;
  payments: PaymentInterface[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  bgColor?: string;
  emptyMessage?: string;
  expandedPaymentId?: string | null;
  onToggleExpand?: (paymentId: string) => void;
}

export const PaymentSection = ({
  title,
  payments,
  icon: Icon,
  iconColor,
  bgColor = "bg-bg dark:bg-bg-dark", // Use theme background instead of rainbow colors
  emptyMessage,
  expandedPaymentId,
  onToggleExpand,
}: PaymentSectionProps) => {
  if (payments.length === 0 && !emptyMessage) return null;

  return (
    <div className="bg-bg dark:bg-bg-dark rounded-lg p-4 shadow-md border border-bg-alt dark:border-bg-alt-dark">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-primary dark:text-primary-dark" />
        <h3 className="font-medium text-text dark:text-text-dark">{title}</h3>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-text-light dark:text-text-light-dark italic">{emptyMessage}</p>
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
