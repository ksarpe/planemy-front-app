import type { AddPaymentModalProps } from "@shared/data/Payments/Components/PaymentComponentInterfaces";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { useState } from "react";
import InputModal from "../Common/InputModal";

export const AddPaymentModal = ({ isOpen, onClose, onSubmit }: AddPaymentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const paymentData: Omit<PaymentInterface, "id"> = {
        title: values.title,
        amount: parseFloat(values.amount),
        due_date: new Date(values.dueDate).toISOString(),
        paid_at: null,
      };

      await onSubmit(paymentData);
      onClose();
    } catch (error) {
      console.error("Error submitting payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <InputModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Add New Payment"
      inputs={[
        {
          name: "title",
          label: "Title",
          placeholder: "Electric Bill - August 2024",
          required: true,
          autoFocus: true,
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "125.50",
          required: true,
        },
        {
          name: "dueDate",
          label: "Due Date",
          type: "date",
          defaultValue: today,
          required: true,
        },
      ]}
      submitButtonText="Add Payment"
      cancelButtonText="Cancel"
      isLoading={isSubmitting}
    />
  );
};
