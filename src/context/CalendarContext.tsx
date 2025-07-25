import type { CalendarClickContent, EventInterface } from "../data/types";
import type { CalendarContextProps } from "../data/typesProps";
import { useEvents, addEvent as firebaseAddEvent, updateEvent as firebaseUpdateEvent } from "../firebase/events";
import { getDateKey } from "../utils/helpers";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CalendarContext = createContext<CalendarContextProps>({
  currentDate: new Date(),
  loadNext: () => {},
  loadPrev: () => {},
  goToday: () => {},
  view: "month",
  setView: () => {},
  isInitialized: false,
  setIsInitialized: () => {},
  setCurrentDate: () => {},
  events: [],
  updateEvent: async () => {},
  addEvent: async () => {},
  hourlyEvents: {},
  dailyEvents: {},
  calendarClickContent: null,
  setCalendarClickContent: () => {},
  modalPosition: { top: 0, left: 0 },
  setModalPosition: () => {},
});

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [calendarClickContent, setCalendarClickContent] = useState<CalendarClickContent | null>(null);
  const [modalPosition, setActualModalPosition] = useState<{ top: number; left: number } | null>(null);
  const [view, setView] = useState<"month" | "week">("month");
  const [isInitialized, setIsInitialized] = useState(false);

  const events = useEvents();
  
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
  
  useEffect(() => {
    console.log("CalendarContext - events updated:", events.length, events);
    if (Array.isArray(events) && events.length >= 0) {
      setIsInitialized(true);
    }
  }, [events]);

  const updateEvent = async (updatedEvent: EventInterface) => {
    try {
      await firebaseUpdateEvent(updatedEvent.id, updatedEvent);
      // Firebase will trigger a real-time update through useEvents hook
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const addEvent = async (eventData: Omit<EventInterface, "id" | "createdAt" | "updatedAt">) => {
    try {
      const eventId = await firebaseAddEvent(eventData);
      console.log("Event added with ID:", eventId);
      // Firebase will trigger a real-time update through useEvents hook
    } catch (error) {
      console.error("Failed to add event:", error);
      throw error;
    }
  };

  const { hourlyEvents, dailyEvents } = useMemo(() => {
    const hourly: Record<string, EventInterface[]> = {};
    const daily: Record<string, EventInterface[]> = {};

    const stripTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    events.forEach((event: EventInterface) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const startKey = getDateKey(start);

      if (event.allDay) {
        const days = Math.ceil((stripTime(end).getTime() - stripTime(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        event.colSpan = days;

        daily[startKey] ||= [];
        daily[startKey].push(event);
      } else {
        // If event spans multiple days, also add to daily events
        const startDay = stripTime(start).getTime();
        const endDay = stripTime(end).getTime();
        //TODO: for now it changes evnet to all-day if it spans multiple days to keep it correctly in weekly view
        if (startDay !== endDay) {
          event.allDay = true;
          daily[startKey] ||= [];
          daily[startKey].push(event);
        } else {
          hourly[startKey] ||= [];
          hourly[startKey].push(event);
        }
      }
    });

    return { hourlyEvents: hourly, dailyEvents: daily };
  }, [events]);

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
        isInitialized,
        setIsInitialized,
        events: events,
        updateEvent,
        addEvent,
        hourlyEvents,
        dailyEvents,
        calendarClickContent,
        setCalendarClickContent,
        modalPosition,
        setModalPosition,
      }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => useContext(CalendarContext);
