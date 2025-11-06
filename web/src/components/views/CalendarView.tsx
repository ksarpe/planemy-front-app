import { EventCalendar } from "@/components/shadcn/Calendar/event-calendar";
import type { CalendarEvent } from "@/components/shadcn/types";
import Spinner from "@/components/ui/Utils/Spinner";
import type { EventInterface } from "@shared/data/Calendar/events";
import { useCreateEvent, useDeleteEvent, useEvents, useUpdateEvent } from "@shared/hooks/events";
import { useMemo } from "react";

// Convert EventInterface to CalendarEvent
const convertToCalendarEvent = (event: EventInterface): CalendarEvent => ({
  id: event.id,
  title: event.title || "Untitled Event",
  description: event.description || "",
  start: new Date(event.starts_at),
  end: new Date(event.ends_at),
  allDay: false, // EventInterface doesn't have allDay field
  location: "", // EventInterface doesn't have location field
});

export default function CalendarView() {
  const { data, isLoading, error } = useEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const calendarEvents = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map(convertToCalendarEvent);
  }, [data?.items]);

  const handleEventAdd = async (event: CalendarEvent) => {
    try {
      const eventData: Partial<EventInterface> = {
        title: event.title,
        description: event.description || "",
        starts_at: event.start.toISOString(),
        ends_at: event.end.toISOString(),
      };
      await createEventMutation.mutateAsync(eventData);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEventUpdate = async (event: CalendarEvent) => {
    try {
      const eventData: Partial<EventInterface> = {
        title: event.title,
        description: event.description || "",
        starts_at: event.start.toISOString(),
        ends_at: event.end.toISOString(),
      };
      await updateEventMutation.mutateAsync({ id: event.id, data: eventData });
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      await deleteEventMutation.mutateAsync(eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Error loading events</p>
      </div>
    );
  }

  return (
    <div id="calendar-view" className="h-full flex flex-col overflow-hidden">
      <EventCalendar
        events={calendarEvents}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
}
