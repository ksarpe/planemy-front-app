import {
  UpcomingPayments,
  QuickActions,
  FeedbackBanner,
  UpcomingEvents,
  SummaryCards,
} from "@/components/ui/Dashboard";

export default function DashboardView() {
  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="p-4 space-y-4 bg-bg  min-h-full">
        <div className="grid grid-cols-2 gap-4">
          <SummaryCards />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UpcomingEvents />
          <UpcomingPayments />
        </div>
        <FeedbackBanner />
        <QuickActions />
      </div>
    </div>
  );
}
