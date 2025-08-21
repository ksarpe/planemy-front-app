import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedbackAPI, CreateFeedbackData } from "@/api/feedback";
import { useToastContext } from "@/hooks/context/useToastContext";

export const useFeedback = () => {
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  // Query to get user's own feedback submissions
  const {
    data: userFeedbacks = [],
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["feedback", "user"],
    queryFn: feedbackAPI.getUserFeedbacks,
  });

  // Query to get all public feedbacks (accepted + resolved)
  const {
    data: publicFeedbacks = [],
    isLoading: isLoadingPublic,
    error: publicError,
  } = useQuery({
    queryKey: ["feedback", "public"],
    queryFn: feedbackAPI.getAllPublicFeedbacks,
  });

  // Mutation to create feedback
  const createFeedbackMutation = useMutation({
    mutationFn: (data: CreateFeedbackData) => feedbackAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      showToast("success", "Feedback został wysłany! Dziękujemy za Twoją opinię.");
    },
    onError: (error) => {
      console.error("Error creating feedback:", error);
      showToast("error", "Wystąpił błąd podczas wysyłania feedbacku. Spróbuj ponownie.");
    },
  });

  return {
    userFeedbacks,
    publicFeedbacks,
    isLoadingUser,
    isLoadingPublic,
    userError,
    publicError,
    createFeedback: createFeedbackMutation.mutate,
    isCreating: createFeedbackMutation.isPending,
  };
};
