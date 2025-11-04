import { useEvents } from "@shared/hooks/events/useEvents";
import { usePayments } from "@shared/hooks/payments/usePayments";
import { useTaskLists } from "@shared/hooks/tasks/useTasks";
import { differenceInDays, format, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardView() {
  const navigate = useNavigate();
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
    return eventsData.items
      .filter((event) => isSameDay(new Date(event.starts_at), today))
      .map((event) => ({
        id: event.id,
        title: event.title,
        time: format(new Date(event.starts_at), "HH:mm"),
        color: "primary",
      }));
  }, [eventsData, today]);

  // Filter events for tomorrow
  const tomorrowEvents = useMemo(() => {
    if (!eventsData?.items) return [];
    return eventsData.items
      .filter((event) => isSameDay(new Date(event.starts_at), tomorrow))
      .map((event) => ({
        id: event.id,
        title: event.title,
        time: format(new Date(event.starts_at), "HH:mm"),
        color: "primary",
      }));
  }, [eventsData, tomorrow]);

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
        return {
          id: payment.id,
          title: payment.title,
          amount: `${payment.amount} PLN`,
          daysLeft,
          urgent: daysLeft <= 3,
        };
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
        {/* Buddy Widget - Compact */}
        <div className="p-4 rounded-xl bg-bg-alt border border-border shadow-md dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👋</span>
              <div>
                <h3 className="font-bold text-lg text-text">Buddy</h3>
                <p className="text-text-muted text-xs">Twój osobisty asystent</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-text">5</div>
              <div className="text-xs text-text-muted">Level</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-bg rounded-lg p-2 border border-border">
              <div className="text-xl font-bold text-text">7</div>
              <div className="text-xs text-text-muted">Dni z rzędu</div>
            </div>
            <div className="bg-bg rounded-lg p-2 border border-border">
              <div className="text-xl font-bold text-text">142</div>
              <div className="text-xs text-text-muted">Zadania</div>
            </div>
            <div className="bg-bg rounded-lg p-2 border border-border">
              <div className="text-xl font-bold text-text">38</div>
              <div className="text-xs text-text-muted">Wydarzenia</div>
            </div>
          </div>

          <div className="bg-bg rounded-lg p-2 mb-3 border border-border">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Postęp do Level 6</span>
              <span>1250 / 2000 XP</span>
            </div>
            <div className="w-full bg-bg-muted-light rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "62.5%" }} />
            </div>
          </div>

          <button
            onClick={() => navigate("/buddy")}
            className="w-full bg-bg hover:bg-bg-muted-light border border-border rounded-lg py-2 text-sm font-medium text-text transition-all duration-200 hover:border-primary">
            Zobacz pełny profil Buddy →
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-bg-alt border border-border shadow-md dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)] hover:shadow-[2px_2px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_8px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.08)] transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-text">{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Tomorrow's Events - Most Prominent */}
          <div className="xl:col-span-2">
            <div className="p-6 rounded-xl bg-bg-alt border border-border shadow-md dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">Jutro</h2>
                  <p className="text-sm text-text-muted">{format(tomorrow, "EEEE, d MMMM", { locale: pl })}</p>
                </div>
              </div>

              <div className="space-y-3">
                {tomorrowEvents.length > 0 ? (
                  tomorrowEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg bg-bg-alt/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-16 text-center">
                          <Clock className="w-4 h-4 mx-auto text-text-muted mb-1" />
                          <span className="text-sm font-semibold text-text">{event.time}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-text group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                        </div>
                        <div className={`w-2 h-2 rounded-full bg-${event.color}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-text-muted">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Brak wydarzeń na jutro</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Today's Events & Urgent Payments */}
          <div className="space-y-6">
            {/* Today's Events */}
            <div className="p-5 rounded-xl bg-bg-alt border border-border shadow-md dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-warning" />
                <h3 className="font-semibold text-text">Dzisiaj</h3>
              </div>

              <div className="space-y-2">
                {todayEvents.length > 0 ? (
                  todayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg bg-bg border border-border hover:border-warning/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-text-muted">{event.time}</span>
                        <span className="text-sm text-text">{event.title}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-muted text-center py-4">Brak wydarzeń</p>
                )}
              </div>
            </div>

            {/* Urgent Payments */}
            <div className="p-5 rounded-xl bg-bg-alt border border-border shadow-md dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-negative" />
                <h3 className="font-semibold text-text">Pilne płatności</h3>
              </div>

              <div className="space-y-2">
                {upcomingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      payment.urgent
                        ? "bg-negative/5 border-negative/20 hover:border-negative/40"
                        : "bg-bg border-border hover:border-warning/30"
                    }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text">{payment.title}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          Za {payment.daysLeft} {payment.daysLeft === 1 ? "dzień" : "dni"}
                        </p>
                      </div>
                      <p className={`text-sm font-bold ${payment.urgent ? "text-negative" : "text-text"}`}>
                        {payment.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-5 rounded-xl bg-bg-alt border border-border shadow-md dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)]">
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
