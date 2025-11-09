// src/shared/api/user.ts

import { buildApiUrl } from "@shared/config/api";
import { APIError } from "@shared/data/Auth/interfaces";
import type { User } from "@shared/data/User/interfaces";

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  console.log("Updating user profile with data:", data);
  const response = await fetch(buildApiUrl("user/profile"), {
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
