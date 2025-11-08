import { Drawer } from "@/components/ui/Common/Drawer";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { format } from "date-fns";
import { Calendar, DollarSign, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentInterface | null;
  onUpdate: (payment: PaymentInterface, updates: Partial<PaymentInterface>) => void;
  onDelete: (paymentId: string) => void;
}

export function PaymentDetailsDrawer({ isOpen, onClose, payment, onUpdate, onDelete }: PaymentDetailsDrawerProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (payment) {
      setTitle(payment.title);
      setAmount(payment.amount.toString());
      setDueDate(format(new Date(payment.due_date), "yyyy-MM-dd"));
    }
  }, [payment]);

  const handleSave = () => {
    if (!payment) return;
    onUpdate(payment, {
      title,
      amount: parseFloat(amount),
      due_date: new Date(dueDate).toISOString(),
    });
    onClose();
  };

  const handleDelete = () => {
    if (!payment) return;
    if (window.confirm("Are you sure you want to delete this payment?")) {
      onDelete(payment.id);
      onClose();
    }
  };

  const isPaid = payment && !!payment.paid_at;
  const hasChanges = payment
    ? title !== payment.title ||
      parseFloat(amount) !== payment.amount ||
      dueDate !== format(new Date(payment.due_date), "yyyy-MM-dd")
    : false;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="md"
      header={
        <div className="flex items-center gap-2 flex-1">
          <h2 className="text-lg font-semibold text-text">Payment Details</h2>
        </div>
      }
      footer={
        <div className="flex gap-2">
          <Button onClick={handleDelete} variant="ghost" className="text-negative hover:bg-negative/10">
            <Trash2 size={18} />
            Delete
          </Button>
          <div className="flex-1" />
          <Button onClick={onClose} variant="default">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary" disabled={!hasChanges || !title || !amount || !dueDate}>
            Save Changes
          </Button>
        </div>
      }>
      <div className="p-6 space-y-6">
        {/* Payment Status */}
        {isPaid && payment && (
          <div className="bg-success/10 border border-success/20 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm font-medium text-success">
                Paid on {format(new Date(payment.paid_at!), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <Input
            label="Title"
            type="text"
            placeholder="Electric Bill - August 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div>
          <Input
            label="Amount"
            type="number"
            placeholder="125.50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
            <DollarSign size={16} />
            <span>${parseFloat(amount || "0").toFixed(2)}</span>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <Input
            label="Due Date"
            type="date"
            placeholder=""
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
            <Calendar size={16} />
            <span>{dueDate ? format(new Date(dueDate), "MMMM dd, yyyy") : "No date selected"}</span>
          </div>
        </div>

        {/* Created/Updated Info */}
        {payment && (
          <div className="pt-4 border-t border-bg-muted-light">
            <div className="space-y-2 text-xs text-text-muted">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{format(new Date(payment.due_date), "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
