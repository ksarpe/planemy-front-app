import {
  StatsGrid,
  TodaySchedule,
  RecentActivity,
  UpcomingPayments,
  WeeklyProgress,
  QuickActions,
  FeedbackBanner,
} from "@/components/ui/Dashboard";
import { useShoppingContext } from "@/hooks/context/useShoppingContext";
import { useTaskContext } from "@/hooks/context/useTaskContext";
import { useTasks } from "@/hooks/tasks/useTasks";
import { useNavigate } from "react-router-dom";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useShoppingItemsQuery } from "@/hooks/shopping/useShoppingItems";
import { ShoppingCart, ListTodo } from "lucide-react";

export default function DashboardView() {
  const navigate = useNavigate();
  const { shoppingLists, currentList } = useShoppingContext();
  const { currentTaskList, currentTaskListId } = useTaskContext();
  const { mainListId } = usePreferencesContext();

  // Determine default shopping list (first or current) & fetch items
  const defaultShoppingList = currentList || shoppingLists[0] || null;
  const { data: shoppingItems = [] } = useShoppingItemsQuery(defaultShoppingList ? defaultShoppingList.id : "");
  const shoppingPending = shoppingItems.filter((i) => !i.isCompleted).length;

  // Tasks for current/default task list
  const effectiveTaskListId = currentTaskListId || currentTaskList?.id || mainListId || null;
  const { data: tasks = [] } = useTasks(effectiveTaskListId);
  const tasksPending = tasks.filter((t) => !t.isCompleted).length;
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
      <div className="p-6 space-y-6 bg-bg  min-h-full">
        {/* Dynamic summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/shopping")}
            className="group flex items-center gap-4 p-4 rounded-lg bg-bg-alt border border-bg-hover hover:border-primary/50 hover:shadow transition-all text-left">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <ShoppingCart size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">Lista zakupów</p>
              <p className="text-lg font-semibold">
                {shoppingPending}
                <span className="text-xs font-normal ml-1 text-gray-500">do kupienia</span>
              </p>
              {defaultShoppingList && <p className="text-[11px] text-gray-400 truncate">{defaultShoppingList.name}</p>}
            </div>
          </button>
          <button
            onClick={() => navigate("/tasks")}
            className="group flex items-center gap-4 p-4 rounded-lg bg-bg-alt border border-bg-hover hover:border-primary/50 hover:shadow transition-all text-left">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <ListTodo size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">Zadania</p>
              <p className="text-lg font-semibold">
                {tasksPending}
                <span className="text-xs font-normal ml-1 text-gray-500">otwarte</span>
              </p>
              {currentTaskList && <p className="text-[11px] text-gray-400 truncate">{currentTaskList.name}</p>}
            </div>
          </button>
          {/* Placeholder keep other stats grid (mock for now) */}
        </div>
        {/* Feedback Banner */}
        <FeedbackBanner />
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
