import { EventInterface } from "../Calendar/events";

export interface SummaryData {
    defaultShoppingListName: string;
    defaultTaskListName: string;
}

export interface UpcomingEventGroup {
    title: string;
    dateRange: string;
    events: EventInterface[];
}

// Główna struktura odpowiedzi z API
export interface UpcomingEventsResponse {
    groups: UpcomingEventGroup[];
    totalEvents: number;
    hasEvents: boolean;
    nextEvent: EventInterface | null;
    hasNearEvents: boolean;
}