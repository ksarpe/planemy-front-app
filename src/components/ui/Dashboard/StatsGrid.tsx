import { CheckCircle2, Clock, TrendingUp, Target, Bell, Star, AlertCircle } from "lucide-react";

interface StatsGridProps {
  stats: {
    todayTasks: number;
    completedTasks: number;
    upcomingPayments: number;
    totalNotifications: number;
  };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Today's Tasks */}
      <div className="bg-bg-alt  rounded-lg p-6 border border-gray-200 ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 ">Dzisiejsze zadania</p>
            <p className="text-2xl font-bold text-text ">{stats.todayTasks}</p>
          </div>
          <div className="p-3 bg-blue-100  rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-blue-600 " />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-sm text-green-600 ">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% od wczoraj</span>
          </div>
        </div>
      </div>

      {/* Completed This Week */}
      <div className="bg-bg-alt  rounded-lg p-6 border border-gray-200 ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 ">Ukończone w tygodniu</p>
            <p className="text-2xl font-bold text-text ">{stats.completedTasks}</p>
          </div>
          <div className="p-3 bg-success/10  rounded-lg">
            <Target className="h-6 w-6 text-success " />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-sm text-success">
            <Star className="h-4 w-4 mr-1" />
            <span>Świetna robota!</span>
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-bg-alt  rounded-lg p-6 border border-gray-200 ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 ">Nadchodzące płatności</p>
            <p className="text-2xl font-bold text-text ">{stats.upcomingPayments}</p>
          </div>
          <div className="p-3 bg-yellow-100  rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600 " />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-sm text-yellow-600 ">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>W następnym tygodniu</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-bg-alt  rounded-lg p-6 border border-gray-200 ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 ">Powiadomienia</p>
            <p className="text-2xl font-bold text-text ">{stats.totalNotifications}</p>
          </div>
          <div className="p-3 bg-red-100  rounded-lg">
            <Bell className="h-6 w-6 text-red-600 " />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-sm text-red-600 ">
            <span>Nowe udostępnienia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
