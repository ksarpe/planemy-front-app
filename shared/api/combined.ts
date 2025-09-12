import { APIError } from "@shared/data/Auth";
import { SummaryData, UpcomingEventsResponse } from "@shared/data/Combined/interfaces";

export const getSummaryData = async (
  defaultShoppingListId: string,
  defaultTaskListId: string,
): Promise<SummaryData> => {
  return {
    defaultShoppingListName: "Test",
    defaultTaskListName: "Test",
  };
  const response = await fetch(
    `/api/combined/summary?defaultShoppingListId=${defaultShoppingListId}&defaultTaskListId=${defaultTaskListId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch summary data");
  }
  return response.json();
};

export const getUpcomingEvents = async (): Promise<UpcomingEventsResponse> => {
  return {
    groups: [],
    totalEvents: 0,
    hasEvents: false,
    nextEvent: null,
    hasNearEvents: false,
  };
  const response = await fetch("http://localhost:8080/api/v1/events/upcoming", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError("Failed to fetch upcoming events", response.status, errorBody);
  }
  const data = await response.json();
  return data;
};
