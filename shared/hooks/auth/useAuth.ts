import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, registerUser, fetchUserProfile } from "@shared/api/auth";
import type { LoginRequest, RegisterRequest } from "@/data/Auth/interfaces";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Here you can handle successful login (save token, redirect, etc.)
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials: RegisterRequest) => registerUser(credentials),
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      // Here you can handle successful registration (save token, redirect, etc.)
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
  });
};
