import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { useToast } from "@shared/hooks/toasts/useToast";
import { differenceInDays, format, isBefore, startOfToday } from "date-fns";
import { CheckCircle2, DollarSign } from "lucide-react";
import { useState } from "react";
import BaseModal from "../Common/BaseModal";
import { Button } from "../Utils/button";

interface PaymentRowProps {
  payment: PaymentInterface;
  onMarkPaid: (payment: PaymentInterface) => void;
}

export function PaymentRow({ payment, onMarkPaid }: PaymentRowProps) {
  const dueDate = new Date(payment.due_date);
  const isPaid = !!payment.paid_at;
  const isOverdue = !isPaid && isBefore(dueDate, startOfToday());
  const daysOverdue = isOverdue ? differenceInDays(startOfToday(), dueDate) : 0;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showSuccess } = useToast();

  const handleRowClick = () => {
    if (!isPaid) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmPayment = () => {
    showSuccess("Payment marked as paid!");
    onMarkPaid(payment);
    setShowConfirmModal(false);
  };

  return (
    <>
      <div
        className={`group relative flex items-center justify-between py-2 px-4 transition-colors cursor-pointer border-b border-bg-muted-light last:border-b-0 ${
          !isPaid ? "hover:bg-success/10 active:bg-success/20" : "hover:bg-bg-muted/20"
        }`}
        onClick={handleRowClick}>
        {/* Left: Date, Price, Title - All in one row */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Date */}
          <span className={`text-xs font-medium min-w-[50px] ${isOverdue ? "text-negative" : "text-text-muted"}`}>
            {format(dueDate, "MMM dd")}
            {isOverdue && daysOverdue > 0 && (
              <span className="block text-[10px] text-negative leading-tight">+{daysOverdue}d</span>
            )}
          </span>

          {/* Price */}
          <span className={`text-sm font-bold min-w-[70px] ${isPaid ? "text-success" : "text-text"}`}>
            ${payment.amount.toFixed(2)}
          </span>

          {/* Title */}
          <h4
            className={`text-sm font-medium transition-colors flex-1 min-w-0 truncate ${
              isPaid ? "line-through text-text-muted" : "text-text"
            }`}>
            {payment.title}
          </h4>
        </div>

        {/* Right: Status Icon or Pay Button */}
        {isPaid ? (
          <div className="text-success flex-shrink-0">
            <CheckCircle2 size={18} />
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-success font-medium">Click to pay</span>
            <DollarSign size={16} className="text-success" />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <BaseModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Mark Payment as Paid"
        showCloseButton={false}
        actions={
          <>
            <Button onClick={() => setShowConfirmModal(false)} variant="default">
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment} variant="primary">
              <CheckCircle2 size={16} />
              Mark as Paid
            </Button>
          </>
        }>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-bg-muted/30 rounded-lg">
            <span className="text-sm text-text-muted">Payment:</span>
            <span className="font-medium text-text">{payment.title}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-muted/30 rounded-lg">
            <span className="text-sm text-text-muted">Amount:</span>
            <span className="text-lg font-bold text-success">${payment.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-muted/30 rounded-lg">
            <span className="text-sm text-text-muted">Due Date:</span>
            <span className="font-medium text-text">{format(dueDate, "MMM dd, yyyy")}</span>
          </div>
          <p className="text-sm text-text-muted mt-4">Are you sure you want to mark this payment as paid?</p>
        </div>
      </BaseModal>
    </>
  );
}
