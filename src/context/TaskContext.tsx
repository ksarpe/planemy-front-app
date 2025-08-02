import { createContext, useEffect, useState, ReactNode, useMemo } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// Types
import type { TaskInterface, TaskListInterface, SharedTaskList, TaskContextProps } from "@/data/Tasks/interfaces";
import type { SharePermission } from "@/data/Utils/types";
import type { UserProfile } from "@/data/User/interfaces";
import type { LabelInterface } from "@/data/Utils/interfaces";

// Context hooks
import { useToastContext } from "@/hooks/context/useToastContext";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useLabelContext } from "@/hooks/context/useLabelContext";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";

// Task hooks (React Query)
import { useTaskLists, useCreateTaskList, useDeleteTaskList, useUpdateTaskList } from "@/hooks/tasks/useTasksLists";
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useToggleTaskCompletion,
  useMoveTask,
  useClearCompletedTasks,
  useUncheckAllTasks,
} from "@/hooks/tasks/useTasks";

// API functions
import { useUserPendingShares, searchUsersByEmail } from "@/api/tasks";
import {
  shareTaskListWithUser,
  acceptTaskListInvitation,
  rejectTaskListInvitation,
} from "@/api/permissions/taskPermissions";

// Firebase config
import { db } from "@/api/config";

const TaskContext = createContext<TaskContextProps | undefined>(undefined);
export { TaskContext };

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Context hooks
  const { showToast } = useToastContext();
  const { mainListId } = usePreferencesContext();
  const { labelConnectionsByType } = useLabelContext();
  const { user } = useAuthContext();

  // React Query hooks for task lists
  const { data: taskLists } = useTaskLists();
  const { mutate: createTaskListMutation } = useCreateTaskList();
  const { mutate: deleteTaskListMutation } = useDeleteTaskList();
  const { mutate: updateTaskListMutation } = useUpdateTaskList();

  // React Query hooks for task operations
  const { mutate: createTaskMutation } = useCreateTask();
  const { mutate: updateTaskMutation } = useUpdateTask();
  const { mutate: deleteTaskMutation } = useDeleteTask();
  const { mutate: toggleTaskCompletionMutation } = useToggleTaskCompletion();
  const { mutate: moveTaskMutation } = useMoveTask();
  const { mutate: clearCompletedTasksMutation } = useClearCompletedTasks();
  const { mutate: uncheckAllTasksMutation } = useUncheckAllTasks();

  // Sharing system
  const pendingSharesFromFirebase = useUserPendingShares();

  // Local state
  const [currentTaskListId, setCurrentTaskListId] = useState<string | null>(null);
  const [pendingShares, setPendingShares] = useState<SharedTaskList[]>([]);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);
  const [tasksCache, setTasksCache] = useState<Record<string, TaskInterface[]>>({});

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

  // Effect: Real-time tasks cache with labels
  useEffect(() => {
    if (!user || !taskLists || taskLists.length === 0) {
      setTasksCache({});
      return;
    }

    // Get task label connections
    const taskLabelConnections = labelConnectionsByType.get("task") || new Map<string, LabelInterface[]>();

    const unsubscribes: (() => void)[] = [];

    taskLists.forEach((taskList) => {
      const tasksCollection = collection(db, "tasks");
      const tasksQuery = query(tasksCollection, where("taskListId", "==", taskList.id));

      const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasks = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<TaskInterface, "id" | "labels">;
          const taskId = doc.data().id || doc.id;
          return {
            ...data,
            id: taskId,
            labels: taskLabelConnections.get(taskId) || [],
          };
        });

        setTasksCache((prev) => ({
          ...prev,
          [taskList.id]: tasks,
        }));
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [user, taskLists, labelConnectionsByType]);

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

  const addTask = (
    listId: string,
    title: string,
    description?: string | null,
    dueDate?: string | null,
  ): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby dodać zadanie");
      return Promise.reject(new Error("User not authenticated"));
    }

    return new Promise<void>((resolve, reject) => {
      createTaskMutation(
        { listId, title, description, dueDate },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        },
      );
    });
  };

  const updateTask = (taskId: string, updates: Partial<TaskInterface>): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      updateTaskMutation(
        { taskId, updates },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        },
      );
    });
  };

  const removeTask = (taskId: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      deleteTaskMutation(taskId, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  const toggleTaskComplete = (taskId: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      toggleTaskCompletionMutation(taskId, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

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

  const getTasksForList = useMemo(
    () =>
      (listId: string): TaskInterface[] => {
        return tasksCache[listId] || [];
      },
    [tasksCache],
  );

  const getTaskStats = useMemo(
    () => (listId: string) => {
      const tasks = getTasksForList(listId);
      const total = tasks.length;
      const completed = tasks.filter((task) => task.isCompleted).length;
      const pending = total - completed;

      return { total, completed, pending };
    },
    [getTasksForList],
  );

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
        tasksCache,
        addTask,
        updateTask,
        removeTask,
        toggleTaskComplete,
        moveTask,

        // ====== Utilities ======
        getTasksForList,
        getTaskStats,

        // ====== Legacy Support ======
        clickedTask,
        setClickedTask,
        convertToEvent,
      }}>
      {children}
    </TaskContext.Provider>
  );
};
