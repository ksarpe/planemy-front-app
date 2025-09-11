// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   shareObjectWithUserApi,
//   getPendingSharesApi,
//   acceptObjectInvitationApi,
//   rejectObjectInvitation,
// } from "@shared/api/permissions";
// import { useAuthContext } from "../context/useAuthContext";
// import type { ShareableObjectType, SharePermission } from "@shared/data/Utils/types";

// export const usePendingShares = (objectType: ShareableObjectType) => {
//   const { user } = useAuthContext();

//   return useQuery({
//     queryKey: ["pendingShares", objectType, user?.uid],
//     queryFn: () => getPendingSharesApi(objectType, user!.uid),
//   });
// };

// export const useShareObject = () => {
//   const { user } = useAuthContext();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       objectId,
//       objectType,
//       targetUserEmail,
//       permission,
//     }: {
//       objectId: string;
//       objectType: ShareableObjectType;
//       targetUserEmail: string;
//       permission: SharePermission;
//     }) => shareObjectWithUserApi(objectId, objectType, targetUserEmail, permission, user!.uid),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["sharedObjects"] });
//     },
//     onError: () => {
//       },
//   });
// };

// export const useAcceptShare = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (shareId: string) => acceptObjectInvitationApi(shareId),
//     onSuccess: () => {
//       // Invalidate pending shares to remove the accepted one from the list
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
