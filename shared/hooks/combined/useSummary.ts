// import { useQuery } from "@tanstack/react-query";
// import { SummaryData, UpcomingEventsResponse } from "@shared/data/Combined/interfaces";
// import { getSummaryData, getUpcomingEvents } from "@shared/api/combined";

// export function useDashboardSummary(defaultShoppingListId: string, defaultTaskListId: string) {
//   return useQuery<SummaryData, unknown, SummaryData, (string | undefined | null)[]>({
//     queryKey: ["dashboard-summary", defaultShoppingListId, defaultTaskListId],
//     queryFn: () => getSummaryData(defaultShoppingListId, defaultTaskListId),
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     enabled: !!defaultShoppingListId && !!defaultTaskListId, // Only run query if both IDs are provided
//   });
// }

// export const useUpcomingEvents = () => {
//   return useQuery<UpcomingEventsResponse, unknown, UpcomingEventsResponse, (string | undefined | null)[]    >({
//     queryKey: ["upcomingEvents"],
//     // QueryFn wywołuje nowe, zoptymalizowane API
//     queryFn: getUpcomingEvents,
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//   });
// };
