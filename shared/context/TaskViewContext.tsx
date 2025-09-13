import { createContext, useState, PropsWithChildren } from "react";
import type { TaskInterface } from "@shared/data/Tasks/interfaces";

interface TaskViewContextProps {
  currentTaskListId: string | null;
  setCurrentTaskListId: (id: string | null) => void;
  clickedTask: TaskInterface | null;
  setClickedTask: (task: TaskInterface | null) => void;
}

const TaskViewContext = createContext<TaskViewContextProps | undefined>(undefined);
export { TaskViewContext };

export function TaskViewProvider({ children }: PropsWithChildren) {
  const [currentTaskListId, setCurrentTaskListId] = useState<string | null>(null);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);

  const value = {
    currentTaskListId,
    setCurrentTaskListId,
    clickedTask,
    setClickedTask,
  };

  return <TaskViewContext.Provider value={value}>{children}</TaskViewContext.Provider>;
}
