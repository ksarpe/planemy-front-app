/**
 * Authentication Hooks
 *
 * This module provides React hooks for authentication.
 *
 * Available Hooks:
 * - useLogin: Login with username/password
 * - useRegister: Register new user
 * - useLogout: Logout current user
 * - useValidate: Validate user session
 * - useChangePassword: Change user password
 */

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
    onSuccess: async () => {
      // Najpierw refetch user info
      await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      // Potem dopiero inne queries w tle
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 100);
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

export const useValidate = () => {
  return useQuery<User, unknown, User, string[]>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      return await validateUser();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
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
