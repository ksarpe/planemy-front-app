import { createContext, useEffect, useState, ReactNode, useMemo } from "react";
import type { TaskInterface, TaskListInterface, SharedTaskList, TaskContextProps } from "@/data/Tasks/interfaces";
import type { LabelInterface } from "@/data/Utils/interfaces";
import type { SharePermission } from "@/data/Utils/types";
import type { UserProfile } from "@/data/User/interfaces";

import { useToast } from "@/hooks/useToastContext";
import { useAuth } from "@/hooks/useAuthContext";
import { useUserLabels } from "@/api/labels";
import {
  useUserTaskLists,
  useUserPendingShares,
  createTaskList as createTaskListFirebase,
  updateTaskList as updateTaskListFirebase,
  deleteTaskList as deleteTaskListFirebase,
  addTaskToList as addTaskToListFirebase,
  updateTaskInList as updateTaskInListFirebase,
  removeTaskFromList as removeTaskFromListFirebase,
  toggleTaskCompletion as toggleTaskCompletionFirebase,
  searchUsersByEmail,
  clearCompletedTasks as clearCompletedTasksFirebase,
  uncheckAllTasks as uncheckAllTasksFirebase,
} from "@/api/tasks";
import {
  createLabel as createLabelFirebase,
  updateLabel as updateLabelFirebase,
  deleteLabel as deleteLabelFirebase,
} from "@/api/labels";
import {
  shareTaskListWithUser,
  acceptTaskListInvitation,
  rejectTaskListInvitation,
} from "@/api/permissions/taskPermissions";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/api/config";
import { usePreferencesContext } from "@/hooks/usePreferencesContext";
const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export { TaskContext };

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();
  const { mainListId } = usePreferencesContext();
  const { user } = useAuth();

  // New task list system
  const taskListsFromFirebase = useUserTaskLists();
  const labelsFromFirebase = useUserLabels();
  const pendingSharesFromFirebase = useUserPendingShares();

  // State
  const [taskLists, setTaskLists] = useState<TaskListInterface[]>([]);
  const [currentTaskList, setCurrentTaskList] = useState<TaskListInterface | null>(null);
  const [labels, setLabels] = useState<LabelInterface[]>([]);
  const [pendingShares, setPendingShares] = useState<SharedTaskList[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<LabelInterface[]>([]);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

  // Tasks cache - zadania pogrupowane według listId
  const [tasksCache, setTasksCache] = useState<Record<string, TaskInterface[]>>({});

  useEffect(() => {
    if (taskListsFromFirebase.length === 0) return;
    setTaskLists(taskListsFromFirebase);

    if (!currentTaskList) {
      // Brak wybranej listy – ustaw pierwszą
      setCurrentTaskList(
        mainListId
          ? taskListsFromFirebase.find((list) => list.id === mainListId) || taskListsFromFirebase[0]
          : taskListsFromFirebase[0],
      );
      return;
    }

    // Znajdź aktualną wersję wybranej listy (np. po edycji nazwy)
    const updatedList = taskListsFromFirebase.find((list) => list.id === currentTaskList.id);
    if (updatedList) {
      setCurrentTaskList(updatedList);
    }
  }, [taskListsFromFirebase, setCurrentTaskList, currentTaskList, mainListId]);

  useEffect(() => {
    setLabels(labelsFromFirebase);
  }, [labelsFromFirebase]);

  useEffect(() => {
    setPendingShares(pendingSharesFromFirebase);
  }, [pendingSharesFromFirebase]);

  // Listen to tasks for all user's task lists
  useEffect(() => {
    if (!user || taskLists.length === 0) {
      setTasksCache({});
      return;
    }

    const unsubscribes: (() => void)[] = [];

    taskLists.forEach((taskList) => {
      const tasksCollection = collection(db, "tasks");
      const tasksQuery = query(tasksCollection, where("taskListId", "==", taskList.id));

      const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TaskInterface[];

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
  }, [user, taskLists]);

  // Update clickedTask when taskLists change (to reflect real-time updates)
  useEffect(() => {
    if (clickedTask && currentTaskList) {
      // Note: Tasks are now fetched separately via useTasksForList hook
      // The clickedTask state will be managed differently or removed
      // For now, we'll keep the existing task object without updating from embedded tasks array
    }
  }, [taskLists, clickedTask, currentTaskList]);

  // Task List Functions
  const createTaskList = async (name: string): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby utworzyć listę zadań");
      return;
    }

    try {
      setLoading(true);
      await createTaskListFirebase(name, user.uid);
      showToast("success", "Lista zadań została utworzona!");
    } catch (error) {
      console.error("Error creating task list:", error);
      showToast("error", "Błąd podczas tworzenia listy zadań");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskList = async (listId: string, updates: Partial<TaskListInterface>): Promise<void> => {
    try {
      setLoading(true);
      await updateTaskListFirebase(listId, updates);
      showToast("success", "Lista zadań została zaktualizowana!");
    } catch (error) {
      console.error("Error updating task list:", error);
      showToast("error", "Błąd podczas aktualizacji listy zadań");
    } finally {
      setLoading(false);
    }
  };

  const deleteTaskList = async (listId: string): Promise<void> => {
    try {
      setLoading(true);
      await deleteTaskListFirebase(listId);
      showToast("success", "Lista zadań została usunięta!");
      // Reset current list if it was deleted
      if (currentTaskList?.id === listId) {
        setCurrentTaskList(null);
      }
    } catch (error) {
      console.error("Error deleting task list:", error);
      showToast("error", "Błąd podczas usuwania listy zadań");
    } finally {
      setLoading(false);
    }
  };

  const shareTaskList = async (listId: string, userEmail: string, permission: SharePermission): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby udostępnić listę");
      return;
    }

    try {
      setLoading(true);
      await shareTaskListWithUser(listId, userEmail, permission, user.uid);
      showToast("success", "Lista została udostępniona!");
    } catch (error) {
      console.error("Error sharing task list:", error);
      showToast("error", "Błąd podczas udostępniania listy");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unshareTaskList = async (_listId: string, _userId: string): Promise<void> => {
    try {
      setLoading(true);
      // We need to find the permission ID for this user and list
      // This should be implemented to get the permission ID first
      // For now, this function needs to be refactored to work with the new system
      showToast("error", "Funkcja cofania udostępniania wymaga refaktoryzacji");
    } catch (error) {
      console.error("Error unsharing task list:", error);
      showToast("error", "Błąd podczas cofania udostępniania");
    } finally {
      setLoading(false);
    }
  };

  const acceptSharedList = async (shareId: string): Promise<void> => {
    try {
      setLoading(true);
      await acceptTaskListInvitation(shareId);
      showToast("success", "Lista została zaakceptowana!");
    } catch (error) {
      console.error("Error accepting shared list:", error);
      showToast("error", "Błąd podczas akceptowania listy");
    } finally {
      setLoading(false);
    }
  };

  const rejectSharedList = async (shareId: string): Promise<void> => {
    try {
      setLoading(true);
      await rejectTaskListInvitation(shareId);
      showToast("success", "Lista została odrzucona!");
    } catch (error) {
      console.error("Error rejecting shared list:", error);
      showToast("error", "Błąd podczas odrzucania listy");
    } finally {
      setLoading(false);
    }
  };

  const updateSharePermission = async (
    _listId: string,
    _userId: string,
    _permission: SharePermission,
  ): Promise<void> => {
    try {
      setLoading(true);
      console.log(_listId, _userId, _permission);
      // We need to find the permission ID for this user and list first
      // This should be implemented to get the permission ID first
      // For now, this function needs to be refactored to work with the new system
      showToast("error", "Funkcja aktualizacji uprawnień wymaga refaktoryzacji");
    } catch (error) {
      console.error("Error updating permissions:", error);
      showToast("error", "Błąd podczas aktualizacji uprawnień");
    } finally {
      setLoading(false);
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
    // With the new permission system, we need to determine which lists are shared
    // This should be implemented to check permissions or maybe we need to add
    // a flag to indicate shared lists. For now, return empty array.
    return [];
  };

  const getPendingShares = (): SharedTaskList[] => {
    return pendingShares;
  };

  // Task Functions
  const addTask = async (
    listId: string,
    title: string,
    description?: string | null,
    dueDate?: string | null,
  ): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby dodać zadanie");
      return;
    }

    try {
      setLoading(true);
      await addTaskToListFirebase(listId, title, user.uid, description, dueDate);
      showToast("success", "Zadanie zostało dodane!");
    } catch (error) {
      console.error("Error adding task:", error);
      showToast("error", "Błąd podczas dodawania zadania");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (_listId: string, taskId: string, updates: Partial<TaskInterface>): Promise<void> => {
    try {
      setLoading(true);
      await updateTaskInListFirebase(taskId, updates);
      showToast("success", "Zadanie zostało zaktualizowane!");
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("error", "Błąd podczas aktualizacji zadania");
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (_listId: string, taskId: string): Promise<void> => {
    try {
      setLoading(true);
      await removeTaskFromListFirebase(taskId);
      showToast("success", "Zadanie zostało usunięte!");
    } catch (error) {
      console.error("Error removing task:", error);
      showToast("error", "Błąd podczas usuwania zadania");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (_listId: string, taskId: string): Promise<void> => {
    try {
      await toggleTaskCompletionFirebase(taskId);
      showToast("success", "Status zadania został zmieniony!");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      showToast("error", "Błąd podczas zmiany statusu zadania");
    }
  };

  const moveTask = async (taskId: string, _fromListId: string, toListId: string): Promise<void> => {
    try {
      setLoading(true);

      // For now, we'll update the taskListId directly instead of recreating the task
      // This is more efficient than remove + add
      await updateTaskInListFirebase(taskId, { taskListId: toListId });

      showToast("success", "Zadanie zostało przeniesione!");
    } catch (error) {
      console.error("Error moving task:", error);
      showToast("error", "Błąd podczas przenoszenia zadania");
    } finally {
      setLoading(false);
    }
  };

  // Label Functions
  const createLabel = async (name: string, color: string, description?: string): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby utworzyć etykietę");
      return;
    }

    try {
      setLoading(true);
      await createLabelFirebase(name, color, user.uid, description);
      showToast("success", "Etykieta została utworzona!");
    } catch (error) {
      console.error("Error creating label:", error);
      showToast("error", "Błąd podczas tworzenia etykiety");
    } finally {
      setLoading(false);
    }
  };

  const updateLabel = async (labelId: string, updates: Partial<LabelInterface>): Promise<void> => {
    try {
      setLoading(true);
      await updateLabelFirebase(labelId, updates);
      showToast("success", "Etykieta została zaktualizowana!");
    } catch (error) {
      console.error("Error updating label:", error);
      showToast("error", "Błąd podczas aktualizacji etykiety");
    } finally {
      setLoading(false);
    }
  };

  const deleteLabel = async (labelId: string): Promise<void> => {
    try {
      setLoading(true);
      await deleteLabelFirebase(labelId);
      showToast("success", "Etykieta została usunięta!");
    } catch (error) {
      console.error("Error deleting label:", error);
      showToast("error", "Błąd podczas usuwania etykiety");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addLabelToTask = async (_listId: string, _taskId: string, _label: LabelInterface): Promise<void> => {
    try {
      // Temporary implementation - we'll need to create a getTaskById function later
      // For now, we'll show a message that this feature needs to be implemented
      showToast("warning", "Funkcja dodawania etykiet zostanie zaimplementowana wkrótce");
    } catch (error) {
      console.error("Error adding label to task:", error);
      showToast("error", "Błąd podczas dodawania etykiety");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeLabelFromTask = async (_listId: string, _taskId: string, _labelId: string): Promise<void> => {
    try {
      // Temporary implementation - we'll need to create a getTaskById function later
      showToast("warning", "Funkcja usuwania etykiet zostanie zaimplementowana wkrótce");
    } catch (error) {
      console.error("Error removing label from task:", error);
      showToast("error", "Błąd podczas usuwania etykiety");
    }
  };

  // List management functions
  const renameTaskList = async (listId: string, newName: string): Promise<void> => {
    try {
      await updateTaskList(listId, { name: newName });
      showToast("success", "Nazwa listy została zmieniona!");
    } catch (error) {
      console.error("Error renaming task list:", error);
      showToast("error", "Błąd podczas zmiany nazwy listy");
    }
  };

  const clearCompletedTasks = async (listId: string): Promise<void> => {
    try {
      setLoading(true);
      await clearCompletedTasksFirebase(listId);
      showToast("success", "Usunięto wszystkie ukończone zadania!");
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
      showToast("error", "Błąd podczas usuwania ukończonych zadań");
    } finally {
      setLoading(false);
    }
  };

  const uncheckAllTasks = async (listId: string): Promise<void> => {
    try {
      setLoading(true);
      await uncheckAllTasksFirebase(listId);
      showToast("success", "Odznaczono wszystkie zadania!");
    } catch (error) {
      console.error("Error unchecking tasks:", error);
      showToast("error", "Błąd podczas odznaczania zadań");
    } finally {
      setLoading(false);
    }
  };

  // Legacy support
  const convertToEvent = () => {
    if (!clickedTask) return;
    showToast("success", "Funkcja konwersji do eventu zostanie dodana wkrótce.");
  };

  // Task utilities
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
        // Task Lists
        taskLists,
        currentTaskList,
        setCurrentTaskList,
        createTaskList,
        updateTaskList,
        deleteTaskList,
        renameTaskList,
        clearCompletedTasks,
        uncheckAllTasks,

        // Sharing functionality
        shareTaskList,
        unshareTaskList,
        acceptSharedList,
        rejectSharedList,
        updateSharePermission,
        searchUsers,
        getSharedLists,
        getPendingShares,

        // Tasks
        tasksCache,
        setTasksCache,
        addTask,
        updateTask,
        removeTask,
        toggleTaskComplete,
        moveTask,

        // Labels
        labels,
        createLabel,
        updateLabel,
        deleteLabel,
        addLabelToTask,
        removeLabelFromTask,

        // UI State
        loading,
        searchQuery,
        setSearchQuery,
        selectedLabels,
        setSelectedLabels,

        // Task utilities
        getTasksForList,
        getTaskStats,

        // Legacy support
        clickedTask,
        setClickedTask,
        convertToEvent,
      }}>
      {children}
    </TaskContext.Provider>
  );
};
