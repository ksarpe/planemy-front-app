import type { EventInterface, CalendarClickContent } from "./events";

export interface CalendarContextProps {
  isInitialized: boolean;
  setIsInitialized: (isInitialized: boolean) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  modalPosition: { top: number; left: number } | null;
  setModalPosition: (position: { top: number; left: number } | null) => void;
  events: EventInterface[];
  hourlyEvents: Record<string, EventInterface[]>;
  dailyEvents: Record<string, EventInterface[]>;
  updateEvent: (event: EventInterface) => Promise<void>;
  addEvent: (event: Omit<EventInterface, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  calendarClickContent: CalendarClickContent | null;
  setCalendarClickContent: (content: CalendarClickContent | null) => void;
  view: "month" | "week";
  setView: (view: "month" | "week") => void;
  goToday: () => void;
  loadNext: () => void;
  loadPrev: () => void;
}
