import MonthBlock from "@/components/ui/Calendar/MonthlyView/MonthBlock";
import WeeklyBlock from "./WeeklyView/WeeklyBlock";
import { useCalendarContext } from "@/context/CalendarContext";
import EventModal from "./Modal/EventModal";
import Spinner from "@/components/ui/Utils/Spinner";

export default function CalendarBody() {
  const { view, isInitialized } = useCalendarContext();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner text="We are loading the calendar, please wait!" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full min-w-4xl h-full scrollbar-hide rounded-lg shadow-md shadow-bg-dark dark:shadow-bg transition-all duration-600">
        {view === "month" ? <MonthBlock /> : <WeeklyBlock />}
      </div>
      <EventModal />
    </>
  );
}
