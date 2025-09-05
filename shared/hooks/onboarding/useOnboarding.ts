import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkOnboardingStatus, completeOnboarding, updateUserProfile } from "@shared/api/onboarding";
import type { OnboardingData, UserProfile } from "@/data/User/interfaces";

// Hook to check onboarding status
export const useOnboardingStatus = (userId: string | null) => {
  return useQuery({
    queryKey: ["onboarding-status", userId],
    queryFn: () => checkOnboardingStatus(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to complete onboarding
export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: OnboardingData }) => completeOnboarding(userId, data),
    onSuccess: (data, variables) => {
      // Invalidate onboarding status query
      queryClient.invalidateQueries({ queryKey: ["onboarding-status", variables.userId] });
      // Update user profile cache if exists
      queryClient.setQueryData(["user-profile", variables.userId], data);
    },
    onError: (error) => {
      console.error("Failed to complete onboarding:", error);
    },
  });
};

// Hook to update user profile during onboarding
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<UserProfile> }) =>
      updateUserProfile(userId, updates),
    onSuccess: (data, variables) => {
      // Update user profile cache
      queryClient.setQueryData(["user-profile", variables.userId], data);
    },
    onError: (error) => {
      console.error("Failed to update user profile:", error);
    },
  });
};
