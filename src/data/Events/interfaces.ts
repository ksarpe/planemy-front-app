import type { EventInterface } from "@/data/types";

// Event related hook interfaces

export interface UpcomingEventGroup {
  title: string;
  events: EventInterface[];
  dateRange: string;
}
