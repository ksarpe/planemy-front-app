//components + icons
import Calendar from "@/components/ui/Calendar/Calendar";
//functions

export default function CalendarView() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* flex-col for header and body. Separated right bar to have flex-col */}
      <Calendar />
    </div>
  );
}
