import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { TaskInterface } from "@/data/types";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import type { TaskContextProps } from "@/data/typesProps";
import { useUserTasks, addTask as addTaskToFirebase, removeTask as removeTaskFromFirebase, markTaskAsDoneOrUndone as markTaskAsDoneOrUndoneFirebase, updateTask as updateTaskFirebase } from "@/firebase/tasks";

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const initialTasks = useUserTasks();
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  const addTask = async (title: string, description?: string, dueDate?: string, priority?: 'low' | 'medium' | 'high') => {
    if (!user) {
      showToast("error", "Musisz być zalogowany, aby dodać zadanie");
      return;
    }

    try {
      await addTaskToFirebase(title, user.uid, description, dueDate, priority);
      showToast("success", "Zadanie zostało dodane pomyślnie!");
    } catch (error) {
      console.error("Error adding task:", error);
      showToast("error", "Błąd podczas dodawania zadania");
    }
  };
  const updateTask = async (title?: string, description?: string) => {
    await updateTaskFirebase(clickedTask!.id, title, description)
    showToast("success", "Task updated successfully!");
  };
  const removeTask = async () => {
    try {
      const tempId = clickedTask!.id;
      setClickedTask(null);
      await removeTaskFromFirebase(tempId);
      showToast("success", "Zadanie zostało usunięte pomyślnie!");
    } catch (error) {
      console.error("Error removing task:", error);
      showToast("error", "Błąd podczas usuwania zadania");
    }
  };

  const markTaskAsDoneOrUndone = async (id: string) => {
    try {
      const tempId = id;
      setClickedTask(null)
      await markTaskAsDoneOrUndoneFirebase(tempId);
      showToast("success", "Zadanie zostało zaktualizowane!");
    } catch (error) {
      showToast("error", "Błąd podczas aktualizacji zadania: " + (error instanceof Error ? error.message : "Nieznany błąd"));
    }
  };

  const convertToEvent = () => {
    if (!clickedTask) return;
    // Logic to convert task to event
    showToast("success", "Task converted to event.");
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        clickedTask,
        setClickedTask,
        addTask,
        updateTask,
        removeTask,
        markTaskAsDoneOrUndone,
        convertToEvent,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
