import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addLabel,
  addLabelConnection,
  deleteAllLabelConnectionsForObject,
  deleteLabel,
  deleteLabelConnection,
  deleteLabelConnectionByParams,
  getLabel,
  getLabelConnections,
  getLabels,
  updateLabel,
} from "../../api/labels";
import { queryClient } from "../../lib/queryClient";

import type { LabelConnection, LabelInterface, LabelResponse } from "../../data/Utils/interfaces";

// Labels hooks
export function useLabels() {
  return useQuery<LabelResponse, unknown, LabelResponse, string[]>({
    queryKey: ["labels"],
    queryFn: getLabels,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useLabel(labelId: string) {
  return useQuery<LabelInterface | undefined, unknown, LabelInterface | undefined, (string | undefined)[]>({
    queryKey: ["labels", labelId],
    queryFn: () => getLabel(labelId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!labelId,
  });
}

export function useCreateLabel() {
  return useMutation({
    mutationFn: (labelData: Omit<LabelInterface, "id" | "userId">) => addLabel(labelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

export function useUpdateLabel() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LabelInterface> }) => updateLabel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeleteLabel() {
  return useMutation({
    mutationFn: (labelId: string) => deleteLabel(labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      queryClient.invalidateQueries({ queryKey: ["label-connections"] });
    },
  });
}

// Label Connections hooks
export function useLabelConnections(objectId?: string, objectType?: string) {
  return useQuery<LabelConnection[], unknown, LabelConnection[], (string | undefined)[]>({
    queryKey: ["label-connections", objectId, objectType],
    queryFn: () => getLabelConnections(objectId, objectType),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateLabelConnection() {
  return useMutation({
    mutationFn: (connectionData: Omit<LabelConnection, "id" | "createdAt">) => addLabelConnection(connectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["label-connections"] });
    },
  });
}

export function useDeleteLabelConnection() {
  return useMutation({
    mutationFn: (connectionId: string) => deleteLabelConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["label-connections"] });
    },
  });
}

export function useDeleteLabelConnectionByParams() {
  return useMutation({
    mutationFn: ({ objectId, objectType, labelId }: { objectId: string; objectType: string; labelId: string }) =>
      deleteLabelConnectionByParams(objectId, objectType, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["label-connections"] });
    },
  });
}

export function useDeleteAllLabelConnectionsForObject() {
  return useMutation({
    mutationFn: ({ objectId, objectType }: { objectId: string; objectType: string }) =>
      deleteAllLabelConnectionsForObject(objectId, objectType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["label-connections"] });
    },
  });
}

// Convenience hooks for common operations
export function useAddLabelToObject() {
  return useMutation({
    mutationFn: ({
      objectId,
      objectType,
      labelId,
      userId,
    }: {
      objectId: string;
      objectType: string;
      labelId: string;
      userId: string;
    }) =>
      addLabelConnection({
        userId,
        objectId,
        objectType,
        labelId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["label-connections"] });
    },
  });
}

export function useRemoveLabelFromObject() {
  return useMutation({
    mutationFn: ({ objectId, objectType, labelId }: { objectId: string; objectType: string; labelId: string }) =>
      deleteLabelConnectionByParams(objectId, objectType, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["label-connections"] });
    },
  });
}

export function useLabelsForObject(objectId: string, objectType: string) {
  return useQuery<LabelConnection[], unknown, LabelConnection[], (string | undefined)[]>({
    queryKey: ["label-connections", objectId, objectType],
    queryFn: () => getLabelConnections(objectId, objectType),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!(objectId && objectType),
  });
}

//   return useMutation({
//     mutationFn: ({ labelId, updates }: { labelId: string; updates: Partial<LabelInterface> }) =>
//       updateLabel(labelId, updates),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["labels"] });
//       //showToast("success", "Etykieta została zaktualizowana!");
//     },
//     onError: (error) => {
//       console.error("Error updating label:", error);
//       //showToast("error", "Błąd podczas aktualizacji etykiety");
//     },
//   });
// };

// export const useDeleteLabel = () => {
//   //const { showToast } = useToastContext();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (labelId: string) => deleteLabel(labelId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["labels"] });
//       //showToast("success", "Etykieta została usunięta!");
//     },
//     onError: (error) => {
//       console.error("Error deleting label:", error);
//       //showToast("error", "Błąd podczas usuwania etykiety");
//     },
//   });
// };

// export const useBulkDeleteLabels = () => {
//   //const { showToast } = useToastContext();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (labelIds: string[]) => bulkDeleteLabels(labelIds),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["labels"] });
//       //showToast("success", "Etykiety zostały usunięte!");
//     },
//     onError: (error) => {
//       console.error("Error bulk deleting labels:", error);
//       //showToast("error", "Błąd podczas usuwania etykiet");
//     },
//   });
// };

// // --- MUTATIONS dla połączeń etykiet ---

// export const useCreateLabelConnection = () => {
//   const { user } = useAuthContext();
//   //const { showToast } = useToastContext();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ objectId, objectType, labelId }: { objectId: string; objectType: string; labelId: string }) =>
//       createLabelConnectionFirebase(user!.uid, objectId, objectType, labelId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["labelConnections"] });
//       //showToast("success", "Etykieta została przypisana!");
//     },
//     onError: (error) => {
//       console.error("Error creating label connection:", error);
//       //showToast("error", "Błąd podczas przypisywania etykiety");
//     },
//   });
// };

// export const useRemoveLabelConnection = () => {
//   const { user } = useAuthContext();
//   //const { showToast } = useToastContext();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ objectId, objectType, labelId }: { objectId: string; objectType: string; labelId: string }) =>
//       removeLabelConnectionFirebase(user!.uid, objectId, objectType, labelId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["labelConnections"] });
//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//       //showToast("success", "Etykieta została usunięta z obiektu!");
//     },
//     onError: (error) => {
//       console.error("Error removing label connection:", error);
//       //showToast("error", "Błąd podczas usuwania etykiety z obiektu");
//     },
//   });
// };

// export const useRemoveAllLabelConnections = () => {
//   const { user } = useAuthContext();
//   //const { showToast } = useToastContext();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ objectId, objectType }: { objectId: string; objectType: string }) =>
//       removeAllLabelConnectionsForObject(user!.uid, objectId, objectType),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["labelConnections"] });
//       //showToast("success", "Wszystkie etykiety zostały usunięte z obiektu!");
//     },
//     onError: (error) => {
//       console.error("Error removing all label connections:", error);
//       //showToast("error", "Błąd podczas usuwania wszystkich etykiet z obiektu");
//     },
//   });
// };
