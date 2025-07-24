import CalendarBody from "@/components/ui/Calendar/CalendarBody";
import CalendarHeader from "@/components/ui/Calendar/CalendarHeader";

export default function CalendarView() {
  return (
    <div className="flex flex-col h-full ">
      {/* header */}
      <CalendarHeader />
      <CalendarBody />
    </div>
  );
}
