import { useCalendarContext } from "@/hooks/context/useCalendarContext";
import { ChevronLeft, ChevronRight, Grid3X3, AlignJustify } from "lucide-react";
import { getVisibleMonthsInWeek } from "../../../utils/weeksHelper";
import { useT } from "@/hooks/useT";

export default function CalendarHeader() {
  const { currentDate, loadNext, loadPrev, goToday, setView, view } = useCalendarContext();
  const { t } = useT();
  const visibleMonths = getVisibleMonthsInWeek(currentDate);
  const year = currentDate.getFullYear();

  const getDateDisplay = () => {
    if (view === "week" && visibleMonths.length > 1) {
      // Translate the month names
      const translatedMonths = visibleMonths.map(monthName => {
        const monthKey = monthName.toLowerCase();
        return t(`calendar.months.${monthKey}`);
      });
      return `${translatedMonths[0]} - ${translatedMonths[1]} ${year}`;
    }
    const monthKey = currentDate.toLocaleString("en", { month: "long" }).toLowerCase();
    const translatedMonth = t(`calendar.months.${monthKey}`);
    return `${translatedMonth} ${year}`;
  };

  return (
    // Main container
    <div className="flex items-center justify-between px-8 py-2 md:py-4 border-b border-gray-200  bg-bg ">
      {/* Left side - navigation */}
      <div className="flex gap-2 items-center">
        <button
          onClick={loadPrev}
          className=" text-text-light  rounded-md transition-colors cursor-pointer"
          title="Previous">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xs sm:text-sm text-center md:text-2xl font-semibold text-text ">{getDateDisplay()}</h2>
        <button
          onClick={loadNext}
          className=" text-text-light rounded-md transition-colors cursor-pointer"
          title="Next">
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={goToday}
          className="px-2 py-2 text-xs md:text-sm font-medium text-text-light  bg-white  border border-gray-300  rounded-md hover:bg-gray-50  transition-colors">
          {t("calendar.today")}
        </button>
      </div>
      {/* Right side - view controls */}
      <div className="flex items-center bg-gray-100  rounded-md ">
        <button
          onClick={() => setView("month")}
          className={`flex items-center space-x-2 px-2 py-2 rounded-md transition-colors text-xs sm:text-sm  ${
            view === "month" ? "bg-white  text-text  shadow-md" : "text-text-light  hover:text-text "
          }`}>
          <Grid3X3 className="h-4 w-4" />
          <span>{t("calendar.month")}</span>
        </button>
        <button
          onClick={() => setView("week")}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-xs sm:text-sm  ${
            view === "week" ? "bg-white  text-text  shadow-md" : "text-text-light  hover:text-text "
          }`}>
          <AlignJustify className="h-4 w-4" />
          <span>{t("calendar.week")}</span>
        </button>
      </div>
    </div>
  );
}
