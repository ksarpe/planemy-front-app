import { AddPaymentModal, PaymentDetailsDrawer, PaymentListItem, PaymentSection } from "@/components/ui/Payments";
import { Tabs, TabsList, TabsTab } from "@/components/ui/Utils/tabs";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { useCreatePayment, useDeletePayment, usePayments, useUpdatePayment } from "@shared/hooks/payments";
import { calculateNextDueDateFromRule } from "@shared/utils/helpers";
import { addDays, endOfToday, isAfter, isBefore, startOfToday } from "date-fns";
import { AlertCircle, Calendar, CheckCircle2, Clock, DollarSign, Plus, TrendingUp, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/Utils/button";

export default function Payments() {
  const { data: paymentsResponse } = usePayments();
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentInterface | null>(null);
  const [activeTab, setActiveTab] = useState<"deadlines" | "all">("deadlines");

  const payments = useMemo(() => paymentsResponse?.items || [], [paymentsResponse?.items]);

  // Generate virtual instances of recurring payments for the next 7 days
  const expandedPayments = useMemo(() => {
    const today = startOfToday();
    const next7DaysEnd = addDays(today, 7);
    const result: PaymentInterface[] = [];

    payments.forEach((payment) => {
      // Dodaj oryginalny payment
      result.push(payment);

      // Jeśli ma recurrence_rule i nie jest paid, generuj wirtualne instancje
      if (payment.recurrence_rule && !payment.paid_at) {
        let currentDate = payment.due_date;
        let nextDate = calculateNextDueDateFromRule(currentDate, payment.recurrence_rule);

        // Generuj kolejne instancje dopóki mieszczą się w next 7 days
        while (new Date(nextDate) <= next7DaysEnd) {
          // Stwórz wirtualną instancję z unikalnym ID
          result.push({
            ...payment,
            id: `${payment.id}-virtual-${nextDate}`,
            due_date: nextDate,
          });

          currentDate = nextDate;
          nextDate = calculateNextDueDateFromRule(currentDate, payment.recurrence_rule);
        }
      }
    });

    return result;
  }, [payments]);

  // Calculate stats based on expanded payments (including virtual instances)
  const stats = useMemo(() => {
    const today = startOfToday();
    const todayEnd = endOfToday();
    const tomorrow = addDays(today, 1);
    const tomorrowEnd = addDays(todayEnd, 1);
    const next7DaysEnd = addDays(today, 7);

    // Dla recurring payments: pokazuj je jeśli due_date jest w przyszłości (ignoruj paid_at)
    // Dla non-recurring: pokazuj tylko jeśli !paid_at
    const unpaidPayments = expandedPayments.filter((p) => {
      if (p.recurrence_rule) {
        // Recurring - zawsze pokazuj (paid_at to tylko historia ostatniej płatności)
        return true;
      } else {
        // Non-recurring - pokazuj tylko jeśli niepaid
        return !p.paid_at;
      }
    });

    const paidPayments = payments.filter((p) => p.paid_at && !p.recurrence_rule); // Only one-time paid payments

    const overdue = unpaidPayments.filter((p) => isBefore(new Date(p.due_date), today));

    const dueToday = unpaidPayments.filter(
      (p) => !isBefore(new Date(p.due_date), today) && !isAfter(new Date(p.due_date), todayEnd),
    );

    const dueTomorrow = unpaidPayments.filter(
      (p) => !isBefore(new Date(p.due_date), tomorrow) && !isAfter(new Date(p.due_date), tomorrowEnd),
    );

    const dueNext7Days = unpaidPayments.filter(
      (p) => isAfter(new Date(p.due_date), tomorrowEnd) && !isAfter(new Date(p.due_date), next7DaysEnd),
    );

    const totalUnpaid = unpaidPayments
      .filter((p) => !p.id.includes("-virtual-")) // Count only real payments for totals
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalOverdue = overdue.filter((p) => !p.id.includes("-virtual-")).reduce((sum, p) => sum + p.amount, 0);
    const totalDueToday = dueToday.filter((p) => !p.id.includes("-virtual-")).reduce((sum, p) => sum + p.amount, 0);
    const totalDueTomorrow = dueTomorrow
      .filter((p) => !p.id.includes("-virtual-"))
      .reduce((sum, p) => sum + p.amount, 0);
    const totalDueNext7Days = dueNext7Days
      .filter((p) => !p.id.includes("-virtual-"))
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      total: payments.length, // Only real payments
      unpaid: payments.filter((p) => p.recurrence_rule || !p.paid_at).length, // Recurring always count as unpaid
      paid: paidPayments.length,
      overdue: overdue.filter((p) => !p.id.includes("-virtual-")).length,
      dueToday: dueToday.length, // Show all instances including virtual
      dueTomorrow: dueTomorrow.length,
      dueNext7Days: dueNext7Days.length,
      totalUnpaid,
      totalPaid,
      totalOverdue,
      totalDueToday,
      totalDueTomorrow,
      totalDueNext7Days,
      overduePayments: overdue,
      dueTodayPayments: dueToday,
      dueTomorrowPayments: dueTomorrow,
      dueNext7DaysPayments: dueNext7Days,
      paidPayments,
    };
  }, [expandedPayments, payments]);

  const handleAddPayment = async (paymentData: Omit<PaymentInterface, "id">) => {
    await createPaymentMutation.mutateAsync(paymentData);
    setIsModalOpen(false);
  };

  const handleMarkPaid = async (payment: PaymentInterface) => {
    // Jeśli to wirtualna instancja, znajdź oryginalny payment
    const isVirtual = payment.id.includes("-virtual-");
    const realPaymentId = isVirtual ? payment.id.split("-virtual-")[0] : payment.id;

    // Jeśli płatność ma recurrence_rule, oblicz następny due_date
    if (payment.recurrence_rule) {
      const nextDueDate = calculateNextDueDateFromRule(payment.due_date, payment.recurrence_rule);
      const now = new Date().toISOString();
      // Backend wymaga pełnych danych - wysyłamy wszystko
      const updateData = {
        title: payment.title,
        amount: payment.amount,
        due_date: nextDueDate, // Przesuń due_date na następny okres
        paid_at: now, // Zapisz kiedy ostatnio zapłacono
        recurrence_rule: payment.recurrence_rule,
      };

      await updatePaymentMutation.mutateAsync({
        id: realPaymentId,
        data: updateData,
      });
    } else {
      // Backend wymaga pełnych danych
      await updatePaymentMutation.mutateAsync({
        id: realPaymentId,
        data: {
          title: payment.title,
          amount: payment.amount,
          due_date: payment.due_date,
          paid_at: new Date().toISOString(),
          recurrence_rule: payment.recurrence_rule,
        },
      });
    }
  };
  const handleDeletePayment = async (paymentId: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      await deletePaymentMutation.mutateAsync(paymentId);
    }
  };

  const handleUpdatePayment = async (payment: PaymentInterface, updates: Partial<PaymentInterface>) => {
    await updatePaymentMutation.mutateAsync({
      id: payment.id,
      data: updates,
    });
  };

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-full overflow-auto scrollbar-hide p-2 md:p-4">
      <div className="w-full flex flex-col gap-4 md:gap-6 p-4 md:p-6">
        {/* Quick Stats */}
        {payments.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-primary rounded-2xl p-4 border border-bg-muted-light shadow-md shadow-shadow">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="text-primary" size={16} />
                <span className="text-xs text-text-muted">Total Unpaid</span>
              </div>
              <p className="text-2xl font-bold text-text">${stats.totalUnpaid.toFixed(2)}</p>
              <p className="text-xs text-text-muted mt-1">{stats.unpaid} bills</p>
            </div>

            <div className="bg-bg-primary rounded-2xl p-4 border border-bg-muted-light shadow-md shadow-shadow">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="text-success" size={16} />
                <span className="text-xs text-text-muted">Paid</span>
              </div>
              <p className="text-2xl font-bold text-success">${stats.totalPaid.toFixed(2)}</p>
              <p className="text-xs text-text-muted mt-1">{stats.paid} bills</p>
            </div>

            <div className="bg-bg-primary rounded-2xl p-4 border border-bg-muted-light shadow-md shadow-shadow">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="text-negative" size={16} />
                <span className="text-xs text-text-muted">Overdue</span>
              </div>
              <p className="text-2xl font-bold text-negative">${stats.totalOverdue.toFixed(2)}</p>
              <p className="text-xs text-text-muted mt-1">{stats.overdue} bills</p>
            </div>

            <div className="bg-bg-primary rounded-2xl p-4 border border-bg-muted-light shadow-md shadow-shadow">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="text-purple-500" size={16} />
                <span className="text-xs text-text-muted">Next 7 Days</span>
              </div>
              <p className="text-2xl font-bold text-text">{stats.dueNext7Days}</p>
              <p className="text-xs text-text-muted mt-1">upcoming</p>
            </div>
          </div>
        )}

        {/* Tabs and Add Button */}
        {payments.length > 0 && (
          <div className="flex items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "deadlines" | "all")}>
              <TabsList variant="default">
                <TabsTab value="deadlines">
                  <Clock size={16} />
                  Deadlines
                </TabsTab>
                <TabsTab value="all">
                  <Wallet size={16} />
                  All Payments
                </TabsTab>
              </TabsList>
            </Tabs>
            <Button onClick={handleOpenCreateModal} variant="primary" type="button">
              <Plus size={18} />
              Add Payment
            </Button>
          </div>
        )}

        {/* Empty State */}
        {payments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12 bg-bg-primary rounded-2xl px-8">
              <Wallet size={48} className="mx-auto text-text-muted mb-4" />
              <h3 className="text-lg font-medium text-text-muted mb-2">No payments yet</h3>
              <p className="text-text-muted mb-4">Add your first bill to start tracking your payments.</p>
              <Button onClick={handleOpenCreateModal} variant="primary" type="button">
                <Plus size={18} />
                Add First Payment
              </Button>
            </div>
          </div>
        ) : activeTab === "deadlines" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* Overdue Payments */}
            <div className="h-full">
              <PaymentSection
                title="Overdue"
                icon={AlertCircle}
                count={stats.overdue}
                total={stats.totalOverdue}
                payments={stats.overduePayments}
                textColor="text-negative"
                emptyMessage="No overdue payments"
                onMarkPaid={handleMarkPaid}
                onDelete={handleDeletePayment}
              />
            </div>

            {/* Due Today */}
            <div className="h-full">
              <PaymentSection
                title="Due Today"
                icon={Clock}
                count={stats.dueToday}
                total={stats.totalDueToday}
                payments={stats.dueTodayPayments}
                textColor="text-warning"
                emptyMessage="Nothing due today"
                onMarkPaid={handleMarkPaid}
                onDelete={handleDeletePayment}
              />
            </div>

            {/* Due Tomorrow */}
            <div className="h-full">
              <PaymentSection
                title="Due Tomorrow"
                icon={Calendar}
                count={stats.dueTomorrow}
                total={stats.totalDueTomorrow}
                payments={stats.dueTomorrowPayments}
                textColor="text-primary"
                emptyMessage="Nothing due tomorrow"
                onMarkPaid={handleMarkPaid}
                onDelete={handleDeletePayment}
              />
            </div>

            {/* Next 7 Days */}
            <div className="h-full">
              <PaymentSection
                title="Next 7 Days"
                icon={TrendingUp}
                count={stats.dueNext7Days}
                total={stats.totalDueNext7Days}
                payments={stats.dueNext7DaysPayments}
                textColor="text-text-muted"
                emptyMessage="Nothing due in the next 7 days"
                onMarkPaid={handleMarkPaid}
                onDelete={handleDeletePayment}
              />
            </div>
          </div>
        ) : (
          <div className="bg-bg-primary rounded-2xl">
            {/* All Payments List */}
            <ul className="flex flex-col gap-3">
              {payments.map((payment) => (
                <PaymentListItem
                  key={payment.id}
                  payment={payment}
                  onClick={setSelectedPayment}
                  isSelected={selectedPayment?.id === payment.id}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Add Payment Modal */}
        <AddPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddPayment} />

        {/* Payment Details Drawer */}
        <PaymentDetailsDrawer
          isOpen={selectedPayment !== null}
          onClose={() => setSelectedPayment(null)}
          payment={selectedPayment}
          onUpdate={handleUpdatePayment}
          onDelete={handleDeletePayment}
        />
      </div>
    </div>
  );
}
