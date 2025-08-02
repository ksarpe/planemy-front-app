import { createContext, useEffect, useState, ReactNode, useMemo } from "react";

// Types
import type { TaskInterface, TaskContextProps } from "@/data/Tasks/interfaces";

// Context hooks
import { useToastContext } from "@/hooks/context/useToastContext";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";

// Task hooks (React Query)
import { useTaskLists } from "@/hooks/tasks/useTasksLists";

const TaskContext = createContext<TaskContextProps | undefined>(undefined);
export { TaskContext };

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Context hooks
  const { showToast } = useToastContext();
  const { mainListId } = usePreferencesContext();

  // React Query hooks for task lists
  const { data: taskLists } = useTaskLists();

  // Local state
  const [currentTaskListId, setCurrentTaskListId] = useState<string | null>(null);
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

        // ====== Legacy Support ======
        clickedTask,
        setClickedTask,
        convertToEvent,
      }}>
      {children}
    </TaskContext.Provider>
  );
};
