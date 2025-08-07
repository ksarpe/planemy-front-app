import {
  StatsGrid,
  TodaySchedule,
  RecentActivity,
  UpcomingPayments,
  WeeklyProgress,
  QuickActions,
} from "@/components/ui/Dashboard";

export default function DashboardView() {
  // Mock data - w przyszłości będzie pochodzić z API
  const mockStats = {
    todayTasks: 5,
    completedTasks: 12,
    upcomingPayments: 3,
    shoppingLists: 2,
    totalNotifications: 4,
    weeklyProgress: 75,
  };

  const mockUpcomingTasks = [
    { id: 1, title: "Spotkanie zespołu", time: "10:00", priority: "high" as const },
    { id: 2, title: "Przegląd miesięczny", time: "14:00", priority: "medium" as const },
    { id: 3, title: "Zakupy spożywcze", time: "18:00", priority: "low" as const },
  ];

  const mockRecentActivity = [
    { id: 1, action: "Ukończono zadanie", item: "Prezentacja Q4", time: "2 godz. temu" },
    { id: 2, action: "Dodano płatność", item: "Internet - Orange", time: "4 godz. temu" },
    { id: 3, action: "Utworzono listę", item: "Zakupy na weekend", time: "wczoraj" },
  ];

  const mockUpcomingPayments = [
    { id: 1, name: "Netflix", amount: 45.99, daysLeft: 3 },
    { id: 2, name: "Prąd", amount: 180.5, daysLeft: 7 },
    { id: 3, name: "Internet", amount: 89.99, daysLeft: 12 },
  ];

  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="p-6 space-y-6 bg-bg dark:bg-bg-dark min-h-full">
        {/* Quick Stats Grid */}
        <StatsGrid stats={mockStats} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <TodaySchedule tasks={mockUpcomingTasks} />

          {/* Recent Activity */}
          <RecentActivity activities={mockRecentActivity} />

          {/* Upcoming Payments Details */}
          <UpcomingPayments payments={mockUpcomingPayments} />

          {/* Weekly Progress */}
          <WeeklyProgress progress={mockStats.weeklyProgress} />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}
