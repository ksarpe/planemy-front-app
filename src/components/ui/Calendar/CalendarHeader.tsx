import { useCalendarContext } from "@/context/CalendarContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getVisibleMonthsInWeek } from "@/utils/weeksHelper";

export default function CalendarHeader() {
  const { currentDate, loadNext, loadPrev, goToday, setView, view } = useCalendarContext();
  const visibleMonths = getVisibleMonthsInWeek(currentDate);
  const year = currentDate.getFullYear();

  return (
    <>
      {/* header with buttons and bar opener */}
      <div className="flex flex-row justify-between items-center pb-3 bg-bg dark:bg-gray-800 dark:text-white">
        {/* left side buttons */}
        <div className="flex flex-row items-center">
          <button
            title="Go today"
            onClick={goToday}
            className="text-black dark:text-white text-sm mr-8 cursor-pointer hover:bg-bg-alt border rounded-xl p-2">
            Today
          </button>
          <button onClick={loadPrev} title="Previous month" className="py-2 mr-2 cursor-pointer hover:text-primary">
            <ChevronLeft size={24} />
          </button>
          <button onClick={loadNext} title="Next month" className="py-2 mr-8 cursor-pointer hover:text-primary">
            <ChevronRight size={24} />
          </button>
          <h2 className="text-lg font-bold capitalize">
            {visibleMonths.length > 1 && view === "week"
              ? `${visibleMonths[0]} - ${visibleMonths[1]} ${year}`
              : `${currentDate.toLocaleString("en", { month: "long" })} ${year}`}
          </h2>
        </div>
        {/* left side buttons END */}
        {/* bar open button */}
        <div className="flex flex-row items-center gap-2">
          <button
            title="Monthly view"
            onClick={() => setView("month")}
            className="text-black dark:text-white text-xs cursor-pointer hover:bg-bg-alt border rounded-lg p-1">
            Monthly view
          </button>
          <button
            title="Weekly view"
            onClick={() => setView("week")}
            className="text-black dark:text-white text-xs cursor-pointer hover:bg-bg-alt border rounded-lg p-1">
            Weekly view
          </button>
        </div>
        {/* bar open button END */}
      </div>
      {/* header with buttons and bar opener END */}
      {/* DAYS names grid */}
      <div className={`grid grid-cols-7 text-center text-xs py-1 dark:text-white ${view === "month" ? "" : "ml-20"}`}>
        <h1>MON.</h1>
        <h1>TUE.</h1>
        <h1>WED.</h1>
        <h1>THU.</h1>
        <h1>FRI.</h1>
        <h1>SAT.</h1>
        <h1>SUN.</h1>
      </div>
      {/* DAYS names grid END*/}
    </>
  );
}
