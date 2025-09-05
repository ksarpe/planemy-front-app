import type { EventInterface } from "@/data/Calendar/events";

// Event related hook interfaces

export interface UpcomingEventGroup {
  title: string;
  events: EventInterface[];
  dateRange: string;
}
