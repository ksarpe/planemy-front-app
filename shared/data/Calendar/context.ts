import type { CalendarClickContent } from "./events";

export interface CalendarContextProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  modalPosition: { top: number; left: number } | null;
  setModalPosition: (position: { top: number; left: number } | null) => void;
  calendarClickContent: CalendarClickContent | null;
  setCalendarClickContent: (content: CalendarClickContent | null) => void;
  view: "month" | "week";
  setView: (view: "month" | "week") => void;
  goToday: () => void;
  loadNext: () => void;
  loadPrev: () => void;
}
