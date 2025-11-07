import BuddyWidget from "@/components/ui/Buddy/BuddyWidget";
import MainContentGrid from "@/components/ui/Dashboard/MainContentGrid";
import QuickStats from "@/components/ui/Dashboard/QuickStats";
import UrgentPayments from "@/components/ui/Dashboard/UrgentPayments";
import { useEvents } from "@shared/hooks/events/useEvents";
import { usePayments } from "@shared/hooks/payments/usePayments";
import { useTaskLists } from "@shared/hooks/tasks/useTasks";
import { addDays, differenceInDays, isAfter, isBefore, isSameDay } from "date-fns";
import { Calendar, CheckCircle, CreditCard, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export default function DashboardView() {
  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }, []);

  // Fetch real data
  const { data: eventsData } = useEvents();
  const { data: paymentsData } = usePayments();
  const { data: taskListsData } = useTaskLists();

  // Filter events for today
  const todayEvents = useMemo(() => {
    if (!eventsData?.items) return [];
    return eventsData.items.filter((event) => isSameDay(new Date(event.starts_at), today));
  }, [eventsData, today]);

  // Filter events for tomorrow
  const tomorrowEvents = useMemo(() => {
    if (!eventsData?.items) return [];
    return eventsData.items.filter((event) => isSameDay(new Date(event.starts_at), tomorrow));
  }, [eventsData, tomorrow]);

  // Filter events for next 7 days (excluding today and tomorrow)
  const next7DaysEvents = useMemo(() => {
    if (!eventsData?.items) return [];
    const sevenDaysFromNow = addDays(today, 7);

    return eventsData.items.filter((event) => {
      const eventDate = new Date(event.starts_at);
      return isAfter(eventDate, tomorrow) && isBefore(eventDate, sevenDaysFromNow);
    });
  }, [eventsData, today, tomorrow]);

  // Calculate date range for next 7 days display
  const next7DaysRange = useMemo(() => {
    const dayAfterTomorrow = addDays(today, 2);
    const sevenDaysFromNow = addDays(today, 7);
    return { start: dayAfterTomorrow, end: sevenDaysFromNow };
  }, [today]);

  // Filter urgent payments (≤7 days)
  const upcomingPayments = useMemo(() => {
    if (!paymentsData?.items) return [];
    return paymentsData.items
      .filter((payment) => {
        const daysLeft = differenceInDays(new Date(payment.due_date), new Date());
        return !payment.paid_at && daysLeft >= 0 && daysLeft <= 7;
      })
      .map((payment) => {
        const daysLeft = differenceInDays(new Date(payment.due_date), new Date());
        return { ...payment, daysLeft, urgent: daysLeft <= 3 };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, [paymentsData]);

  // Count today's tasks (placeholder - tasks need to be loaded per list)
  const todayTasksCount = useMemo(() => {
    if (!taskListsData?.items) return 0;
    // TODO: Implement proper task counting when task data is available
    return taskListsData.items.length;
  }, [taskListsData]);

  // Stats
  const stats = [
    { label: "Zadania na dzisiaj", value: todayTasksCount.toString(), icon: CheckCircle, color: "text-success" },
    {
      label: "Nadchodzące wydarzenia",
      value: (eventsData?.total || 0).toString(),
      icon: Calendar,
      color: "text-primary",
    },
    {
      label: "Pilne płatności",
      value: upcomingPayments.filter((p) => p.urgent).length.toString(),
      icon: CreditCard,
      color: "text-negative",
    },
  ];

  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="p-6 space-y-6 bg-bg-alt min-h-full w-full">
        {/* Buddy Widget - Minimalist */}
        <BuddyWidget />

        {/* Quick Stats */}
        <QuickStats stats={stats} />

        {/* Main Content Grid */}
        <MainContentGrid
          tomorrow={tomorrow}
          tomorrowEvents={tomorrowEvents}
          todayEvents={todayEvents}
          next7DaysEvents={next7DaysEvents}
          next7DaysRange={next7DaysRange}
        />

        {/* Urgent Payments */}
        <UrgentPayments upcomingPayments={upcomingPayments} />

        {/* Quick Actions */}
        <div className="p-5 rounded-xl bg-bg-alt border border-border shadow-md shadow-shadow">
          <h3 className="font-semibold text-text mb-4">Szybkie akcje</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Dodaj zadanie", icon: CheckCircle, color: "primary" },
              { label: "Nowe wydarzenie", icon: Calendar, color: "success" },
              { label: "Dodaj płatność", icon: CreditCard, color: "warning" },
              { label: "Zobacz statystyki", icon: TrendingUp, color: "primary" },
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 rounded-lg bg-bg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group">
                <action.icon
                  className={`w-6 h-6 text-${action.color} mx-auto mb-2 group-hover:scale-110 transition-transform`}
                />
                <p className="text-sm text-text-muted group-hover:text-text transition-colors">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
