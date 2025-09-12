import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";

export default function Calendar() {
  return (
    <div className="h-full flex flex-col bg-bg-alt md:px-4">
      {/* Calendar Header */}
      <CalendarHeader />
      {/* Calendar Body */}
      <CalendarBody />
    </div>
  );
}
