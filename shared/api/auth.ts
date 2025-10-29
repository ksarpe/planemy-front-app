//types
import type { AuthResponse, LoginRequest, RegisterRequest } from "@shared/data/Auth/interfaces";
import { APIError } from "@shared/data/Auth/interfaces";
import { User } from "@shared/data/User";

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch("http://localhost:8080/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include", // Include cookies for session management
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Authentication failed`, response.status, errorBody);
  }
  const data = await response.json();
  console.log("loginUser response data:", data);
  return data;
};

export const registerUser = async (credentials: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch("http://localhost:8080/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include", // Include cookies for session management
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Registration failed`, response.status, errorBody);
  }

  const data = await response.json();
  return data;
};

export const logoutUser = async (): Promise<void> => {
  const response = await fetch("http://localhost:8080/api/v1/auth/logout", {
    method: "POST",
    credentials: "include", // Include cookies for session management
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Logout failed`, response.status, errorBody);
  }
  return;
};

export const validateUser = async (): Promise<User> => {
  const response = await fetch("http://localhost:8080/api/v1/auth/userinfo", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`User validation failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const response = await fetch("http://localhost:8080/api/v1/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Changing password failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};
