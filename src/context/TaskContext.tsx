import { createContext, useEffect, useState, ReactNode } from "react";
import type { TaskInterface, TaskListInterface, LabelInterface } from "@/data/types";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import type { TaskContextProps } from "@/data/typesProps";
import { 
  useUserTaskLists, 
  useUserLabels,
  createTaskList as createTaskListFirebase,
  updateTaskList as updateTaskListFirebase,
  deleteTaskList as deleteTaskListFirebase,
  addTaskToList as addTaskToListFirebase,
  updateTaskInList as updateTaskInListFirebase,
  removeTaskFromList as removeTaskFromListFirebase,
  toggleTaskCompletion as toggleTaskCompletionFirebase,
  createLabel as createLabelFirebase,
  updateLabel as updateLabelFirebase,
  deleteLabel as deleteLabelFirebase
} from "@/firebase/tasks";

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export { TaskContext };

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // New task list system
  const taskListsFromFirebase = useUserTaskLists();
  const labelsFromFirebase = useUserLabels();
  
  // State
  const [taskLists, setTaskLists] = useState<TaskListInterface[]>([]);
  const [currentTaskList, setCurrentTaskList] = useState<TaskListInterface | null>(null);
  const [labels, setLabels] = useState<LabelInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<LabelInterface[]>([]);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

  // Update local state when Firebase data changes
  useEffect(() => {
    setTaskLists(taskListsFromFirebase);
    // Set first list as current if none selected and lists exist
    if (taskListsFromFirebase.length > 0 && !currentTaskList) {
      setCurrentTaskList(taskListsFromFirebase[0]);
    }
  }, [taskListsFromFirebase, currentTaskList]);

  useEffect(() => {
    setLabels(labelsFromFirebase);
  }, [labelsFromFirebase]);

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

  const shareTaskList = async (listId: string, userIds: string[]): Promise<void> => {
    try {
      setLoading(true);
      await updateTaskListFirebase(listId, { sharedWith: userIds });
      showToast("success", "Lista została udostępniona!");
    } catch (error) {
      console.error("Error sharing task list:", error);
      showToast("error", "Błąd podczas udostępniania listy");
    } finally {
      setLoading(false);
    }
  };

  // Task Functions
  const addTask = async (
    listId: string, 
    title: string, 
    description?: string, 
    dueDate?: string, 
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
        shareTaskList,
        
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
