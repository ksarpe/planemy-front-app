// src/shared/api/user.ts

import { APIError } from "@shared/data/Auth/interfaces";
import type { User } from "@shared/data/User/interfaces";

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const response = await fetch("http://localhost:8080/api/v1/user/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError("Failed to update user profile", response.status, errorBody);
  }

  const updatedUserInfo = await response.json();
  console.log("Updated user info:", updatedUserInfo);
  return updatedUserInfo;
};
