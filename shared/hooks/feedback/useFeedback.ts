import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import {
  addFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbacks,
  getFeedback,
  getUserFeedbacks,
  getPublicFeedbacks,
} from "../../api/feedback";

import type { Feedback, CreateFeedbackData } from "../../data/User/interfaces";

export function useFeedbacks() {
  return useQuery<Feedback[], unknown, Feedback[], string[]>({
    queryKey: ["feedbacks"],
    queryFn: getFeedbacks,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useFeedback(feedbackId: string) {
  return useQuery<Feedback | undefined, unknown, Feedback | undefined, (string | undefined)[]>({
    queryKey: ["feedbacks", feedbackId],
    queryFn: () => getFeedback(feedbackId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!feedbackId,
  });
}

export function useUserFeedbacks() {
  return useQuery<Feedback[], unknown, Feedback[], string[]>({
    queryKey: ["feedbacks", "user"],
    queryFn: getUserFeedbacks,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePublicFeedbacks() {
  return useQuery<Feedback[], unknown, Feedback[], string[]>({
    queryKey: ["feedbacks", "public"],
    queryFn: getPublicFeedbacks,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateFeedback() {
  return useMutation({
    mutationFn: (feedbackData: CreateFeedbackData) => addFeedback(feedbackData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}

export function useUpdateFeedback() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Feedback> }) => updateFeedback(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeleteFeedback() {
  return useMutation({
    mutationFn: (feedbackId: string) => deleteFeedback(feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
}
