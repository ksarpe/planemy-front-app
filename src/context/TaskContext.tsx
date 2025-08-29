import { createContext, useEffect, useState, ReactNode, useMemo, useRef } from "react";
import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useTaskLists } from "@/hooks/tasks/useTasksLists";
import type { TaskInterface, TaskContextProps } from "@/data/Tasks/interfaces";

const TaskContext = createContext<TaskContextProps | undefined>(undefined);
export { TaskContext };

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Context hooks
  const { mainListId } = usePreferencesContext();
  const { data: taskLists } = useTaskLists();
  const [currentTaskListId, setCurrentTaskListId] = useState<string | null>(null);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  if (import.meta.env.DEV) {
    console.log("[TaskContext] render #", renderCountRef.current, {
      mainListId,
      currentTaskListId,
      taskListsLen: taskLists?.length ?? 0,
    });
  }

  const currentTaskList = useMemo(() => {
    const found = taskLists?.find((list) => list.id === currentTaskListId) || null;
    if (import.meta.env.DEV) {
      console.log("[TaskContext] useMemo currentTaskList", {
        currentTaskListId,
        resolved: found?.id,
      });
    }
    return found;
  }, [taskLists, currentTaskListId]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[TaskContext] effect:start", {
        taskListsLen: taskLists?.length ?? 0,
        mainListId,
        currentTaskListId,
      });
    }

    if (!taskLists || taskLists.length === 0) {
      if (import.meta.env.DEV && currentTaskListId !== null) {
        console.log("[TaskContext] effect: clearing currentTaskListId because no lists");
      }
      setCurrentTaskListId(null);
      return;
    }

    const idExists = Boolean(currentTaskListId && taskLists.some((list) => list.id === currentTaskListId));

    if (!idExists) {
      const defaultList = taskLists.find((list) => list.id === mainListId) || taskLists[0];
      if (import.meta.env.DEV) {
        console.log("[TaskContext] effect: selecting default list", {
          chosen: defaultList.id,
          mainListId,
          wasDefault: Boolean(taskLists.find((list) => list.id === mainListId)),
        });
      }
      setCurrentTaskListId(defaultList.id);
    } else if (import.meta.env.DEV) {
      console.log("[TaskContext] effect: idExists -> no change", { currentTaskListId });
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
