import type { CalendarClickContent, EventInterface } from "@shared/data/Calendar/events";
import type { CalendarContextProps } from "@shared/data/Calendar/context";
import { useEvents, updateEvent as firebaseUpdateEvent } from "@shared/api/events";
import { getDateKey } from "../../../shared/utils/helpers";
import { createContext, useEffect, useMemo, useState } from "react";

const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);
export { CalendarContext };

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

  const { hourlyEvents, dailyEvents } = useMemo(() => {
    const hourly: Record<string, EventInterface[]> = {};
    const daily: Record<string, EventInterface[]> = {};

    const stripTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    events.forEach((event: EventInterface) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      const startKey = getDateKey(start);

      if (event.allDay) {
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
