import { createContext, useEffect, useState, ReactNode } from "react";
import type { TaskInterface, TaskListInterface, LabelInterface, SharedTaskList, SharePermission, UserProfile } from "@/data/types";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import type { TaskContextProps } from "@/data/typesProps";
import { 
  useUserTaskLists, 
  useUserLabels,
  useUserPendingShares,
  createTaskList as createTaskListFirebase,
  updateTaskList as updateTaskListFirebase,
  deleteTaskList as deleteTaskListFirebase,
  addTaskToList as addTaskToListFirebase,
  updateTaskInList as updateTaskInListFirebase,
  removeTaskFromList as removeTaskFromListFirebase,
  toggleTaskCompletion as toggleTaskCompletionFirebase,
  createLabel as createLabelFirebase,
  updateLabel as updateLabelFirebase,
  deleteLabel as deleteLabelFirebase,
  shareTaskListWithUser,
  removeUserFromSharedList,
  acceptSharedTaskList,
  rejectSharedTaskList,
  updateUserPermission,
  searchUsersByEmail
} from "@/firebase/tasks";

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export { TaskContext };

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();
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

  // Update local state when Firebase data changes
  useEffect(() => {
    setTaskLists(taskListsFromFirebase);
  }, [taskListsFromFirebase]);

  // Set first list as current if none selected and lists exist
  useEffect(() => {
    if (taskListsFromFirebase.length > 0 && !currentTaskList) {
      setCurrentTaskList(taskListsFromFirebase[0]);
    }
  }, [taskListsFromFirebase, currentTaskList]);

  // Update current task list when task lists change (to reflect real-time updates)
  useEffect(() => {
    if (currentTaskList && taskLists.length > 0) {
      const updatedList = taskLists.find(list => list.id === currentTaskList.id);
      if (updatedList && JSON.stringify(updatedList.tasks) !== JSON.stringify(currentTaskList.tasks)) {
        setCurrentTaskList(updatedList);
      }
    }
  }, [taskLists, currentTaskList]);

  useEffect(() => {
    setLabels(labelsFromFirebase);
  }, [labelsFromFirebase]);

  useEffect(() => {
    setPendingShares(pendingSharesFromFirebase);
  }, [pendingSharesFromFirebase]);

  // Update clickedTask when taskLists change (to reflect real-time updates)
  useEffect(() => {
    if (clickedTask && currentTaskList) {
      const updatedList = taskLists.find(list => list.id === currentTaskList.id);
      if (updatedList) {
        const updatedTask = updatedList.tasks.find(task => task.id === clickedTask.id);
        if (updatedTask && JSON.stringify(updatedTask) !== JSON.stringify(clickedTask)) {
          setClickedTask(updatedTask);
        }
      }
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

  const unshareTaskList = async (listId: string, userId: string): Promise<void> => {
    try {
      setLoading(true);
      await removeUserFromSharedList(listId, userId);
      showToast("success", "Udostępnianie zostało cofnięte!");
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
      await acceptSharedTaskList(shareId);
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
      await rejectSharedTaskList(shareId);
      showToast("success", "Lista została odrzucona!");
    } catch (error) {
      console.error("Error rejecting shared list:", error);
      showToast("error", "Błąd podczas odrzucania listy");
    } finally {
      setLoading(false);
    }
  };

  const updateSharePermission = async (listId: string, userId: string, permission: SharePermission): Promise<void> => {
    try {
      setLoading(true);
      await updateUserPermission(listId, userId, permission);
      showToast("success", "Uprawnienia zostały zaktualizowane!");
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
    return taskLists.filter(list => list.isShared);
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
    labels?: LabelInterface[]
  ): Promise<void> => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby dodać zadanie");
      return;
    }

    try {
      setLoading(true);
      await addTaskToListFirebase(listId, title, user.uid, description, dueDate, labels);
      showToast("success", "Zadanie zostało dodane!");
    } catch (error) {
      console.error("Error adding task:", error);
      showToast("error", "Błąd podczas dodawania zadania");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (listId: string, taskId: string, updates: Partial<TaskInterface>): Promise<void> => {
    try {
      setLoading(true);
      await updateTaskInListFirebase(listId, taskId, updates);
      showToast("success", "Zadanie zostało zaktualizowane!");
    } catch (error) {
      console.error("Error updating task:", error);
      showToast("error", "Błąd podczas aktualizacji zadania");
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (listId: string, taskId: string): Promise<void> => {
    try {
      setLoading(true);
      await removeTaskFromListFirebase(listId, taskId);
      showToast("success", "Zadanie zostało usunięte!");
    } catch (error) {
      console.error("Error removing task:", error);
      showToast("error", "Błąd podczas usuwania zadania");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (listId: string, taskId: string): Promise<void> => {
    try {
      await toggleTaskCompletionFirebase(listId, taskId);
      showToast("success", "Status zadania został zmieniony!");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      showToast("error", "Błąd podczas zmiany statusu zadania");
    }
  };

  const moveTask = async (taskId: string, fromListId: string, toListId: string): Promise<void> => {
    try {
      setLoading(true);
      // Find the task in the source list
      const sourceList = taskLists.find(list => list.id === fromListId);
      const task = sourceList?.tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error("Task not found");
      }

      // Remove from source list
      await removeTaskFromListFirebase(fromListId, taskId);
      
      // Add to destination list
      await addTaskToListFirebase(toListId, task.title, user!.uid, task.description, task.dueDate, task.labels);
      
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

  const addLabelToTask = async (listId: string, taskId: string, label: LabelInterface): Promise<void> => {
    try {
      const list = taskLists.find(l => l.id === listId);
      const task = list?.tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedLabels = [...(task.labels || []), label];
      await updateTaskInListFirebase(listId, taskId, { labels: updatedLabels });
      showToast("success", "Etykieta została dodana do zadania!");
    } catch (error) {
      console.error("Error adding label to task:", error);
      showToast("error", "Błąd podczas dodawania etykiety");
    }
  };

  const removeLabelFromTask = async (listId: string, taskId: string, labelId: string): Promise<void> => {
    try {
      const list = taskLists.find(l => l.id === listId);
      const task = list?.tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedLabels = (task.labels || []).filter(l => l.id !== labelId);
      await updateTaskInListFirebase(listId, taskId, { labels: updatedLabels });
      showToast("success", "Etykieta została usunięta z zadania!");
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
      const list = taskLists.find(l => l.id === listId);
      if (!list) return;

      const completedTasks = list.tasks.filter(task => task.isCompleted);
      
      // Remove all completed tasks
      for (const task of completedTasks) {
        await removeTask(listId, task.id);
      }
      
      showToast("success", `Usunięto ${completedTasks.length} ukończonych zadań!`);
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
      const list = taskLists.find(l => l.id === listId);
      if (!list) return;

      const completedTasks = list.tasks.filter(task => task.isCompleted);
      
      // Uncheck all completed tasks
      for (const task of completedTasks) {
        await toggleTaskComplete(listId, task.id);
      }
      
      showToast("success", `Odznaczono ${completedTasks.length} zadań!`);
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
        
        // Legacy support
        clickedTask,
        setClickedTask,
        convertToEvent,
      }}>
      {children}
    </TaskContext.Provider>
  );
};
