import { useState } from "react";
import { X, Calendar, Tag, RefreshCw } from "lucide-react";
import { PaymentInterface } from "@shared/data/Payments/interfaces";
import { calculateNextPaymentDate } from "@shared/api/payments";
import { useT } from "@shared/hooks/useT";
import type { AddPaymentModalProps } from "@shared/data/Payments/Components/PaymentComponentInterfaces";

export const AddPaymentModal = ({ isOpen, onClose, onSubmit }: AddPaymentModalProps) => {
  const { t } = useT();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    currency: "PLN",
    cycle: "monthly" as PaymentInterface["cycle"],
    category: "subscription" as PaymentInterface["category"],
    description: "",
    reminderDays: 3,
    autoRenew: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.amount) {
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentData: Omit<PaymentInterface, "id" | "userId"> = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        cycle: formData.cycle,
        category: formData.category,
        description: formData.description,
        nextPaymentDate: selectedDate,
        isPaid: false,
        autoRenew: formData.autoRenew,
        reminderDays: formData.reminderDays,
      };

      await onSubmit(paymentData);

      // Reset form
      setFormData({
        name: "",
        amount: "",
        currency: "PLN",
        cycle: "monthly",
        category: "subscription",
        description: "",
        reminderDays: 3,
        autoRenew: true,
      });
      setSelectedDate(new Date().toISOString().split("T")[0]);
      onClose();
    } catch (error) {
      console.error("Error submitting payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCycleChange = (cycle: PaymentInterface["cycle"]) => {
    setFormData((prev) => ({ ...prev, cycle }));
    // Auto-calculate next payment date based on cycle
    const nextDate = calculateNextPaymentDate(cycle, new Date(selectedDate));
    setSelectedDate(nextDate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{t("payments.modal.addNewPayment")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("payments.modal.paymentNameRequired")}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("payments.modal.paymentNamePlaceholder")}
              required
            />
          </div>

          {/* Amount and Currency */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("payments.modal.amountRequired")}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("payments.modal.amountPlaceholder")}
                  required
                />
              </div>
            </div>
            <div className="w-20">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("payments.modal.currency")}</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="PLN">PLN</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Tag size={16} className="inline mr-1" />
              {t("payments.modal.category")}
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value as PaymentInterface["category"] }))
              }
              className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="subscription">{t("payments.modal.categories.subscription")}</option>
              <option value="utility">{t("payments.modal.categories.utility")}</option>
              <option value="insurance">{t("payments.modal.categories.insurance")}</option>
              <option value="loan">{t("payments.modal.categories.loan")}</option>
              <option value="rent">{t("payments.modal.categories.rent")}</option>
              <option value="other">{t("payments.modal.categories.other")}</option>
            </select>
          </div>

          {/* Cycle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <RefreshCw size={16} className="inline mr-1" />
              {t("payments.modal.paymentFrequency")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "weekly", label: t("payments.modal.frequencies.weekly") },
                { value: "monthly", label: t("payments.modal.frequencies.monthly") },
                { value: "quarterly", label: t("payments.modal.frequencies.quarterly") },
                { value: "yearly", label: t("payments.modal.frequencies.yearly") },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCycleChange(option.value as PaymentInterface["cycle"])}
                  className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.cycle === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Next Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="inline mr-1" />
              {t("payments.modal.nextPayment")}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reminder Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("payments.modal.reminderDays")}</label>
            <input
              type="number"
              min="0"
              max="30"
              value={formData.reminderDays}
              onChange={(e) => setFormData((prev) => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("payments.modal.description")}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder={t("payments.modal.descriptionPlaceholder")}
            />
          </div>

          {/* Auto Renew */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoRenew"
              checked={formData.autoRenew}
              onChange={(e) => setFormData((prev) => ({ ...prev, autoRenew: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoRenew" className="ml-2 block text-sm text-gray-700">
              {t("payments.modal.autoRenew")}
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              {t("payments.modal.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? t("payments.modal.adding") : t("payments.modal.addPaymentButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
