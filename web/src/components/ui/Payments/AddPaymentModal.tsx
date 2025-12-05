import type { AddPaymentModalProps } from "@shared/data/Payments/Components/PaymentComponentInterfaces";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { format, getDate, getDay } from "date-fns";
import { Check, ChevronDown, Repeat } from "lucide-react";
import { useMemo, useState } from "react";
import BaseModal from "../Common/BaseModal";
import { Button } from "../Utils/button";
import { Command, CommandGroup, CommandItem, CommandList } from "../Utils/command";
import { Input } from "../Utils/input";
import { Popover, PopoverContent, PopoverTrigger } from "../Utils/popover";
import { parseRecurrenceOption } from "@shared/utils/helpers"

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

export const AddPaymentModal = ({ isOpen, onClose, onSubmit }: AddPaymentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [recurrence, setRecurrence] = useState("none");
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const paymentData: Omit<PaymentInterface, "id"> = {
        title,
        amount: parseFloat(amount),
        due_date: new Date(dueDate).toISOString(),
        paid_at: null,
        recurrence_rule: parseRecurrenceOption(recurrence, new Date(dueDate)),
      };

      await onSubmit(paymentData);
      // Reset form
      setTitle("");
      setAmount("");
      setDueDate(new Date().toISOString().split("T")[0]);
      setRecurrence("none");
      onClose();
    } catch (error) {
      console.error("Error submitting payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRecurrenceLabel = recurrenceOptions.find((opt) => opt.value === recurrence)?.label || "Does not repeat";

  const isValid = title.trim() && amount && dueDate;

  // Generate dynamic descriptions based on selected due date
  const dynamicRecurrenceOptions = useMemo(() => {
    const selectedDate = new Date(dueDate);
    return recurrenceOptions.map((option) => ({
      ...option,
      description: option.getDescription ? option.getDescription(selectedDate) : undefined,
    }));
  }, [dueDate]);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Add New Payment"
        showCloseButton={true}
        actions={
          <>
            <Button onClick={onClose} disabled={isSubmitting} variant="default">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isValid || isSubmitting} variant="primary">
              {isSubmitting ? "Adding..." : "Add Payment"}
            </Button>
          </>
        }>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Electric Bill - August 2024"
              required
              autoFocus
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Amount</label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="125.50"
              required
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Due Date</label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="" required />
          </div>

          {/* Recurrence Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Recurrence</label>
            <Popover open={recurrenceOpen} onOpenChange={setRecurrenceOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="default"
                  role="combobox"
                  aria-expanded={recurrenceOpen}
                  className="w-full justify-between border-bg-muted-light px-3 font-medium hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <Repeat size={16} className="text-text-muted" />
                    <span className="text-sm text-text">{selectedRecurrenceLabel}</span>
                  </div>
                  <ChevronDown size={16} className="text-text-muted" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[var(--radix-popper-anchor-width)] p-0" align="start">
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
                          className="flex items-center justify-between py-2.5 cursor-pointer">
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
        </form>
      </BaseModal>
    </>
  );
};
