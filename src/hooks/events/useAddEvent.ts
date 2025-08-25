import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEvent } from "../../api/events";
import { EventInterface } from "@/data/Calendar/events";
import { useAuthContext } from "../context/useAuthContext";
import { useToastContext } from "../context/useToastContext";

export const useAddEvent = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  const addEventMutation = useMutation({
    mutationFn: async (eventData: Omit<EventInterface, "id" | "createdAt" | "updatedAt" | "userId">) => {
      if (!user?.uid) {
        throw new Error("User not authenticated");
      }

      const eventWithUserId = {
        ...eventData,
        userId: user.uid,
      };

      return await addEvent(eventWithUserId);
    },
    onSuccess: () => {
      // Invalidate events queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["events"] });
      showToast("success", "Event został pomyślnie utworzony!");
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create event";
      showToast("error", `Błąd podczas tworzenia eventu: ${errorMessage}`);
    },
  });

  return {
    addEvent: addEventMutation.mutateAsync,
    isLoading: addEventMutation.isPending,
    error: addEventMutation.error,
    isSuccess: addEventMutation.isSuccess,
    reset: addEventMutation.reset,
  };
};
