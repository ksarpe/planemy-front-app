import type { EventInterface } from "@/data/types";

export function getSortedEvents(events: EventInterface[]): EventInterface[] {
  return events
    .filter((event) => {
      const rawDate = event.start || event.start;
      if (!rawDate) return false;

      const eventDate = new Date(rawDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start).getTime();
      const dateB = new Date(b.start).getTime();
      return dateA - dateB;
    });
}
