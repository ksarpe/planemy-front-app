import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shareObjectWithUserApi, getPendingSharesApi } from "@/api/permissions";
import { useAuthContext } from "../context/useAuthContext";
import { useToastContext } from "../context/useToastContext";
import type { ShareableObjectType, SharePermission } from "@/data/Utils/types";

export const usePendingShares = (objectType: ShareableObjectType) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["pendingShares", objectType, user?.uid],
    queryFn: () => getPendingSharesApi(objectType, user!.uid),
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


