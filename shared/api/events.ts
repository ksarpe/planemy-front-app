import { APIError } from "@shared/data/Auth";
import { type EventResponse, EventInterface } from "@shared/data/Calendar/events";

export const getEvents = async (): Promise<EventResponse> => {
  const response = await fetch("http://localhost:8080/api/v1/events", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting events failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const addEvent = async (eventData: Partial<EventInterface>): Promise<Partial<EventInterface>> => {
  const response = await fetch("http://localhost:8080/api/v1/events", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });
  console.log(eventData);
  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding event failed`, response.status, errorBody);
  }
  const data = await response.json();
  console.log("Added event:", data);
  return data;
};

export const updateEvent = async (
  eventId: string,
  eventData: Partial<EventInterface>,
): Promise<Partial<EventInterface>> => {
  if (!eventId) {
    throw new Error("Event ID is required for update");
  }
  const response = await fetch(`http://localhost:8080/api/v1/events/${eventId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating event failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  if (!eventId) {
    throw new Error("Event ID is required for deletion");
  }

  const response = await fetch(`http://localhost:8080/api/v1/events/${eventId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting event failed`, response.status, errorBody);
  }
};
