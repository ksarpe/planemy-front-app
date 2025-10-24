import { getDaysUntilPayment, isPaymentPaidForCurrentPeriod } from "@shared/api/payments";
import type { PaymentItemProps } from "@shared/data/Payments/Components/PaymentComponentInterfaces";
import { AlertCircle, Calendar, Check, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PaymentDetailsPanel } from "./PaymentDetailsPanel";

export default function PaymentItem({ payment, isExpanded, onToggle }: PaymentItemProps) {
  const { t } = useTranslation();

  // TODO: Update to new database structure (due_date, paid_at)
  const daysUntil = getDaysUntilPayment(payment.due_date);
  const isOverdue = daysUntil < 0;
  const isDueSoon = daysUntil <= 3 && daysUntil >= 0; // Default 3 days reminder
  const isPaidForCurrentPeriod = isPaymentPaidForCurrentPeriod(payment.paid_at);

  // TODO: Category field not yet in database
  const getCategoryIcon = (category?: string) => {
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

  return (
    <div className={`rounded-lg shadow-md transition-all duration-200 bg-bg-alt/50`}>
      <div
        onClick={onToggle}
        className="flex justify-between items-center md:p-4 cursor-pointer hover:bg-bg-alt/80 rounded-lg transition-colors">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div className="text-xl md:text-2xl flex-shrink-0">{getCategoryIcon()}</div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm md:text-base truncate text-text">{payment.title}</span>
                {/* TODO: Category badge when database supports it */}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs md:text-sm text-text-light">
              <div className="flex items-center gap-1">
                <DollarSign size={12} className="md:w-[14px] md:h-[14px]" />
                <span className="font-medium">${payment.amount.toFixed(2)}</span>
                {/* TODO: Cycle info when database supports it */}
              </div>

              <div className="flex items-center gap-1">
                <Calendar size={12} className="md:w-[14px] md:h-[14px]" />
                {isOverdue ? (
                  <span className="text-negative font-medium flex items-center gap-1">
                    <AlertCircle size={12} className="md:w-[14px] md:h-[14px]" />
                    {t("payments.item.overdue", { days: Math.abs(daysUntil) })}
                  </span>
                ) : isDueSoon ? (
                  <span className="text-text font-medium">{t("payments.item.dueSoon", { days: daysUntil })}</span>
                ) : (
                  <span>{t("payments.item.dueIn", { days: daysUntil })}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {isPaidForCurrentPeriod && (
            <div className="flex items-center gap-1 text-success text-xs md:text-sm">
              <Check size={14} className="md:w-4 md:h-4" />
              <span className="hidden md:inline">{t("payments.item.paid")}</span>
            </div>
          )}

          <button className="text-text-light hover:text-text transition-colors">
            {isExpanded ? (
              <ChevronUp size={18} className="md:w-5 md:h-5" />
            ) : (
              <ChevronDown size={18} className="md:w-5 md:h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Details Panel with smooth animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}>
        <PaymentDetailsPanel payment={payment} />
      </div>
    </div>
  );
}
