import { createContext, useEffect, useState, ReactNode, useMemo } from "react";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useTaskLists } from "@/hooks/tasks/useTasksLists";
import type { TaskInterface, TaskContextProps } from "@/data/Tasks/interfaces";

const TaskContext = createContext<TaskContextProps | undefined>(undefined);
export { TaskContext };

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Context hooks
  console.log("TaskProvider initialized");
  const { mainListId } = usePreferencesContext();
  const { data: taskLists } = useTaskLists();
  const [currentTaskListId, setCurrentTaskListId] = useState<string | null>(null);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

  const currentTaskList = useMemo(
    () => taskLists?.find((list) => list.id === currentTaskListId) || null,
    [taskLists, currentTaskListId],
  );

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

  return (
    <TaskContext.Provider
      value={{
        taskLists: taskLists || [],
        currentTaskList,
        currentTaskListId,
        setCurrentTaskListId,

        clickedTask,
        setClickedTask,
      }}>
      {children}
    </TaskContext.Provider>
  );
};
