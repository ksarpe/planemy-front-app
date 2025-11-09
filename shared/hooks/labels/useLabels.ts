import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addLabel,
  addLabelConnection,
  // deleteAllLabelConnectionsForObject,
  deleteLabel,
  deleteLabelConnection,
  // deleteLabelConnectionByParams,
  getLabel,
  getLabelConnections,
  getLabels,
  setLabelConnection,
  updateLabel,
} from "../../api/labels";
import { queryClient } from "../../lib/queryClient";

import type {
  LabelConnection,
  LabelConnectionResponse,
  LabelInterface,
  LabelResponse,
} from "../../data/Utils/interfaces";

// Labels hooks
export function useLabels(options?: { enabled?: boolean }) {
  return useQuery<LabelResponse, unknown, LabelResponse, string[]>({
    queryKey: ["labels"],
    queryFn: getLabels,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true, // Domyślnie włączone, można wyłączyć przez enabled: false
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
export function useLabelConnections(objectId?: string, objectType?: string, options?: { enabled?: boolean }) {
  return useQuery<LabelConnectionResponse, unknown, LabelConnectionResponse, (string | undefined)[]>({
    queryKey: ["label-connections", objectId, objectType],
    queryFn: () => getLabelConnections(objectId, objectType),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
  });
}

export function useCreateLabelConnection() {
  return useMutation({
    mutationFn: (connectionData: Pick<LabelConnection, "entity_id" | "entity_type" | "label_id">) =>
      addLabelConnection(connectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["label-connections"] });
    },
  });
}

// Set label connection (replaces existing label if any - ensures only one label per object)
export function useSetLabelConnection() {
  return useMutation({
    mutationFn: (connectionData: Pick<LabelConnection, "entity_id" | "entity_type" | "label_id">) =>
      setLabelConnection(connectionData),
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

// COMMENTED OUT - These endpoints don't exist on the server
// export function useDeleteLabelConnectionByParams() {
//   return useMutation({
//     mutationFn: ({ objectId, objectType, labelId }: { objectId: string; objectType: string; labelId: string }) =>
//       deleteLabelConnectionByParams(objectId, objectType, labelId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["label-connections"] });
//     },
//   });
// }

// export function useDeleteAllLabelConnectionsForObject() {
//   return useMutation({
//     mutationFn: ({ objectId, objectType }: { objectId: string; objectType: string }) =>
//       deleteAllLabelConnectionsForObject(objectId, objectType),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["label-connections"] });
//     },
//   });
// }

// export function useRemoveLabelFromObject() {
//   return useMutation({
//     mutationFn: ({ objectId, objectType, labelId }: { objectId: string; objectType: string; labelId: string }) =>
//       deleteLabelConnectionByParams(objectId, objectType, labelId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["label-connections"] });
//     },
//   });
// }
