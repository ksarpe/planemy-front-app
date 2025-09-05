import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
//import { useToastContext } from "@shared/hooks/context/useToastContext";
import {
  createLabel,
  updateLabel,
  deleteLabel,
  getUserLabels,
  bulkDeleteLabels,
  createLabelConnectionFirebase,
  removeLabelConnectionFirebase,
  removeAllLabelConnectionsForObject,
} from "@shared/api/labels";
import type { LabelInterface } from "@shared/data/Utils/interfaces";

// Hook do pobierania wszystkich etykiet użytkownika
export const useLabels = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["labels", user?.uid],
    queryFn: () => getUserLabels(user!.uid),
    enabled: !!user, // Etykiety pobieramy tylko gdy user jest zalogowany
  });
};

// --- MUTATIONS dla etykiet ---

export const useCreateLabel = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color, description }: { name: string; color: string; description?: string }) =>
      createLabel(name, color, user!.uid, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      //showToast("success", "Etykieta została dodana!");
    },
    onError: (error) => {
      console.error("Error creating label:", error);
      //showToast("error", "Błąd podczas dodawania etykiety");
    },
  });
};

export const useUpdateLabel = () => {
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ labelId, updates }: { labelId: string; updates: Partial<LabelInterface> }) =>
      updateLabel(labelId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      //showToast("success", "Etykieta została zaktualizowana!");
    },
    onError: (error) => {
      console.error("Error updating label:", error);
      //showToast("error", "Błąd podczas aktualizacji etykiety");
    },
  });
};

export const useDeleteLabel = () => {
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labelId: string) => deleteLabel(labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      //showToast("success", "Etykieta została usunięta!");
    },
    onError: (error) => {
      console.error("Error deleting label:", error);
      //showToast("error", "Błąd podczas usuwania etykiety");
    },
  });
};

export const useBulkDeleteLabels = () => {
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labelIds: string[]) => bulkDeleteLabels(labelIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      //showToast("success", "Etykiety zostały usunięte!");
    },
    onError: (error) => {
      console.error("Error bulk deleting labels:", error);
      //showToast("error", "Błąd podczas usuwania etykiet");
    },
  });
};

// --- MUTATIONS dla połączeń etykiet ---

export const useCreateLabelConnection = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ objectId, objectType, labelId }: { objectId: string; objectType: string; labelId: string }) =>
      createLabelConnectionFirebase(user!.uid, objectId, objectType, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labelConnections"] });
      //showToast("success", "Etykieta została przypisana!");
    },
    onError: (error) => {
      console.error("Error creating label connection:", error);
      //showToast("error", "Błąd podczas przypisywania etykiety");
    },
  });
};

export const useRemoveLabelConnection = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ objectId, objectType, labelId }: { objectId: string; objectType: string; labelId: string }) =>
      removeLabelConnectionFirebase(user!.uid, objectId, objectType, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labelConnections"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      //showToast("success", "Etykieta została usunięta z obiektu!");
    },
    onError: (error) => {
      console.error("Error removing label connection:", error);
      //showToast("error", "Błąd podczas usuwania etykiety z obiektu");
    },
  });
};

export const useRemoveAllLabelConnections = () => {
  const { user } = useAuthContext();
  //const { showToast } = useToastContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ objectId, objectType }: { objectId: string; objectType: string }) =>
      removeAllLabelConnectionsForObject(user!.uid, objectId, objectType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labelConnections"] });
      //showToast("success", "Wszystkie etykiety zostały usunięte z obiektu!");
    },
    onError: (error) => {
      console.error("Error removing all label connections:", error);
      //showToast("error", "Błąd podczas usuwania wszystkich etykiet z obiektu");
    },
  });
};
