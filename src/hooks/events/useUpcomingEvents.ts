import { useMemo } from "react";
import { useEvents } from "../../api/events";
import type { EventInterface } from "@/data/Calendar/events";
import type { UpcomingEventGroup } from "@/data/Events";
import {
  startOfDay,
  isToday,
  isTomorrow,
  format,
  isThisWeek,
  addDays,
  addMonths,
  endOfMonth,
  isThisMonth,
} from "date-fns";
import { pl } from "date-fns/locale";

export const useUpcomingEvents = () => {
  const allEvents = useEvents();

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const endOfNextMonth = endOfMonth(addMonths(now, 1)); // End of next month for extended search

    // Filter events from current time onwards, within the next 2 months
    const filteredEvents = allEvents
      .filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // For all-day events, show if they haven't ended yet today or are in the future
        if (event.allDay) {
          const eventDate = startOfDay(eventStart);
          const today = startOfDay(now);
          return eventDate >= today && eventStart <= endOfNextMonth;
        }

        // For timed events, show only if they haven't ended yet
        return eventEnd >= now && eventStart <= endOfNextMonth;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // Group events by time periods
    const today: EventInterface[] = [];
    const tomorrow: EventInterface[] = [];
    const thisWeek: EventInterface[] = [];
    const laterThisMonth: EventInterface[] = [];
    const nextMonth: EventInterface[] = [];

    filteredEvents.forEach((event) => {
      const eventStart = new Date(event.start);

      if (isToday(eventStart)) {
        today.push(event);
      } else if (isTomorrow(eventStart)) {
        tomorrow.push(event);
      } else if (isThisWeek(eventStart, { weekStartsOn: 1 })) {
        thisWeek.push(event);
      } else if (isThisMonth(eventStart)) {
        laterThisMonth.push(event);
      } else {
        nextMonth.push(event);
      }
    });

    const groups: UpcomingEventGroup[] = [];

    if (today.length > 0) {
      groups.push({
        title: "Dzisiaj",
        events: today,
        dateRange: format(now, "EEEE, d MMMM", { locale: pl }),
      });
    }

    if (tomorrow.length > 0) {
      const tomorrowDate = addDays(now, 1);
      groups.push({
        title: "Jutro",
        events: tomorrow,
        dateRange: format(tomorrowDate, "EEEE, d MMMM", { locale: pl }),
      });
    }

    if (thisWeek.length > 0) {
      groups.push({
        title: "W tym tygodniu",
        events: thisWeek,
        dateRange: "Pozostałe dni",
      });
    }

    if (laterThisMonth.length > 0) {
      groups.push({
        title: "Później w tym miesiącu",
        events: laterThisMonth,
        dateRange: format(now, "MMMM", { locale: pl }),
      });
    }

    if (nextMonth.length > 0) {
      const nextMonthDate = addMonths(now, 1);
      groups.push({
        title: "W przyszłym miesiącu",
        events: nextMonth,
        dateRange: format(nextMonthDate, "MMMM yyyy", { locale: pl }),
      });
    }

    // Check if we have events in the near future (current week)
    const hasNearEvents = today.length > 0 || tomorrow.length > 0 || thisWeek.length > 0;

    return {
      groups,
      totalEvents: filteredEvents.length,
      hasEvents: filteredEvents.length > 0,
      nextEvent: filteredEvents[0] || null,
      hasNearEvents, // Whether there are events in current week
    };
  }, [allEvents]);

  return upcomingEvents;
};
