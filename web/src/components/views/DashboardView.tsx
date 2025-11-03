import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { AlertCircle, Calendar, CheckCircle, Clock, CreditCard, TrendingUp } from "lucide-react";

export default function DashboardView() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Placeholder data - będzie zastąpione prawdziwymi danymi
  const tomorrowEvents = [
    { id: 1, title: "Spotkanie z klientem", time: "09:00", color: "primary" },
    { id: 2, title: "Prezentacja projektu", time: "14:30", color: "success" },
  ];

  const todayEvents = [{ id: 3, title: "Call z zespołem", time: "16:00", color: "warning" }];

  const upcomingPayments = [
    { id: 1, title: "Netflix", amount: "49 PLN", daysLeft: 2, urgent: true },
    { id: 2, title: "Spotify", amount: "19.99 PLN", daysLeft: 5, urgent: false },
  ];

  const stats = [
    { label: "Zadania na dzisiaj", value: "5", icon: CheckCircle, color: "text-success" },
    { label: "Nadchodzące wydarzenia", value: "12", icon: Calendar, color: "text-primary" },
    { label: "Pilne płatności", value: "3", icon: CreditCard, color: "text-negative" },
  ];

  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="p-6 space-y-6 bg-bg min-h-full max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Witaj z powrotem! 👋</h1>
          <p className="text-text-muted">{format(today, "EEEE, d MMMM yyyy", { locale: pl })}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-bg-alt border border-border shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)] hover:shadow-[2px_2px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_8px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(255,255,255,0.08)] transition-shadow duration-200">
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
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 shadow-[6px_6px_20px_rgba(0,0,0,0.1),-6px_-6px_20px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_20px_rgba(0,0,0,0.4),-6px_-6px_20px_rgba(255,255,255,0.05)]">
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
            <div className="p-5 rounded-xl bg-bg-alt border border-border shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)]">
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
            <div className="p-5 rounded-xl bg-bg-alt border border-border shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)]">
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
        <div className="p-5 rounded-xl bg-bg-alt border border-border shadow-[4px_4px_12px_rgba(0,0,0,0.08),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.05)]">
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
