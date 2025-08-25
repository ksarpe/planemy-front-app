import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";

export default function Calendar() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Calendar Header */}
      <CalendarHeader />
      {/* Calendar Body */}
      <CalendarBody />
    </div>
  );
}
