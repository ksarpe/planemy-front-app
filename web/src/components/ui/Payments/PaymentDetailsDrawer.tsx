import { Drawer } from "@/components/ui/Common/Drawer";
import { Button } from "@/components/ui/Utils/button";
import { Input } from "@/components/ui/Utils/input";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { parseRecurrenceOption } from "@shared/utils/helpers";
import { format, getDate, getDay } from "date-fns";
import { Calendar, Check, ChevronDown, DollarSign, Repeat, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Command, CommandGroup, CommandItem, CommandList } from "../Utils/command";
import { Popover, PopoverContent, PopoverTrigger } from "../Utils/popover";

type RecurrenceOption = {
  value: string;
  label: string;
  getDescription?: (date: Date) => string;
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ordinalSuffixes = ["th", "st", "nd", "rd"];

const getOrdinal = (n: number): string => {
  const s = n % 100;
  return n + (ordinalSuffixes[(s - 20) % 10] || ordinalSuffixes[s] || ordinalSuffixes[0]);
};

const getWeekOfMonth = (date: Date): number => {
  const dayOfMonth = getDate(date);
  return Math.ceil(dayOfMonth / 7);
};

const recurrenceOptions: RecurrenceOption[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Every day" },
  { value: "weekday", label: "Every weekday", getDescription: () => "Mon – Fri" },
  {
    value: "weekly",
    label: "Every week",
    getDescription: (date) => `on ${dayNames[getDay(date)]}`,
  },
  {
    value: "monthly",
    label: "Every month",
    getDescription: (date) => `on the ${getOrdinal(getDate(date))}`,
  },
  {
    value: "monthly-day",
    label: "Every month",
    getDescription: (date) => {
      const weekNum = getWeekOfMonth(date);
      const ordinals = ["", "1st", "2nd", "3rd", "4th", "5th"];
      return `on the ${ordinals[weekNum]} ${dayNames[getDay(date)]}`;
    },
  },
  {
    value: "yearly",
    label: "Every year",
    getDescription: (date) => `on ${format(date, "MMM d")}`,
  },
];

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
  const [recurrence, setRecurrence] = useState("none");
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);

  useEffect(() => {
    if (payment) {
      setTitle(payment.title);
      setAmount(payment.amount.toString());
      setDueDate(format(new Date(payment.due_date), "yyyy-MM-dd"));

      // Determine recurrence value from recurrence_rule
      if (!payment.recurrence_rule) {
        setRecurrence("none");
      } else {
        const rule = payment.recurrence_rule;
        if (rule.frequency === "daily") {
          if (rule.byweekday && rule.byweekday.length === 5) {
            setRecurrence("weekday");
          } else {
            setRecurrence("daily");
          }
        } else if (rule.frequency === "weekly") {
          setRecurrence("weekly");
        } else if (rule.frequency === "monthly") {
          // Check if it's monthly-day (by weekday position) or monthly (by date)
          if (rule.byweekday && rule.byweekday.length > 0) {
            setRecurrence("monthly-day");
          } else {
            setRecurrence("monthly");
          }
        } else if (rule.frequency === "yearly") {
          setRecurrence("yearly");
        } else {
          setRecurrence("none");
        }
      }
    }
  }, [payment]);

  const handleSave = () => {
    if (!payment) return;
    onUpdate(payment, {
      title,
      amount: parseFloat(amount),
      due_date: new Date(dueDate).toISOString(),
      recurrence_rule: parseRecurrenceOption(recurrence, new Date(dueDate)),
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
      dueDate !== format(new Date(payment.due_date), "yyyy-MM-dd") ||
      JSON.stringify(parseRecurrenceOption(recurrence, new Date(dueDate))) !== JSON.stringify(payment.recurrence_rule)
    : false;

  const selectedRecurrenceLabel = recurrenceOptions.find((opt) => opt.value === recurrence)?.label || "Does not repeat";

  // Generate dynamic descriptions based on selected due date
  const dynamicRecurrenceOptions = useMemo(() => {
    const selectedDate = new Date(dueDate || new Date());
    return recurrenceOptions.map((option) => ({
      ...option,
      description: option.getDescription ? option.getDescription(selectedDate) : undefined,
    }));
  }, [dueDate]);

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

        {/* Recurrence Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text">Recurrence</label>
          <Popover open={recurrenceOpen} onOpenChange={setRecurrenceOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="link"
                role="combobox"
                aria-expanded={recurrenceOpen}
                className="w-full justify-between border border-bg-muted-light px-3">
                <div className="flex items-center gap-2">
                  <Repeat size={16} className="text-text-muted" />
                  <span className="text-sm text-text">{selectedRecurrenceLabel}</span>
                </div>
                <ChevronDown size={16} className="text-text-muted" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full min-w-[var(--radix-popper-anchor-width)] p-0 bg-bg-primary border-bg-muted-light"
              align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {dynamicRecurrenceOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(value) => {
                          setRecurrence(value);
                          setRecurrenceOpen(false);
                        }}
                        className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-bg-secondary rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-text-muted mt-0.5">{option.description}</div>
                          )}
                        </div>
                        {recurrence === option.value && <Check size={16} className="text-primary flex-shrink-0" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
