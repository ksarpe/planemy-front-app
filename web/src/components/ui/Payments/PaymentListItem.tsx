import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { format, isBefore, startOfToday } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle, Calendar, CheckCircle2, ChevronRight } from "lucide-react";

interface PaymentListItemProps {
  payment: PaymentInterface;
  onClick: (payment: PaymentInterface) => void;
}

export function PaymentListItem({ payment, onClick }: PaymentListItemProps) {
  const isPaid = !!payment.paid_at;
  const isOverdue = !isPaid && isBefore(new Date(payment.due_date), startOfToday());
  const dueDate = new Date(payment.due_date);

  return (
    <motion.div
      onClick={() => onClick(payment)}
      className="group relative flex items-center justify-between p-4 hover:bg-bg-muted/5 transition-colors cursor-pointer"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}>
      {/* Status Indicator - Left border */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all ${
          isPaid ? "bg-success" : isOverdue ? "bg-negative" : "bg-primary"
        }`}
      />

      {/* Content */}
      <div className="flex items-center gap-4 flex-1 ml-3">
        {/* Status Icon */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
            isPaid
              ? "bg-success/10 text-success"
              : isOverdue
              ? "bg-negative/10 text-negative"
              : "bg-primary/10 text-primary"
          }`}>
          {isPaid ? <CheckCircle2 size={20} /> : isOverdue ? <AlertCircle size={20} /> : <Calendar size={20} />}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text mb-1 truncate group-hover:text-primary transition-colors">
            {payment.title}
          </h4>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{format(dueDate, "MMM dd, yyyy")}</span>
            </div>
            {payment.recurrence_rule ? (
              <div className="flex items-center gap-1.5">
                <span className="text-text-muted-more">•</span>
                <span>Recurring</span>
              </div>
            ) : <div className="flex items-center gap-1.5">
                <span className="text-text-muted-more">•</span>
                <span>Jednorazowe</span>
              </div>}
            {isPaid && payment.paid_at && (
              <>
                <span className="text-text-muted-more">•</span>
                <div className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 size={14} />
                  <span>Paid {format(new Date(payment.paid_at), "MMM dd")}</span>
                </div>
              </>
            )}
            {isOverdue && (
              <>
                <span className="text-text-muted-more">•</span>
                <span className="text-negative font-medium">Overdue</span>
              </>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div
              className={`text-2xl font-bold transition-colors ${
                isPaid ? "text-success" : isOverdue ? "text-negative" : "text-primary"
              }`}>
              ${payment.amount.toFixed(2)}
            </div>
            {isPaid && <div className="text-xs text-success mt-0.5 font-medium">Paid</div>}
          </div>

          {/* Chevron */}
          <ChevronRight size={20} className="text-text-muted-more group-hover:text-primary transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}
