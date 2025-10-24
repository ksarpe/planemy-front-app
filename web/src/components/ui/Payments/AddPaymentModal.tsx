import type { AddPaymentModalProps } from "@shared/data/Payments/Components/PaymentComponentInterfaces";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../shadcn/button";

export const AddPaymentModal = ({ isOpen, onClose, onSubmit }: AddPaymentModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dueDate, setDueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.amount) {
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentData: Omit<PaymentInterface, "id"> = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        due_date: new Date(dueDate).toISOString(),
        paid_at: null,
      };

      await onSubmit(paymentData);

      // Reset form
      setFormData({
        title: "",
        amount: "",
      });
      setDueDate(new Date().toISOString().split("T")[0]);
      onClose();
    } catch (error) {
      console.error("Error submitting payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-bg rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-bg-hover">
          <h2 className="text-xl font-semibold text-text">Add new payment</h2>
          <Button onClick={onClose} variant={"default"}>
            <X size={24} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-bg-alt border border-bg-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
              placeholder="Electric Bill - August 2024"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">Amount *</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 bg-bg-alt border border-bg-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
              placeholder="125.50"
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-bg-alt border border-bg-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-2 pt-4 ">
            <Button type="button" onClick={onClose} variant={"default"}>
              Cancel
            </Button>
            {/* MAKE IT LOADING BUTTON */}
            <Button type="submit" disabled={isSubmitting} variant={"primary"} className="flex-1">
              {isSubmitting ? "Adding..." : "Add Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
