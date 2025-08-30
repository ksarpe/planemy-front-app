import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  shareObjectWithUserApi,
  getPendingSharesApi,
  acceptObjectInvitationApi,
  rejectObjectInvitation,
} from "@/api/permissions";
import { useAuthContext } from "../context/useAuthContext";
import { useToastContext } from "../context/useToastContext";
import type { ShareableObjectType, SharePermission } from "@/data/Utils/types";

export const usePendingShares = (objectType: ShareableObjectType) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["pendingShares", objectType, user?.uid],
    queryFn: () => {
      console.log("usePendingShares: Fetching pending shares for", objectType, "user:", user?.uid);
      return getPendingSharesApi(objectType, user!.uid);
    },
    enabled: !!user?.uid,
  });
};

export const useShareObject = () => {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const queryClient = useQueryClient();

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
    }) => shareObjectWithUserApi(objectId, objectType, targetUserEmail, permission, user!.uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sharedObjects"] });
    },
    onError: () => {
      showToast("error", "Błąd podczas udostępniania. Spróbuj ponownie.");
    },
  });
};

export const useAcceptShare = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (shareId: string) => acceptObjectInvitationApi(shareId),
    onSuccess: () => {
      // Invalidate pending shares to remove the accepted one from the list
      console.log("useAcceptShare: Invalidating pending shares and task lists");
      queryClient.invalidateQueries({ queryKey: ["pendingShares"] });
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      showToast("success", "Udostępnienie zaakceptowane.");
    },
    onError: (error) => {
      console.error("Error accepting share:", error);
      showToast("error", "Błąd podczas akceptowania zaproszenia. Spróbuj ponownie.");
    },
  });
};

export const useRejectShare = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (shareId: string) => rejectObjectInvitation(shareId),
    onSuccess: () => {
      // Invalidate pending shares to remove the rejected one from the list
      console.log("useRejectShare: Invalidating pending shares");
      queryClient.invalidateQueries({ queryKey: ["pendingShares"] });
      showToast("success", "Udostępnienie odrzucone.");
    },
    onError: (error) => {
      console.error("Error rejecting share:", error);
      showToast("error", "Błąd podczas odrzucania zaproszenia. Spróbuj ponownie.");
    },
  });
};

// export const useRejectShare = () => {
//   const queryClient = useQueryClient();
//   const { showToast } = useToastContext();

//   return useMutation({
//     mutationFn: (shareId: string) => rejectObjectInvitationApi(shareId),
//     onSuccess: () => {
//       // Invalidate pending shares to remove the rejected one from the list
//       queryClient.invalidateQueries({ queryKey: ["pendingShares"] });
//       showToast("success", "Udostępnienie odrzucone.");
//     },
//     onError: (error) => {
//       console.error("Error rejecting share:", error);
//       showToast("error", "Błąd podczas odrzucania zaproszenia. Spróbuj ponownie.");
//     },
//   });
// };
