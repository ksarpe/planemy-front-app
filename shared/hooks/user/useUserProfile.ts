// src/shared/hooks/user/useUpdateUserProfile.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@shared/api/user_profile";
import { APIError } from "@shared/data/Auth/interfaces";
import type { User } from "@shared/data/User/interfaces";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";

export const useUpdateUserProfile = () => {
  const { refetchUser } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => updateUserProfile(data),

    // Callback wywoływany w przypadku sukcesu
    onSuccess: (updatedUser: User) => {
      //Reach query cache and update userInfo
      refetchUser();
      queryClient.setQueryData(["userInfo"], updatedUser);
    },

    onError: (error: unknown) => {
      // Obsługa błędów, która jest spójna w całej aplikacji
      if (error instanceof APIError) {
        // Logika dla błędów z backendu
        const errorMessage = error.body?.message || "Wystąpił błąd podczas aktualizacji profilu.";
        console.error("Błąd aktualizacji profilu:", error);
      } else {
        // Logika dla błędów sieciowych
        console.error("Błąd aktualizacji profilu:", error);
      }
    },
  });
};
