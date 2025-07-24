import { EventInterface } from "@/data/types";
import { getDateKey } from "@/utils/helpers";

//Function to generate weeks for a given month MONTH VIEW
export function generateWeeks(monthStart: Date) {
  const start = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);

  // First monday, whether it is in current month or little bit earlier
  const dayOfWeek = start.getDay(); // 0 = sunday
  start.setDate(start.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const weeks: Date[][] = [];
  const current = new Date(start);
  const month = monthStart.getMonth();

  while (true) {
    const week: Date[] = [];

    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    weeks.push(week);

    // Check if the last day of the week is still in the same month
    const lastDayOfWeek = week[6]; // 6th day of the week (Saturday)
    if (lastDayOfWeek.getMonth() !== month) {
      break;
    }
  }

  return weeks;
}

// Function to get the week starting from a given date
export function getWeek(startDate: Date): Date[] {
  const start = new Date(startDate);
  const dayOfWeek = start.getDay(); // 0 = niedziela, 1 = poniedziałek, ...

  // Przesuń do poniedziałku
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  start.setDate(start.getDate() + diffToMonday);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    week.push(day);
  }

  return week;
}

//Function to get months that are visible in the MONTH VIEW to determine the months shown in the header
export function getVisibleMonthsInWeek(currentDate: Date): string[] {
  const months = new Set<string>();
  for (const day of getWeek(currentDate)) {
    const month = day.toLocaleString("en", { month: "long" });
    months.add(month);
  }

  return Array.from(months);
}

//if the current event is overlapping with the previous event (to push top position for WEEKLY VIEW)
function isOverlaping(previousEvent: EventInterface, currentEvent: EventInterface): boolean {
  const currentStart = new Date(currentEvent.start);
  const previousEnd = new Date(previousEvent.end);

  currentStart.setHours(0, 0, 0, 0);
  previousEnd.setHours(0, 0, 0, 0);

  return currentStart.getTime() <= previousEnd.getTime();
}

//Get actual events for the week even if there is just a part of the event from previous or next week
function getActualEventsInWeek(
  events: Record<string, EventInterface[]>,
  week: Date[]
): Record<string, EventInterface[]> {
  const weekStart = week[0];
  const weekEnd = new Date(week[6].getTime() + 24 * 60 * 60 * 1000); // exclusive
  const actualEvents: Record<string, EventInterface[]> = {};

  for (const dateKey in events) {
    for (const event of events[dateKey]) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      if (eventEnd <= weekStart || eventStart >= weekEnd) continue; //other week

      const actualStart = eventStart < weekStart ? weekStart : eventStart;
      const actualEnd = eventEnd > weekEnd ? weekEnd : eventEnd;

      // Calculate colSpan as the number of days between actualStart and actualEnd (inclusive of both days)
      const startDay = new Date(actualStart.getFullYear(), actualStart.getMonth(), actualStart.getDate());
      const endDay = new Date(actualEnd.getFullYear(), actualEnd.getMonth(), actualEnd.getDate());
      const colSpan = Math.max(
        1,
        Math.floor((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1
      );

      const clonedEvent = { ...event, colSpan };
      const key = getDateKey(actualStart);
      if (!actualEvents[key]) actualEvents[key] = [];
      actualEvents[key].push(clonedEvent);
    }
  }
  return actualEvents;
}

// Get events in the given week from the given events object.
// It will return also top position of each event in each day of the week (WEEKLY VIEW)
//exmaple return:
// [
//   { data: { ...event1 }, top: 0 },
//   { data: { ...event2 }, top: 28 },
// ]
export function getEventsInWeekAndTop(
  events: Record<string, EventInterface[]>,
  weekStartDate: Date
): { data: EventInterface; top: number }[] {
  const week = getWeek(weekStartDate);
  events = getActualEventsInWeek(events, week);
  const eventsTop: { data: EventInterface; top: number }[] = [];
  const previousLongevity: Record<number, EventInterface> = {};
  let inserted: boolean = false;
  let i = 0;

  for (const day of week) {
    const dateKey = getDateKey(day);
    if (events[dateKey]) {
      //sort to have longest event first
      const sortedEvents = [...events[dateKey]].sort((a, b) => {
        const lenA = new Date(a.end).getTime() - new Date(a.start).getTime();
        const lenB = new Date(b.end).getTime() - new Date(b.start).getTime();
        return lenB - lenA;
      });
      for (const event of sortedEvents) {
        inserted = false;
        i = 0; //always check from the top because there might be a free position if previous event has been inserted for example in the middle because of overlapping.
        while (!inserted) {
          if (previousLongevity[i] && isOverlaping(previousLongevity[i], event)) {
            i++;
          } else {
            previousLongevity[i] = event;
            eventsTop.push({
              data: event,
              top: 28 * i,
            });
            inserted = true;
          }
        }
      }
    }
  }
  return eventsTop;
}
