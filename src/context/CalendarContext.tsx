import type { CalendarClickContent, EventInterface } from "@/data/types";
import type { CalendarContextProps } from "@/data/typesProps";
import { useEvents } from "@/firebase/events";
import { getDateKey } from "@/utils/helpers";
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
  setEventList: () => {},
  updateEvent: () => {},
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
  const [eventList, setEventList] = useState<EventInterface[]>(events); // <- nowa lokalna kontrola

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
    if (Array.isArray(events) && events.length > 0 && !isInitialized) {
      setIsInitialized(true);
      setEventList(events);
    }
  }, [events, isInitialized]);

  const updateEvent = (updatedEvent: EventInterface) => {
    setEventList((prevEvents) => {
      const index = prevEvents.findIndex((event) => event.id === updatedEvent.id);
      if (index !== -1) {
        const newEvents = [...prevEvents];
        newEvents[index] = updatedEvent;
        return newEvents;
      }
      return prevEvents; // If not found, return the original list
    });
  };

  const { hourlyEvents, dailyEvents } = useMemo(() => {
    const hourly: Record<string, EventInterface[]> = {};
    const daily: Record<string, EventInterface[]> = {};

    const stripTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    eventList.forEach((event) => {
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
  }, [eventList]);

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
        events: eventList,
        setEventList,
        updateEvent,
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
