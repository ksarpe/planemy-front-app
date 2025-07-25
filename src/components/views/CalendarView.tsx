//components + icons
import ModernCalendar from "../ui/Calendar/ModernCalendar";
//functions

export default function CalendarView() {
  return (
    <div className="flex h-[100vh]">
      {/* flex-col for header and body. Separated right bar to have flex-col */}
      <div className="flex-1 flex flex-col">
        <ModernCalendar />
      </div>
    </div>
  );
}
