import type { CalendarClickContent } from "../data/Calendar/events";
import type { CalendarContextProps } from "../data/Calendar/context";
import { createContext, useState } from "react";

const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);
export { CalendarContext };

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [calendarClickContent, setCalendarClickContent] = useState<CalendarClickContent | null>(null);
  const [modalPosition, setActualModalPosition] = useState<{ top: number; left: number } | null>(null);
  const [view, setView] = useState<"month" | "week">("month");

  const setModalPosition = (position: { top: number; left: number } | null) => {
    if (!position) {
      setActualModalPosition(null);
      return;
    }
    const modalWidth = 320;
    const modalHeight = 120;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (position.left + modalWidth > viewportWidth) {
      position.left = position.left - modalWidth;
    }
    if (position.top + modalHeight > viewportHeight) {
      position.top = position.top - modalHeight;
    }
    setActualModalPosition(position);
  };

  const loadNext = () => {
    if (view === "month") {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else if (view === "week") {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    }
  };
  const loadPrev = () => {
    if (view === "month") {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else if (view === "week") {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
    }
  };
  const goToday = () => {
    const now = new Date();
    if (view === "month") {
      setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    } else if (view === "week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      startOfWeek.setHours(0, 0, 0, 0);
      setCurrentDate(startOfWeek);
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        loadNext,
        loadPrev,
        goToday,
        view,
        setView,
        calendarClickContent,
        setCalendarClickContent,
        modalPosition,
        setModalPosition,
      }}>
      {children}
    </CalendarContext.Provider>
  );
};
