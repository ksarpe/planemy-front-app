//components + icons
import ModernCalendar from "../ui/Calendar/ModernCalendar";
//functions

export default function CalendarView() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* flex-col for header and body. Separated right bar to have flex-col */}
      <ModernCalendar />
    </div>
  );
}
