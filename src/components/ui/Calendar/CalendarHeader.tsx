import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import { ChevronLeft, ChevronRight, Grid3X3, AlignJustify } from "lucide-react";
import { getVisibleMonthsInWeek } from "../../../utils/weeksHelper";

export default function CalendarHeader() {
  const { currentDate, loadNext, loadPrev, goToday, setView, view } = useCalendarContext();
  const visibleMonths = getVisibleMonthsInWeek(currentDate);
  const year = currentDate.getFullYear();

  const getDateDisplay = () => {
    if (view === "week" && visibleMonths.length > 1) {
      return `${visibleMonths[0]} - ${visibleMonths[1]} ${year}`;
    }
    return `${currentDate.toLocaleString("en", { month: "long" })} ${year}`;
  };

  return (
    <div className="border-b border-gray-200  bg-bg ">
      <div className="flex items-center justify-between px-8 py-2 md:py-4">
        {/* Left side - Logo and navigation */}
        <div className="flex items-center space-x-4">
          {/* Current date display */}
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <h2 className="text-xs sm:text-sm text-center md:text-2xl font-semibold text-text ">{getDateDisplay()}</h2>
            {/* Navigation arrows */}
            <div className="flex items-center space-x-2">
              <button onClick={loadPrev} className=" text-text-light  rounded-md transition-colors" title="Previous">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={loadNext} className=" text-text-light rounded-md transition-colors" title="Next">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          {/* Today button */}
          <button
            onClick={goToday}
            className="px-2 py-2 text-xs md:text-sm font-medium text-text-light  bg-white  border border-gray-300  rounded-md hover:bg-gray-50  transition-colors">
            Today
          </button>
        </div>
        {/* Right side - view controls */}
        <div className="flex flex-col sm:flex-row items-center bg-gray-100  rounded-md ">
          <button
            onClick={() => setView("month")}
            className={`flex items-center space-x-2 px-2 py-2 rounded-md transition-colors text-xs sm:text-sm  ${
              view === "month" ? "bg-white  text-text  shadow-sm" : "text-text-light  hover:text-text "
            }`}>
            <Grid3X3 className="h-4 w-4" />
            <span>Month</span>
          </button>
          <button
            onClick={() => setView("week")}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm  ${
              view === "week" ? "bg-white  text-text  shadow-sm" : "text-text-light  hover:text-text "
            }`}>
            <AlignJustify className="h-4 w-4" />
            <span>Week</span>
          </button>
        </div>
      </div>
    </div>
  );
}
