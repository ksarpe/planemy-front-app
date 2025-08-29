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
  bgColor = "bg-white",
  emptyMessage,
  expandedPaymentId,
  onToggleExpand,
}: PaymentSectionProps) => {
  if (payments.length === 0 && !emptyMessage) return null;

  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-md border border-gray-100`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className={iconColor} />
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-gray-500 italic">{emptyMessage}</p>
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
