import { createContext, useEffect, useState, ReactNode, useMemo } from "react";

// Types
import type { TaskInterface, TaskListInterface, SharedTaskList, TaskContextProps } from "@/data/Tasks/interfaces";
import type { SharePermission } from "@/data/Utils/types";
import type { UserProfile } from "@/data/User/interfaces";

// Context hooks
import { useToastContext } from "@/hooks/context/useToastContext";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";

// Task hooks (React Query)
import { useTaskLists } from "@/hooks/tasks/useTasksLists";

// API functions
import { useUserPendingShares, searchUsersByEmail } from "@/api/tasks_lists";
import {
  shareTaskListWithUser,
  acceptTaskListInvitation,
  rejectTaskListInvitation,
} from "@/api/permissions/taskPermissions";

const TaskContext = createContext<TaskContextProps | undefined>(undefined);
export { TaskContext };

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Context hooks
  const { showToast } = useToastContext();
  const { mainListId } = usePreferencesContext();
  const { user } = useAuthContext();

  // React Query hooks for task lists
  const { data: taskLists } = useTaskLists();

  // Sharing system
  const pendingSharesFromFirebase = useUserPendingShares();

  // Local state
  const [currentTaskListId, setCurrentTaskListId] = useState<string | null>(null);
  const [pendingShares, setPendingShares] = useState<SharedTaskList[]>([]);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

  // Computed state
  const currentTaskList = useMemo(
    () => taskLists?.find((list) => list.id === currentTaskListId) || null,
    [taskLists, currentTaskListId],
  );

  // Effects

  // Effect: Update current task list selection
  useEffect(() => {
    if (!taskLists || taskLists.length === 0) {
      setCurrentTaskListId(null);
      return;
    }

    const idExists = currentTaskListId && taskLists.some((list) => list.id === currentTaskListId);

    // If selected ID doesn't exist in new list, select new default ID
    if (!idExists) {
      const defaultList = taskLists.find((list) => list.id === mainListId) || taskLists[0];
      setCurrentTaskListId(defaultList.id);
    }
  }, [taskLists, mainListId, currentTaskListId]);

  // Effect: Sync pending shares
  useEffect(() => {
    setPendingShares(pendingSharesFromFirebase);
  }, [pendingSharesFromFirebase]);
 
  // ====== Sharing Functions ======

  const shareTaskList = async (listId: string, userEmail: string, permission: SharePermission): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby udostępnić listę");
      return;
    }

    try {
      await shareTaskListWithUser(listId, userEmail, permission, user.uid);
      showToast("success", "Lista została udostępniona!");
    } catch (error) {
      console.error("Error sharing task list:", error);
      showToast("error", "Błąd podczas udostępniania listy");
    }
  };

  const acceptSharedList = async (shareId: string): Promise<void> => {
    try {
      await acceptTaskListInvitation(shareId);
      showToast("success", "Lista została zaakceptowana!");
    } catch (error) {
      console.error("Error accepting shared list:", error);
      showToast("error", "Błąd podczas akceptowania listy");
    }
  };

  const rejectSharedList = async (shareId: string): Promise<void> => {
    try {
      await rejectTaskListInvitation(shareId);
      showToast("success", "Lista została odrzucona!");
    } catch (error) {
      console.error("Error rejecting shared list:", error);
      showToast("error", "Błąd podczas odrzucania listy");
    }
  };

  const searchUsers = async (email: string): Promise<UserProfile[]> => {
    try {
      return await searchUsersByEmail(email);
    } catch (error) {
      console.error("Error searching users:", error);
      showToast("error", "Błąd podczas wyszukiwania użytkowników");
      return [];
    }
  };

  const getSharedLists = (): TaskListInterface[] => {
    // TODO: Implement with new permission system
    return [];
  };

  const getPendingShares = (): SharedTaskList[] => {
    return pendingShares;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateSharePermission = async (
    _listId: string,
    _userId: string,
    _permission: SharePermission,
  ): Promise<void> => {
    console.log(_listId, _userId, _permission);
    showToast("error", "Funkcja aktualizacji uprawnień wymaga refaktoryzacji");
  };

  // ====== Legacy Support ======

  const convertToEvent = () => {
    if (!clickedTask) return;
    showToast("success", "Funkcja konwersji do eventu zostanie dodana wkrótce.");
  };

  // ====== Utility Functions ======

  return (
    <TaskContext.Provider
      value={{
        // ====== Task Lists ======
        taskLists: taskLists || [],
        currentTaskList,
        currentTaskListId,
        setCurrentTaskListId,

        // ====== Sharing ======
        shareTaskList,
        acceptSharedList,
        rejectSharedList,
        updateSharePermission,
        searchUsers,
        getSharedLists,
        getPendingShares,

        // ====== Legacy Support ======
        clickedTask,
        setClickedTask,
        convertToEvent,
      }}>
      {children}
    </TaskContext.Provider>
  );
};
