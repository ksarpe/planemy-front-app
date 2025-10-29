import { SummaryCards, UpcomingEvents, UpcomingPayments } from "@/components/ui/Dashboard";

export default function DashboardView() {
  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="p-4 space-y-4 bg-bg min-h-full">
        {/* Quick Actions and Summary Cards */}
        <SummaryCards />

        {/* Upcoming Events and Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UpcomingEvents />
          <UpcomingPayments />
        </div>
      </div>
    </div>
  );
}
