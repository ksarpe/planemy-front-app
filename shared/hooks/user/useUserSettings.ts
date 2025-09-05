import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@shared/api/user_settings";
import type { UserSettings } from "@/data/User";

// Query Keys for user settings
export const userSettingsKeys = {
  all: ["userSettings"] as const,
  detail: (userId: string) => [...userSettingsKeys.all, userId] as const,
};

/**
 * useUserSettingsQuery
 * Fetches the current user's settings from Firestore using React Query.
 */
export function useUserSettingsQuery(userId?: string) {
  return useQuery({
    queryKey: userId ? userSettingsKeys.detail(userId) : userSettingsKeys.all,
    queryFn: async () => {
      if (!userId) return null;
      return await getUserSettings(userId);
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

/**
 * useUpdateUserSettingsMutation
 * Updates user settings and invalidates the corresponding query to refresh consumers.
 */
export function useUpdateUserSettingsMutation(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<UserSettings>) => {
      if (!userId) return;
      return updateUserSettings(userId, payload);
    },
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: userSettingsKeys.detail(userId) });
    },
  });
}
