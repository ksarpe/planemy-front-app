import ModernCalendarHeader from "./ModernCalendarHeader";
import ModernCalendarBody from "./ModernCalendarBody";

interface ModernCalendarProps {
  className?: string;
}

export default function ModernCalendar({ className = "" }: ModernCalendarProps) {
  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-900 ${className}`}>
      {/* Calendar Header */}
      <ModernCalendarHeader />
      
      {/* Calendar Body */}
      <ModernCalendarBody />
    </div>
  );
}
