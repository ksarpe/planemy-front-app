import { PaymentInterface } from "@/data/Payments/interfaces";
import { ChevronDown, ChevronUp, Check, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { getDaysUntilPayment, isPaymentPaidForCurrentPeriod } from "@/api/payments";
import { PaymentDetailsPanel } from "./PaymentDetailsPanel";
import { useTranslation } from "react-i18next";

interface PaymentItemProps {
  payment: PaymentInterface;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function PaymentItem({ payment, isExpanded, onToggle }: PaymentItemProps) {
  const { t } = useTranslation();

  const daysUntil = getDaysUntilPayment(payment.nextPaymentDate);
  const isOverdue = daysUntil < 0;
  const isDueSoon = daysUntil <= payment.reminderDays && daysUntil >= 0;
  const isPaidForCurrentPeriod = isPaymentPaidForCurrentPeriod(payment);

  const getCategoryIcon = (category: PaymentInterface["category"]) => {
    switch (category) {
      case "subscription":
        return "📺";
      case "utility":
        return "⚡";
      case "insurance":
        return "🛡️";
      case "loan":
        return "🏦";
      case "rent":
        return "🏠";
      default:
        return "💳";
    }
  };

  const getCategoryColor = (category: PaymentInterface["category"]) => {
    switch (category) {
      case "subscription":
        return "bg-purple-100 text-purple-800";
      case "utility":
        return "bg-yellow-100 text-yellow-800";
      case "insurance":
        return "bg-blue-100 text-blue-800";
      case "loan":
        return "bg-red-100 text-red-800";
      case "rent":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = () => {
    if (isPaidForCurrentPeriod) return "bg-green-100";
    if (isOverdue) return "bg-red-100";
    if (isDueSoon) return "bg-yellow-100";
    return "bg-white";
  };

  return (
    <div className={`rounded-md shadow-md transition-all duration-200 ${getStatusColor()}`}>
      <div
        onClick={onToggle}
        className="flex justify-between items-center p-3 md:p-4 cursor-pointer hover:bg-opacity-80">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div className="text-xl md:text-2xl flex-shrink-0">{getCategoryIcon(payment.category)}</div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm md:text-base truncate">{payment.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getCategoryColor(payment.category)}`}>
                  {t(`payments.modal.categories.${payment.category}`)}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <DollarSign size={12} className="md:w-[14px] md:h-[14px]" />
                <span className="font-medium">
                  {payment.amount.toFixed(2)} {payment.currency}
                </span>
                <span className="text-gray-500">({t(`payments.modal.frequencies.${payment.cycle}`)})</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar size={12} className="md:w-[14px] md:h-[14px]" />
                {isOverdue ? (
                  <span className="text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle size={12} className="md:w-[14px] md:h-[14px]" />
                    {t("payments.item.overdue", { days: Math.abs(daysUntil) })}
                  </span>
                ) : isDueSoon ? (
                  <span className="text-yellow-600 font-medium">{t("payments.item.dueSoon", { days: daysUntil })}</span>
                ) : (
                  <span>{t("payments.item.dueIn", { days: daysUntil })}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {isPaidForCurrentPeriod && (
            <div className="flex items-center gap-1 text-green-600 text-xs md:text-sm">
              <Check size={14} className="md:w-4 md:h-4" />
              <span className="hidden md:inline">{t("payments.item.paid")}</span>
            </div>
          )}

          <button className="text-gray-600 hover:text-gray-800 transition-colors">
            {isExpanded ? (
              <ChevronUp size={18} className="md:w-5 md:h-5" />
            ) : (
              <ChevronDown size={18} className="md:w-5 md:h-5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && <PaymentDetailsPanel payment={payment} />}
    </div>
  );
}
