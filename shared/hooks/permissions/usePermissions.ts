import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import {
  addPermission,
  updatePermission,
  deletePermission,
  getPermissions,
  getPermission,
  getPermissionsForObject,
  addShareNotification,
  updateShareNotification,
  deleteShareNotification,
  getShareNotifications,
  getPendingShareNotifications,
  shareObject,
  acceptShareInvitation,
  rejectShareInvitation,
} from "../../api/permissions";

import type { Permission, ShareNotification } from "../../data/Utils/interfaces";
import type { SharePermission, ShareableObjectType } from "../../data/Utils/types";

// Permission hooks
export function usePermissions() {
  return useQuery<Permission[], unknown, Permission[], string[]>({
    queryKey: ["permissions"],
    queryFn: getPermissions,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePermission(permissionId: string) {
  return useQuery<Permission | undefined, unknown, Permission | undefined, (string | undefined)[]>({
    queryKey: ["permissions", permissionId],
    queryFn: () => getPermission(permissionId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!permissionId,
  });
}

export function usePermissionsForObject(objectId: string, objectType: ShareableObjectType) {
  return useQuery<Permission[], unknown, Permission[], (string | undefined)[]>({
    queryKey: ["permissions", objectId, objectType],
    queryFn: () => getPermissionsForObject(objectId, objectType),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!(objectId && objectType),
  });
}

export function useCreatePermission() {
  return useMutation({
    mutationFn: (permissionData: Partial<Permission>) => addPermission(permissionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}

export function useUpdatePermission() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Permission> }) => updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeletePermission() {
  return useMutation({
    mutationFn: (permissionId: string) => deletePermission(permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}

// Share Notification hooks
export function useShareNotifications() {
  return useQuery<ShareNotification[], unknown, ShareNotification[], string[]>({
    queryKey: ["share-notifications"],
    queryFn: getShareNotifications,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePendingShareNotifications() {
  return useQuery<ShareNotification[], unknown, ShareNotification[], string[]>({
    queryKey: ["share-notifications", "pending"],
    queryFn: getPendingShareNotifications,
    staleTime: 1 * 60 * 1000, // Shorter cache for pending notifications
    refetchOnWindowFocus: true,
  });
}

export function useCreateShareNotification() {
  return useMutation({
    mutationFn: (notificationData: Partial<ShareNotification>) => addShareNotification(notificationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["share-notifications"] });
    },
  });
}

export function useUpdateShareNotification() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShareNotification> }) => updateShareNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["share-notifications"] });
    },
    onError: (error: unknown) => {
      return error;
    },
  });
}

export function useDeleteShareNotification() {
  return useMutation({
    mutationFn: (notificationId: string) => deleteShareNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["share-notifications"] });
    },
  });
}

// Convenience hooks for sharing operations
export function useShareObject() {
  return useMutation({
    mutationFn: ({
      objectId,
      objectType,
      targetUserEmail,
      permission,
    }: {
      objectId: string;
      objectType: ShareableObjectType;
      targetUserEmail: string;
      permission: SharePermission;
    }) => shareObject(objectId, objectType, targetUserEmail, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["share-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
}

export function useAcceptShareInvitation() {
  return useMutation({
    mutationFn: (notificationId: string) => acceptShareInvitation(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["share-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      // Invalidate related object queries
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useRejectShareInvitation() {
  return useMutation({
    mutationFn: (notificationId: string) => rejectShareInvitation(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["share-notifications"] });
    },
  });
}
//       queryClient.invalidateQueries({ queryKey: ["pendingShares"] });
//     },
//     onError: (error) => {
//       console.error("Error accepting share:", error);
//     },
//   });
// };

// export const useRejectShare = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (shareId: string) => rejectObjectInvitation(shareId),
//     onSuccess: () => {
//       // Invalidate pending shares to remove the rejected one from the list
//       queryClient.invalidateQueries({ queryKey: ["pendingShares"] });
//     },
//     onError: (error) => {
//       console.error("Error rejecting share:", error);
//     },
//   });
// };
