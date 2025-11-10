import { AddPaymentModal, PaymentDetailsDrawer, PaymentListItem, PaymentSection } from "@/components/ui/Payments";
import { Tabs, TabsList, TabsTab } from "@/components/ui/Utils/tabs";
import type { PaymentInterface } from "@shared/data/Payments/interfaces";
import { useCreatePayment, useDeletePayment, usePayments, useUpdatePayment } from "@shared/hooks/payments";
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

  // Calculate stats
  const stats = useMemo(() => {
    const today = startOfToday();
    const todayEnd = endOfToday();
    const tomorrow = addDays(today, 1);
    const tomorrowEnd = addDays(todayEnd, 1);
    const next7DaysEnd = addDays(today, 7);

    const unpaidPayments = payments.filter((p) => !p.paid_at);
    const paidPayments = payments.filter((p) => p.paid_at);

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

    const totalUnpaid = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalOverdue = overdue.reduce((sum, p) => sum + p.amount, 0);
    const totalDueToday = dueToday.reduce((sum, p) => sum + p.amount, 0);
    const totalDueTomorrow = dueTomorrow.reduce((sum, p) => sum + p.amount, 0);
    const totalDueNext7Days = dueNext7Days.reduce((sum, p) => sum + p.amount, 0);

    return {
      total: payments.length,
      unpaid: unpaidPayments.length,
      paid: paidPayments.length,
      overdue: overdue.length,
      dueToday: dueToday.length,
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
  }, [payments]);

  const handleAddPayment = async (paymentData: Omit<PaymentInterface, "id">) => {
    await createPaymentMutation.mutateAsync(paymentData);
    setIsModalOpen(false);
  };

  const handleMarkPaid = async (payment: PaymentInterface) => {
    await updatePaymentMutation.mutateAsync({
      id: payment.id,
      data: { paid_at: new Date().toISOString() },
    });
  };

  const handleMarkUnpaid = async (payment: PaymentInterface) => {
    await updatePaymentMutation.mutateAsync({
      id: payment.id,
      data: { paid_at: null },
    });
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
          <div className="bg-bg-primary rounded-2xl flex flex-col gap-4">
            {/* Overdue Payments */}
            {stats.overduePayments.length > 0 && (
              <PaymentSection
                title="Overdue"
                icon={AlertCircle}
                count={stats.overdue}
                total={stats.totalOverdue}
                payments={stats.overduePayments}
                bgColor="bg-negative/10"
                borderColor="border-negative/20"
                textColor="text-negative"
                onMarkPaid={handleMarkPaid}
                onMarkUnpaid={handleMarkUnpaid}
                onDelete={handleDeletePayment}
              />
            )}

            {/* Due Today */}
            {stats.dueTodayPayments.length > 0 && (
              <PaymentSection
                title="Due Today"
                icon={Clock}
                count={stats.dueToday}
                total={stats.totalDueToday}
                payments={stats.dueTodayPayments}
                bgColor="bg-warning/10"
                borderColor="border-warning/20"
                textColor="text-warning"
                onMarkPaid={handleMarkPaid}
                onMarkUnpaid={handleMarkUnpaid}
                onDelete={handleDeletePayment}
              />
            )}

            {/* Due Tomorrow */}
            {stats.dueTomorrowPayments.length > 0 && (
              <PaymentSection
                title="Due Tomorrow"
                icon={Calendar}
                count={stats.dueTomorrow}
                total={stats.totalDueTomorrow}
                payments={stats.dueTomorrowPayments}
                bgColor="bg-primary/10"
                borderColor="border-primary/20"
                textColor="text-primary"
                onMarkPaid={handleMarkPaid}
                onMarkUnpaid={handleMarkUnpaid}
                onDelete={handleDeletePayment}
              />
            )}

            {/* Next 7 Days */}
            {stats.dueNext7DaysPayments.length > 0 && (
              <PaymentSection
                title="Next 7 Days"
                icon={TrendingUp}
                count={stats.dueNext7Days}
                total={stats.totalDueNext7Days}
                payments={stats.dueNext7DaysPayments}
                bgColor="bg-purple-500/10"
                borderColor="border-purple-500/20"
                textColor="text-purple-500"
                onMarkPaid={handleMarkPaid}
                onMarkUnpaid={handleMarkUnpaid}
                onDelete={handleDeletePayment}
              />
            )}
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
