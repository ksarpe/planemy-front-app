import ModernCalendarHeader from "./ModernCalendarHeader";
import ModernCalendarBody from "./ModernCalendarBody";

export default function ModernCalendar() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Calendar Header */}
      <ModernCalendarHeader />
      {/* Calendar Body */}
      <ModernCalendarBody />
    </div>
  );
}
