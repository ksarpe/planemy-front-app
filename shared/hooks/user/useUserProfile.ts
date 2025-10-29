import { updateUserProfile } from "@shared/api/user_profile";
import type { User } from "@shared/data/User/interfaces";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { queryClient } from "@shared/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUserProfile = (options?: { onSuccess?: () => void; onError?: (error: unknown) => void }) => {
  const { refetchUser } = useAuthContext();
  return useMutation({
    mutationFn: (data: Partial<User>) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      refetchUser();
      options?.onSuccess?.();
    },
    onError: (error: unknown) => {
      options?.onError?.(error);
    },
  });
};
