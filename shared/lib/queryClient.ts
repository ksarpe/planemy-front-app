import { QueryClient } from "@tanstack/react-query";

// Konfiguracja globalnych ustawień dla React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Czas przez który dane są uważane za "fresh" (świeże)
      staleTime: 1000 * 60 * 5, // 5 minut

      // Czas przez który nieaktywne dane są przechowywane w cache
      gcTime: 1000 * 60 * 30, // 30 minut (wcześniej nazywane cacheTime)

      // Automatyczne ponawianie zapytań w przypadku błędu
      retry: (failureCount, error) => {
        // Nie ponawiaj dla błędów 4xx (błędy klienta)
        if (error instanceof Error && "status" in error) {
          const status = (error as Error & { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Maksymalnie 3 próby dla innych błędów
        return failureCount < 3;
      },

      // Interwał dla retry
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch przy powrocie do okna
      refetchOnWindowFocus: false,

      // Refetch przy reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Automatyczne ponawianie mutacji
      retry: false, // Mutacje zwykle nie powinny być automatycznie ponawiane
    },
  },
  // mutationCache: new MutationCache({
  //   onError: (error) => {
  //     window.location.href = "/login";
  //   },
  // }),
});
