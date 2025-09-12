import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import { addEvent, updateEvent, deleteEvent, getEvents } from "../../api/events";

import type { EventResponse, EventInterface } from "../../data/Calendar/events";

export function useEvents() {
  return useQuery<EventResponse, unknown, EventResponse, string[]>({
    queryKey: ["events"],
    queryFn: getEvents,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateEvent() {
  return useMutation({
    mutationFn: (eventData: Partial<EventInterface>) => addEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EventInterface> }) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeleteEvent() {
  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
