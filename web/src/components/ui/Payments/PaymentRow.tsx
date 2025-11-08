import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";

interface PaymentRowProps {
  payment: PaymentInterface;
  onMarkPaid: (payment: PaymentInterface) => void;
  onMarkUnpaid: (payment: PaymentInterface) => void;
}

export function PaymentRow({ payment, onMarkPaid, onMarkUnpaid }: PaymentRowProps) {
  const dueDate = new Date(payment.due_date);
  const isPaid = !!payment.paid_at;
  const [isHovered, setIsHovered] = useState(false);

  const handleTogglePaid = () => {
    if (isPaid) {
      onMarkUnpaid(payment);
    } else {
      onMarkPaid(payment);
    }
  };

  return (
    <div
      className="group flex items-center justify-between py-2 hover:bg-bg-muted/5 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Left: Title and Date */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 flex-1">
          {/* Interactive Checkbox Circle - slides in on hover */}
          <motion.button
            onClick={handleTogglePaid}
            className="flex cursor-pointer items-center justify-center rounded-2xl font-medium p-1 text-white text-xs flex-shrink-0"
            style={{
              borderColor: isPaid ? "var(--color-success)" : "var(--color-text-muted)",
              backgroundColor: isPaid ? "var(--color-success)" : "var(--color-success)",
            }}
            initial={{ opacity: 0, marginRight: 0, x: -8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              marginRight: isHovered ? 36 : 0,
              x: isHovered ? 12 : -8,
            }}
            whileHover={{ scale: 1.1 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            aria-label={isPaid ? "Mark as unpaid" : "Mark as paid"}>
            PAID
            {isPaid && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white">
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.button>

          <div className="flex -ml-8 items-center gap-2 text-xl text-text-muted whitespace-nowrap transition-all duration-300">
            <span>{format(dueDate, "MMM dd")}</span>
            {isPaid && payment.paid_at && (
              <span className="text-xs text-success ml-2">• Paid {format(new Date(payment.paid_at), "MMM dd")}</span>
            )}
          </div>
          <h4 className="font-medium text-text truncate transition-all duration-300">{payment.title}</h4>
          <div className="text-xl font-bold text-primary whitespace-nowrap transition-all duration-300">
            ${payment.amount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2"></div>
    </div>
  );
}
