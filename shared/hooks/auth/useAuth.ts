//external
import { useMutation, useQuery } from "@tanstack/react-query";
//api,context
import { changePassword, loginUser, logoutUser, registerUser, validateUser } from "@shared/api/auth";
//types
import { APIError, type LoginRequest, type RegisterRequest } from "@shared/data/Auth/interfaces";
import { User } from "@shared/data/User";
import { queryClient } from "@shared/lib/queryClient";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries();
      navigate("/");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: RegisterRequest) => registerUser(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries();
      navigate("/");
    },
  });
};

export const useLogout = () =>
  useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });

export const useUserInfoQuery = () => {
  return useQuery<User, unknown, User, string[]>({
    queryKey: ["userInfo"],
    queryFn: validateUser,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: true,
  });
};

export const useChangePassword = (options?: { onSuccess?: () => void; onError?: (error: APIError) => void }) => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePassword(currentPassword, newPassword),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: APIError) => {
      options?.onError?.(error);
    },
  });
};
