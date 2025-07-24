//components + icons
import Calendar from "@/components/ui/Calendar/Calendar";
//functions

export default function CalendarView() {
  return (
    <div className="flex h-[100vh]">
      {/* flex-col for header and body. Separated right bar to have flex-col */}
      <div className="flex-1 p-6 flex flex-col">
        <Calendar />
      </div>
    </div>
  );
}
