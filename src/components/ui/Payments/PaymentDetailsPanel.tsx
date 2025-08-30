import { usePayments } from "@/hooks/payments";
import {
  Tag,
  Calendar,
  Clock,
  DollarSign,
  Check,
  Trash2,
  Bell,
  Repeat,
  History,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { getDaysUntilPayment, isPaymentPaidForCurrentPeriod } from "@/api/payments";
import { format } from "date-fns";
import { EditableText } from "@/components/ui/Common/EditableText";
import { useTranslation } from "react-i18next";
import type { PaymentDetailsPanelProps } from "@/data/Payments/Components/PaymentComponentInterfaces";

export const PaymentDetailsPanel = ({ payment }: PaymentDetailsPanelProps) => {
  const { t } = useTranslation();
  const { markAsPaid, removePayment, updatePayment } = usePayments();

  const daysUntil = getDaysUntilPayment(payment.nextPaymentDate);
  const isPaidForCurrentPeriod = isPaymentPaidForCurrentPeriod(payment);

  const handleUpdateName = async (newName: string) => {
    await updatePayment(payment.id, { name: newName });
  };

  const handleUpdateAmount = async (newAmount: string) => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error(t("payments.details.errors.invalidAmount"));
    }
    await updatePayment(payment.id, { amount });
  };

  const handleUpdateDescription = async (newDescription: string) => {
    await updatePayment(payment.id, { description: newDescription });
  };

  const handleUpdateReminderDays = async (newDays: string) => {
    const days = parseInt(newDays);
    if (isNaN(days) || days < 0) {
      throw new Error(t("payments.details.errors.invalidDays"));
    }
    await updatePayment(payment.id, { reminderDays: days });
  };

  const handleUpdateNextPaymentDate = async (newDate: string) => {
    const date = new Date(newDate);
    if (isNaN(date.getTime())) {
      throw new Error(t("payments.details.errors.invalidDate"));
    }
    // Convert to ISO string format (YYYY-MM-DD)
    const isoDate = date.toISOString().split("T")[0];
    await updatePayment(payment.id, { nextPaymentDate: isoDate });
  };

  const getStatusBadge = () => {
    if (isPaidForCurrentPeriod) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success text-text rounded-full text-xs">
          <Check size={10} />
          Opłacone
        </span>
      );
    }
    if (daysUntil < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-negative text-text rounded-full text-xs">
          <Clock size={10} />
          Przeterminowane
        </span>
      );
    }
    if (daysUntil <= payment.reminderDays) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-bg-hover text-text rounded-full text-xs">
          <Bell size={10} />
          Wkrótce
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-text rounded-full text-xs">
        <Calendar size={10} />
        Planowane
      </span>
    );
  };

  return (
    <div className="px-4 pb-4 border-t border-bg-alt bg-bg-alt/10">
      {/* Status and Description */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-text">{t("payments.details.title")}</h4>
          {getStatusBadge()}
        </div>
      </div>

      {/* Editable Description */}
      <div className="py-2">
        <div className="flex items-start gap-2 text-sm text-text-light">
          <Tag size={14} className="mt-0.5 text-text-light" />
          <div className="flex-1">
            <p className="text-xs text-text-light uppercase tracking-wide mb-1">{t("payments.details.description")}</p>
            <EditableText
              value={payment.description || t("payments.details.addDescription")}
              onSave={handleUpdateDescription}
              placeholder={t("payments.details.addDescriptionPlaceholder")}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Payment Details Grid - With Editable Fields */}
      <div className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Nazwa płatności */}
          <div className="lg:col-span-2 flex items-center gap-3 p-3 bg-bg rounded-lg border border-bg-alt shadow-md">
            <div className="p-2 bg-primary rounded-lg">
              <Tag size={16} className="text-text" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-light uppercase tracking-wide">{t("payments.details.name")}</p>
              <EditableText
                value={payment.name}
                onSave={handleUpdateName}
                placeholder={t("payments.details.name")}
                className="w-full"
              />
            </div>
          </div>

          {/* Kwota */}
          <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-bg-alt shadow-md">
            <div className="p-2 bg-success rounded-lg">
              <DollarSign size={16} className="text-text" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-light uppercase tracking-wide">{t("payments.details.amount")}</p>
              <EditableText
                value={payment.amount.toFixed(2)}
                onSave={handleUpdateAmount}
                type="number"
                suffix={`${payment.currency} / ${t(`payments.modal.frequencies.${payment.cycle}`)}`}
                className="w-full"
              />
            </div>
          </div>

          {/* Przypomnienie */}
          <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-bg-alt shadow-md">
            <div className="p-2 bg-bg-hover rounded-lg">
              <Bell size={16} className="text-text" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-light uppercase tracking-wide">{t("payments.details.reminder")}</p>
              <EditableText
                value={payment.reminderDays.toString()}
                onSave={handleUpdateReminderDays}
                type="number"
                suffix={t("payments.details.reminderSuffix")}
                className="w-full"
              />
            </div>
          </div>

          {/* Następna płatność - Now Editable */}
          <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-bg-alt shadow-md">
            <div className="p-2 bg-primary rounded-lg">
              <Calendar size={16} className="text-text" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-light uppercase tracking-wide">{t("payments.details.nextPayment")}</p>
              <EditableText
                value={format(new Date(payment.nextPaymentDate), "yyyy-MM-dd")}
                displayValue={format(new Date(payment.nextPaymentDate), "dd.MM.yyyy")}
                onSave={handleUpdateNextPaymentDate}
                type="date"
                className="w-full"
              />
              <p className="text-xs text-text-light mt-1">
                {daysUntil >= 0
                  ? t("payments.item.dueIn", { days: daysUntil })
                  : t("payments.item.overdue", { days: Math.abs(daysUntil) })}
              </p>
            </div>
          </div>

          {/* Ostatnia płatność - Read only */}
          <div className="flex items-center gap-3 p-3 bg-bg rounded-lg border border-bg-alt shadow-md">
            <div className="p-2 bg-bg-hover rounded-lg">
              <History size={16} className="text-text" />
            </div>
            <div>
              <p className="text-xs text-text-light uppercase tracking-wide">{t("payments.details.lastPayment")}</p>
              <p className="font-semibold text-text text-sm">
                {payment.lastPaymentDate
                  ? format(new Date(payment.lastPaymentDate), "dd.MM.yyyy")
                  : t("payments.details.noLastPayment")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="py-3 ">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Repeat size={12} className="text-text-light" />
            <span className="text-text-light">
              {t("payments.details.autoRenewal")}{" "}
              {payment.autoRenew ? t("payments.details.autoRenewalEnabled") : t("payments.details.autoRenewalDisabled")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard size={12} className="text-text-light" />
            <span className="text-text-light">
              {t("payments.details.category")} {t(`payments.modal.categories.${payment.category}`)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-text-light" />
            <span className="text-text-light">
              {t("payments.details.yearlyCost")} {(payment.amount * (payment.cycle === "monthly" ? 12 : 1)).toFixed(2)}{" "}
              {payment.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-3 ">
        {!isPaidForCurrentPeriod && (
          <button
            onClick={() => markAsPaid(payment.id)}
            className="inline-flex items-center gap-2 bg-success text-text px-4 py-2 rounded-lg hover:bg-success-hover transition-colors text-sm font-medium">
            <Check size={14} />
            <span className="hidden sm:inline">{t("payments.details.markAsPaid")}</span>
            <span className="sm:hidden">{t("payments.details.markAsPaidShort")}</span>
          </button>
        )}

        <button
          onClick={() => removePayment(payment.id)}
          className="inline-flex items-center gap-2 bg-negative text-text px-4 py-2 rounded-lg hover:opacity-80 transition-colors text-sm font-medium ml-auto">
          <Trash2 size={14} />
          <span className="hidden sm:inline">{t("payments.details.delete")}</span>
        </button>
      </div>
    </div>
  );
};
