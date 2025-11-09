import { buildApiUrl } from "../config/api";
import { APIError } from "../data/Auth";
import { type Feedback, type CreateFeedbackData } from "../data/User/interfaces";

export const getFeedbacks = async (): Promise<Feedback[]> => {
  const response = await fetch(buildApiUrl("feedback"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting feedbacks failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const getFeedback = async (feedbackId: string): Promise<Feedback | undefined> => {
  if (!feedbackId) {
    throw new Error("Feedback ID is required");
  }

  const response = await fetch(buildApiUrl(`feedback/${feedbackId}`), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting feedback failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const getUserFeedbacks = async (): Promise<Feedback[]> => {
  const response = await fetch(buildApiUrl("feedback/user"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting user feedbacks failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const getPublicFeedbacks = async (): Promise<Feedback[]> => {
  const response = await fetch(buildApiUrl("feedback/public"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting public feedbacks failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const addFeedback = async (feedbackData: CreateFeedbackData): Promise<Partial<Feedback>> => {
  const response = await fetch(buildApiUrl("feedback"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding feedback failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const updateFeedback = async (
  feedbackId: string,
  feedbackData: Partial<Feedback>,
): Promise<Partial<Feedback>> => {
  if (!feedbackId) {
    throw new Error("Feedback ID is required for update");
  }

  const response = await fetch(buildApiUrl(`feedback/${feedbackId}`)  , {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating feedback failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const deleteFeedback = async (feedbackId: string): Promise<void> => {
  if (!feedbackId) {
    throw new Error("Feedback ID is required for deletion");
  }

  const response = await fetch(buildApiUrl(`feedback/${feedbackId}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting feedback failed`, response.status, errorBody);
  }
};
