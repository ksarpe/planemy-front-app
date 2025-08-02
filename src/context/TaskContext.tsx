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
import { useTaskLists, useCreateTaskList, useDeleteTaskList, useUpdateTaskList } from "@/hooks/tasks/useTasksLists";
import {
  useMoveTask,
  useClearCompletedTasks,
  useUncheckAllTasks,
} from "@/hooks/tasks/useTasks";

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
  const { mutate: createTaskListMutation } = useCreateTaskList();
  const { mutate: deleteTaskListMutation } = useDeleteTaskList();
  const { mutate: updateTaskListMutation } = useUpdateTaskList();


  const { mutate: moveTaskMutation } = useMoveTask();
  const { mutate: clearCompletedTasksMutation } = useClearCompletedTasks();
  const { mutate: uncheckAllTasksMutation } = useUncheckAllTasks();

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

  // ====== Task List Functions ======

  const createTaskList = (name: string): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby utworzyć listę zadań");
      return Promise.reject(new Error("User not authenticated"));
    }

    return new Promise<void>((resolve, reject) => {
      createTaskListMutation(name, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  const updateTaskList = (listId: string, updates: Partial<TaskListInterface>): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      updateTaskListMutation(
        { listId, updates },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        },
      );
    });
  };

  const deleteTaskList = (listId: string): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby usunąć listę zadań");
      return Promise.reject(new Error("User not authenticated"));
    }

    return new Promise<void>((resolve, reject) => {
      deleteTaskListMutation(listId, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  const renameTaskList = (listId: string, newName: string): Promise<void> => {
    return updateTaskList(listId, { name: newName });
  };

  const clearCompletedTasks = (listId: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      clearCompletedTasksMutation(listId, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  const uncheckAllTasks = (listId: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      uncheckAllTasksMutation(listId, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

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

  // TODO: Implement these functions with new permission system
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unshareTaskList = async (_listId: string, _userId: string): Promise<void> => {
    showToast("error", "Funkcja cofania udostępniania wymaga refaktoryzacji");
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

  // ====== Task Functions ======

  const moveTask = (taskId: string, _fromListId: string, toListId: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      moveTaskMutation(
        { taskId, toListId },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        },
      );
    });
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
        createTaskList,
        updateTaskList,
        deleteTaskList,
        renameTaskList,
        clearCompletedTasks,
        uncheckAllTasks,

        // ====== Sharing ======
        shareTaskList,
        unshareTaskList,
        acceptSharedList,
        rejectSharedList,
        updateSharePermission,
        searchUsers,
        getSharedLists,
        getPendingShares,

        // ====== Tasks ======
        moveTask,

        // ====== Legacy Support ======
        clickedTask,
        setClickedTask,
        convertToEvent,
      }}>
      {children}
    </TaskContext.Provider>
  );
};
