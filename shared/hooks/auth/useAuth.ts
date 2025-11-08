/**
 * Authentication Hooks with Automatic Token Refresh
 *
 * This module provides React hooks for authentication with built-in token refresh logic.
 *
 * Token Refresh Flow:
 * 1. When useValidate() is called, it first tries to validate the user with the current access token
 * 2. If the access token is expired (401 error), it automatically calls the refresh endpoint
 * 3. The refresh endpoint updates both access_token and refresh_token cookies
 * 4. useValidate() retries the validation with the new access token
 * 5. If refresh fails, the user is logged out and redirected to login
 *
 * Available Hooks:
 * - useLogin: Login with username/password
 * - useRegister: Register new user
 * - useLogout: Logout current user
 * - useValidate: Validate user session (with auto-refresh)
 * - useRefreshToken: Manually refresh access token
 * - useChangePassword: Change user password
 *
 * For API calls in other modules:
 * - Use fetchWithRefresh() from @shared/lib/fetchWithRefresh instead of fetch()
 * - This provides automatic token refresh for all API calls
 */

//external
import { useMutation, useQuery } from "@tanstack/react-query";
//api,context
import { changePassword, loginUser, logoutUser, refreshToken, registerUser, validateUser } from "@shared/api/auth";
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

export const useValidate = () => {
  return useQuery<User, unknown, User, string[]>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        // Try to validate user with current access token
        return await validateUser();
      } catch (error) {
        // If validation fails with 401 (unauthorized), try to refresh token
        if (error instanceof APIError && error.status === 401) {
          try {
            // Attempt to refresh the access token
            await refreshToken();
            // Retry validation with new access token
            return await validateUser();
          } catch (refreshError) {
            // If refresh also fails, user needs to log in again
            throw refreshError;
          }
        }
        // For other errors, just throw them
        throw error;
      }
    },
    retry: false, // Don't retry automatically - we handle refresh manually
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });
};

export const useRefreshToken = () =>
  useMutation({
    mutationFn: () => refreshToken(),
    onSuccess: () => {
      // Invalidate user info to refetch with new token
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
  });

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
