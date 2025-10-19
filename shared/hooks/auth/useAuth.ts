//external
import { useMutation, useQuery } from "@tanstack/react-query";
//api,context
import { loginUser, registerUser, logoutUser, validateUser } from "@shared/api/auth";
//types
import { type LoginRequest, type RegisterRequest } from "@shared/data/Auth/interfaces";
import { User } from "@shared/data/User";
import { queryClient } from "@shared/lib/queryClient";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          loginUser(credentials)
            .then(resolve)
            .catch(reject);
        }, 2000);
      }),// TIMEOUT and promise TO REMOVE
    onSuccess: () => {
      queryClient.invalidateQueries();
      navigate("/");
    },
    onError: (error: unknown) => {
      console.error("Login failed:", error);
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: RegisterRequest) => registerUser(credentials),
    onSuccess: (data) => {
      console.log("Registration successful:", data);
        queryClient.invalidateQueries();
      navigate("/");
    },
    onError: (error: unknown) => {
      console.error("Registration failed:", error);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });
};

export const useUserInfoQuery = () => {
  return useQuery<User, unknown, User, string[]>({
    queryKey: ["userInfo"],
    queryFn: validateUser,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: true,
  });
};
