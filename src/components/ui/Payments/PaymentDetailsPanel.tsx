import { PaymentInterface } from "@/data/Payments/interfaces";
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
import { EditableText } from "../Common/EditableText";
import { useTranslation } from "react-i18next";

interface PaymentDetailsPanelProps {
  payment: PaymentInterface;
}

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
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
          <Check size={10} />
          Opłacone
        </span>
      );
    }
    if (daysUntil < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
          <Clock size={10} />
          Przeterminowane
        </span>
      );
    }
    if (daysUntil <= payment.reminderDays) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
          <Bell size={10} />
          Wkrótce
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
        <Calendar size={10} />
        Planowane
      </span>
    );
  };

  return (
    <div className="px-4 pb-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
      {/* Status and Description */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-800">{t("payments.details.title")}</h4>
          {getStatusBadge()}
        </div>
      </div>

      {/* Editable Description */}
      <div className="py-3 border-b border-gray-100">
        <div className="flex items-start gap-2 text-sm text-gray-700">
          <Tag size={14} className="mt-0.5 text-gray-500" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t("payments.details.description")}</p>
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
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Nazwa płatności */}
          <div className="lg:col-span-2 flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-md">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Tag size={16} className="text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t("payments.details.name")}</p>
              <EditableText
                value={payment.name}
                onSave={handleUpdateName}
                placeholder={t("payments.details.name")}
                className="w-full"
              />
            </div>
          </div>

          {/* Kwota */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-md">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign size={16} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t("payments.details.amount")}</p>
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
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-md">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell size={16} className="text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t("payments.details.reminder")}</p>
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
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-md">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t("payments.details.nextPayment")}</p>
              <EditableText
                value={format(new Date(payment.nextPaymentDate), "yyyy-MM-dd")}
                displayValue={format(new Date(payment.nextPaymentDate), "dd.MM.yyyy")}
                onSave={handleUpdateNextPaymentDate}
                type="date"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                {daysUntil >= 0
                  ? t("payments.item.dueIn", { days: daysUntil })
                  : t("payments.item.overdue", { days: Math.abs(daysUntil) })}
              </p>
            </div>
          </div>

          {/* Ostatnia płatność - Read only */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-md">
            <div className="p-2 bg-purple-100 rounded-lg">
              <History size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t("payments.details.lastPayment")}</p>
              <p className="font-semibold text-gray-800 text-sm">
                {payment.lastPaymentDate
                  ? format(new Date(payment.lastPaymentDate), "dd.MM.yyyy")
                  : t("payments.details.noLastPayment")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="py-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Repeat size={12} className="text-gray-500" />
            <span className="text-gray-600">
              {t("payments.details.autoRenewal")}{" "}
              {payment.autoRenew ? t("payments.details.autoRenewalEnabled") : t("payments.details.autoRenewalDisabled")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard size={12} className="text-gray-500" />
            <span className="text-gray-600">
              {t("payments.details.category")} {t(`payments.modal.categories.${payment.category}`)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-gray-500" />
            <span className="text-gray-600">
              {t("payments.details.yearlyCost")} {(payment.amount * (payment.cycle === "monthly" ? 12 : 1)).toFixed(2)}{" "}
              {payment.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
        {!isPaidForCurrentPeriod && (
          <button
            onClick={() => markAsPaid(payment.id)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            <Check size={14} />
            <span className="hidden sm:inline">{t("payments.details.markAsPaid")}</span>
            <span className="sm:hidden">{t("payments.details.markAsPaidShort")}</span>
          </button>
        )}

        <button
          onClick={() => removePayment(payment.id)}
          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium ml-auto">
          <Trash2 size={14} />
          <span className="hidden sm:inline">{t("payments.details.delete")}</span>
        </button>
      </div>
    </div>
  );
};
