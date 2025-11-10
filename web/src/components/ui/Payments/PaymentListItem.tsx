import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { format, isBefore, startOfToday } from "date-fns";
import { AlertCircle, Calendar, CheckCircle2 } from "lucide-react";

interface PaymentListItemProps {
  payment: PaymentInterface;
  onClick: (payment: PaymentInterface) => void;
  isSelected?: boolean;
}

export function PaymentListItem({ payment, onClick, isSelected = false }: PaymentListItemProps) {
  const isPaid = !!payment.paid_at;
  const isOverdue = !isPaid && isBefore(new Date(payment.due_date), startOfToday());
  const dueDate = new Date(payment.due_date);

  return (
    <li
      className={`rounded-2xl px-4 py-2 text-text cursor-pointer shadow-md border border-bg-muted-light hover:scale-101 duration-200
      ${isSelected && "border-primary"}`}
      onClick={() => onClick(payment)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Status Icon */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 transition-all ${
              isPaid ? " text-success" : isOverdue ? " text-negative" : " text-primary"
            }`}>
            {isPaid ? <CheckCircle2 size={20} /> : isOverdue ? <AlertCircle size={20} /> : <Calendar size={20} />}
          </div>

          {/* Payment content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-sm leading-5 transition-colors duration-200 ${
                isPaid ? "line-through text-text-muted" : ""
              }`}>
              {payment.title}
            </h3>

            {/* Due date and recurrence */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <div
                className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                  isOverdue
                    ? "text-negative"
                    : isPaid
                    ? "text-text-muted"
                    : isSelected
                    ? "text-primary"
                    : "text-text-muted"
                }`}>
                <Calendar size={12} />
                <span>{format(dueDate, "MMM dd, yyyy")}</span>
                {isOverdue && <AlertCircle size={12} className="text-negative" />}
              </div>

              {/* Paid date */}
              {isPaid && payment.paid_at && (
                <>
                  <span className="text-text-muted text-xs">•</span>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 size={12} />
                    <span>Paid {format(new Date(payment.paid_at), "MMM dd")}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Amount and status indicators */}
        <div className="flex flex-col items-end gap-1 ml-3">
          <div
            className={`text-xl font-bold transition-colors ${
              isPaid ? "text-success" : isOverdue ? "text-negative" : "text-primary"
            }`}>
            ${payment.amount.toFixed(2)}
          </div>

          {isPaid && <span className="text-xs text-success font-medium">Paid</span>}
          {isOverdue && <span className="text-xs text-negative font-medium">Overdue</span>}
        </div>
      </div>
    </li>
  );
}
