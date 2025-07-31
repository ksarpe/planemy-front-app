import { useState, useRef } from "react";
import { useCalendarContext } from "@/hooks/useCalendarContext";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Grid3X3, AlignJustify } from "lucide-react";
import { getVisibleMonthsInWeek } from "../../../utils/weeksHelper";
import EnhancedCreateEventModal from "./EnhancedCreateEventModal";

export default function CalendarHeader() {
  const { currentDate, loadNext, loadPrev, goToday, setView, view } = useCalendarContext();
  const visibleMonths = getVisibleMonthsInWeek(currentDate);
  const year = currentDate.getFullYear();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const createButtonRef = useRef<HTMLButtonElement>(null);

  const getDateDisplay = () => {
    if (view === "week" && visibleMonths.length > 1) {
      return `${visibleMonths[0]} - ${visibleMonths[1]} ${year}`;
    }
    return `${currentDate.toLocaleString("en", { month: "long" })} ${year}`;
  };

  const formatToday = () => {
    const today = new Date();
    return today.toLocaleDateString("en", { 
      weekday: "short", 
      month: "short", 
      day: "numeric" 
    });
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and navigation */}
        <div className="flex items-center space-x-6">
          {/* Calendar logo/title */}
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Calendar</h1>
          </div>

          {/* Today button */}
          <button
            onClick={goToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Today
          </button>

          {/* Navigation arrows */}
          <div className="flex items-center space-x-1">
            <button
              onClick={loadPrev}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={loadNext}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Current date display */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {getDateDisplay()}
          </h2>
        </div>

        {/* Right side - Actions and view controls */}
        <div className="flex items-center space-x-4">
          {/* Create event button */}
          <button
            ref={createButtonRef}
            onClick={() => setShowCreateEvent(!showCreateEvent)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView("month")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                view === "month"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setView("week")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                view === "week"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <AlignJustify className="h-4 w-4" />
              <span>Week</span>
            </button>
          </div>

          {/* Today's date indicator */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>{formatToday()}</span>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <EnhancedCreateEventModal
        isOpen={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
      />
    </div>
  );
}
